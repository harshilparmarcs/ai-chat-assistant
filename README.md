
# CF AI Chat Assistant

A conversational AI chatbot with persistent memory built on Cloudflare's edge platform.

## Live Demo
- **Application**: https://main.ai-chat-assistant-60h.pages.dev
- **Worker API**: https://ai-chat-assistant.harshilparmar428.workers.dev

## Components
✅ **LLM**: Llama 3.3 via Cloudflare Workers AI  
✅ **Workflow**: Cloudflare Workers for coordination  
✅ **User Input**: Chat interface via Cloudflare Pages  
✅ **Memory**: Durable Objects with SQLite for persistent state  

## Local Development

### Prerequisites
- Node.js 16+
- Cloudflare account
- Wrangler CLI

### Setup
\`\`\`bash
npm install
npx wrangler login
\`\`\`

### Run Locally
\`\`\`bash
# Terminal 1: Start Worker
npx wrangler dev

# Terminal 2: Serve Frontend
npx serve public
\`\`\`

Update \`public/index.html\` API_URL to \`http://127.0.0.1:8787\` for local testing.

Open http://localhost:3000

## Deployment

### Deploy Worker
\`\`\`bash
npx wrangler deploy
\`\`\`

### Deploy Pages
Update \`public/index.html\` API_URL to your Worker URL, then:
\`\`\`bash
npx wrangler pages deploy public --project-name=ai-chat-assistant
\`\`\`

## Tech Stack
- Backend: Cloudflare Workers + Durable Objects (SQLite)
- AI: Llama 3.3 (Workers AI)
- Frontend: HTML/CSS/JavaScript
- Design: Glassmorphism with dark theme

## Author
Harshil Parmar