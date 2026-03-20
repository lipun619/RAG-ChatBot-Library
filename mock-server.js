/**
 * Simple mock API server for testing the AI chat widget.
 *
 * Supports both streaming (SSE) and non-streaming JSON responses.
 *
 * Usage:
 *   node mock-server.js              # Start on port 3000
 *   node mock-server.js --stream     # Enable streaming responses
 */

const http = require('http');

const PORT = 3000;
const STREAMING = process.argv.includes('--stream');

const responses = {
  default: `I'm an AI assistant for Lipun Patel's portfolio. I can answer questions about his skills, experience, and projects. What would you like to know?`,
  technologies: `Lipun works with a modern full-stack technology stack:

- **Backend:** .NET (C#), ASP.NET Core, Web API
- **Frontend:** Angular, TypeScript, TailwindCSS
- **Database:** SQL Server, PostgreSQL
- **Cloud:** Microsoft Azure, Docker
- **Languages:** C#, TypeScript, Python, SQL
- **Tools:** Git, VS Code, Visual Studio, Azure DevOps

He specializes in building enterprise-grade applications with clean architecture.`,
  experience: `Lipun Patel is a **Full-Stack Developer** with expertise in enterprise software development.

### Key Highlights:
1. Extensive experience with **.NET** and **Angular** ecosystems
2. Strong background in **SQL Server** database design and optimization
3. Experience with **cloud deployment** on Azure
4. Proficient in **Agile/Scrum** methodologies

He focuses on writing clean, maintainable code and building scalable applications.`,
  projects: `Here are some notable projects Lipun has worked on:

### 1. AI Chat Widget Library
An Angular NPM package providing a floating AI chat bubble with:
- Streaming response support
- Markdown rendering with code highlighting
- Terminal-inspired dark theme

### 2. Enterprise Web Applications
Full-stack applications built with:
\`\`\`typescript
// Tech stack example
const stack = {
  frontend: 'Angular 19',
  backend: 'ASP.NET Core 8',
  database: 'SQL Server',
  cloud: 'Azure App Service'
};
\`\`\`

### 3. Data Processing Pipelines
Python-based data processing solutions for analytics and reporting.`,
};

function getResponse(question) {
  const q = question.toLowerCase();
  if (q.includes('technolog') || q.includes('stack') || q.includes('skill')) {
    return responses.technologies;
  }
  if (q.includes('experience') || q.includes('background') || q.includes('about')) {
    return responses.experience;
  }
  if (q.includes('project') || q.includes('work') || q.includes('built')) {
    return responses.projects;
  }
  return responses.default;
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && (req.url === '/api/chat' || req.url === '/chat')) {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const { question } = JSON.parse(body);
        const answer = getResponse(question || '');

        if (STREAMING) {
          // ── Streaming SSE response ──
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          });

          const words = answer.split(' ');
          let index = 0;

          const interval = setInterval(() => {
            if (index < words.length) {
              const chunk = (index === 0 ? '' : ' ') + words[index];
              res.write(`data: ${JSON.stringify({ answer: chunk })}\n\n`);
              index++;
            } else {
              res.write('data: [DONE]\n\n');
              res.end();
              clearInterval(interval);
            }
          }, 50); // 50ms per word for natural typing feel
        } else {
          // ── Standard JSON response ──
          // Simulate slight delay for realism
          setTimeout(() => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ answer }));
          }, 500);
        }
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`\n  Mock API Server running at http://localhost:${PORT}`);
  console.log(`  Mode: ${STREAMING ? 'STREAMING (SSE)' : 'Standard JSON'}`);
  console.log(`  Endpoint: POST /api/chat`);
  console.log(`  Body: { "question": "..." }\n`);
});
