
# AI Prompts Used

This project was built with assistance from Claude (Anthropic). Below are the key prompts and interactions:

## Initial Setup
- "Build a type of AI-powered application on Cloudflare with LLM, Workflow, User input, and Memory components"
- Requested help understanding Cloudflare Workers AI, Durable Objects, and Pages integration

## Development Prompts
- "Create a conversational AI chatbot with persistent memory"
- "Use Llama 3.3 via Workers AI"
- "Implement Durable Objects for session management"
- "Create a chat interface with Cloudflare Pages"

## UI/UX Design
- "Make it dark mode with purple accents"
- "Modern glassmorphism style"
- "Change the android icon to a more appealing icon"
- "Make the theme just a little bit darker"
- "Add my name to display at the end outside of container"

## Deployment & Troubleshooting
- Assistance with Cloudflare authentication
- Help fixing wrangler.toml for free tier (new_sqlite_classes)
- Debugging API_URL issues between localhost and production
- Git/GitHub deployment troubleshooting

## Architecture Decisions
- Used Llama 3.3 for AI responses
- Implemented Durable Objects with SQLite for conversation persistence
- Kept last 10 messages in memory to manage token limits
- Used glassmorphism design with dark purple theme