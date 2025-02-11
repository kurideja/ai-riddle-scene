# AI Riddle Scene

> Note: Even this README was generated using Claude AI, staying true to the project's AI-assisted development approach.

An experimental project exploring AI-assisted development through an interactive 3D riddle game. The game features procedurally generated riddles using GPT-4, rendered in a dynamic 3D environment.

## 🤖 AI Integration

This project was developed with AI tools:
- GPT-4 for generating dynamic riddles via OpenAI API
- Claude AI for development guidance
- [Cursor](https://cursor.sh/) editor for AI-assisted coding

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) (v15.1.6) with Turbopack
- [React](https://reactjs.org/) (v19.0.0)
- [Three.js](https://threejs.org/) (v0.173.0) with React Three Fiber
- [OpenAI API](https://openai.com/api/) (v4.83.0)
- [TailwindCSS](https://tailwindcss.com/) (v3.4.1)
- [TypeScript](https://www.typescriptlang.org/) (v5)

## 🎮 Features

- 3D interactive environment with dynamic lighting and animations
- Procedurally generated riddles using GPT-4
- Progressive difficulty scaling
- Responsive design for both desktop and mobile
- Score tracking system

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone [your-repo-url]
cd ai-riddle-scene
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play the game.

## 🔑 Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required for riddle generation)

## 📝 Notes

- The game uses GPT-4 to generate unique riddles for each level
- The 3D scene adapts to device capabilities (mobile/desktop)
- Incorrect answers decrease score to add challenge
- Uses edge runtime for API routes

## 🌐 Deployment

Deploy on [Vercel](https://vercel.com) for the best experience. Make sure to:
1. Configure environment variables in your Vercel project settings
2. Enable edge functions for optimal performance

## 📄 License

[Your license here]
