An AI-powered lyric generator built on Cloudflare Workers using Llama 3.3 on Workers AI.  

Deployed Link: 
https://muddy-feather-6a25.mikewin01.workers.dev/

Features
- Type in a theme and choose a genre (jazz, blues, rock)
- Click the button to generate song lyrics with Llama 3.3 on Cloudflare Workers AI  
- View previous lyric history using Cloudflare KV Storage    

Architecture Overview
| Cloudflare Workers | Handles requests, AI calls, and serves frontend assets |
| Workers AI (Llama 3.3) | Generates lyrics based on theme and genre |
| Cloudflare KV | Stores the last 5 generated lyrics for persistence |
| Static Assets (HTML + JS) | frontend for user interaction |
