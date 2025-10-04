

export interface Env {
  AI: any;
  CHAT_SESSIONS: DurableObjectNamespace;
}

export class ChatSession {

  state: DurableObjectState;
  messages: Array<{ role: string; content: string }>;

  constructor(state: DurableObjectState) {
    this.state = state;
    this.messages = [];
  }

  async initialize() {
    const stored = await this.state.storage.get<Array<{ role: string; content: string }>>("messages");
    if (stored) {
      this.messages = stored;
    }
  }

  async fetch(request: Request) {
    await this.initialize();

    if (request.method === "POST") {
      const { message } = await request.json() as { message: string };
      
      // Add user message to history
      this.messages.push({ role: "user", content: message });
      
      // Keep only last 10 messages to avoid token limits
      if (this.messages.length > 10) {
        this.messages = this.messages.slice(-10);
      }
      
      // Save to storage
      await this.state.storage.put("messages", this.messages);
      
      return new Response(JSON.stringify({ 
        success: true, 
        messageCount: this.messages.length 
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (request.method === "GET") {
      return new Response(JSON.stringify({ messages: this.messages }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (request.method === "DELETE") {
      this.messages = [];
      await this.state.storage.delete("messages");
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("Method not allowed", { status: 405 });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Chat endpoint
    if (url.pathname === "/api/chat") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }

      const { message, sessionId } = await request.json() as { message: string; sessionId: string };

      // Get or create session
      const id = env.CHAT_SESSIONS.idFromName(sessionId);
      const session = env.CHAT_SESSIONS.get(id);

      // Store user message
      await session.fetch(new Request("http://internal/", {
        method: "POST",
        body: JSON.stringify({ message })
      }));

      // Get conversation history
      const historyResponse = await session.fetch(new Request("http://internal/", {
        method: "GET"
      }));
      const { messages } = await historyResponse.json() as { messages: Array<{ role: string; content: string }> };

      // Call Workers AI
      const aiResponse = await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
        messages: [
          { role: "system", content: "You are a helpful AI assistant. Be concise and friendly." },
          ...messages
        ],
        stream: false
      });

      const assistantMessage = aiResponse.response;

      // Store assistant response
      await session.fetch(new Request("http://internal/", {
        method: "POST",
        body: JSON.stringify({ message: assistantMessage })
      }));

      return new Response(JSON.stringify({ 
        response: assistantMessage,
        messageCount: messages.length + 2
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Clear session endpoint
    if (url.pathname === "/api/clear") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }

      const { sessionId } = await request.json() as { sessionId: string };
      const id = env.CHAT_SESSIONS.idFromName(sessionId);
      const session = env.CHAT_SESSIONS.get(id);

      await session.fetch(new Request("http://internal/", {
        method: "DELETE"
      }));

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response("Not found", { status: 404 });
  },
};