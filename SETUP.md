# Nukhba AI - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```env
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Get your OpenAI API key:**
1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy and paste it into `.env.local`

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Mobile-First Design

The app is built with a mobile-first approach:
- Responsive breakpoints: `sm:`, `md:`, `lg:`
- Touch-friendly buttons and interactions
- Optimized for screens as small as 320px
- RTL (Right-to-Left) support for Arabic

## 🎯 Features Implemented

### ✅ AI Tutor Service
- **Location:** `src/services/tutor.ts`
- **Function:** `sendMessageToTutor(messages, language)`
- **Model:** GPT-4o (with fallback to GPT-3.5-turbo)
- **Features:**
  - Multi-language support (English, Arabic, Hindi)
  - Structured JSON responses with answers and follow-up questions
  - Error handling and user-friendly messages

### ✅ Voice Interaction Hook
- **Location:** `src/hooks/useVoiceInteraction.ts`
- **Features:**
  - Speech-to-Text (Microphone input)
  - Text-to-Speech (Audio output)
  - Dynamic language switching
  - Browser compatibility checks
  - Error handling for microphone permissions

### ✅ AI Tutor Component
- **Location:** `src/components/AITutor.tsx`
- **Features:**
  - Real-time AI conversations
  - Voice and text input modes
  - Auto-speak AI responses in voice mode
  - Follow-up question suggestions
  - RTL support for Arabic
  - Rate limiting for free tier

### ✅ Quiz Module
- **Location:** `src/components/QuizModule.tsx`
- **Features:**
  - 5 sample questions (mix of languages)
  - Real-time scoring
  - Explanation for each answer
  - Result card with retake option
  - Progress tracking

## 🔧 Production Build

```bash
npm run build
npm start
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `NEXT_PUBLIC_TEMPO` | Enable Tempo DevTools | No |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | No |

## 🌐 Browser Support

### Voice Features
- **Speech Recognition:** Chrome, Edge, Safari (WebKit)
- **Text-to-Speech:** All modern browsers

### Recommended Browsers
- Chrome 33+ (Best support)
- Edge 79+
- Safari 14.1+
- Firefox (Limited voice support)

## 🐛 Troubleshooting

### OpenAI API Errors
- **"API key not configured"**: Check your `.env.local` file
- **"Rate limit exceeded"**: Upgrade your OpenAI plan or wait
- **"Invalid API key"**: Verify your key at [platform.openai.com](https://platform.openai.com)

### Voice Recognition Issues
- **"Microphone access denied"**: Allow microphone permissions in browser settings
- **"Not supported"**: Use Chrome, Edge, or Safari for best voice support
- **No speech detected**: Speak clearly and check microphone volume

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (requires Node 18+)
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## 📚 Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── page.tsx      # Main page
│   └── layout.tsx    # Root layout
├── components/       # React components
│   ├── AITutor.tsx   # AI Tutor chat interface
│   ├── QuizModule.tsx # Quiz component
│   └── ui/           # UI component library
├── hooks/            # Custom React hooks
│   └── useVoiceInteraction.ts
├── services/         # API services
│   └── tutor.ts      # OpenAI integration
└── lib/              # Utilities
    └── utils.ts      # Helper functions
```

## 🎓 Exam Preparation Content

The app includes sample questions for:
- **UGC NET Paper 1** (General Paper)
- **Arabic Grammar** (نحو عربي)
- **Teaching Aptitude**
- **Quantitative Aptitude**
- **Research Methodology**

## 🔒 Security Notes

- Never commit `.env.local` to version control
- API keys are exposed to the client (NEXT_PUBLIC_*)
- Consider using a backend proxy for production
- Implement rate limiting on the server side

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify environment variables are set correctly

---

**Built with:** Next.js 15, React 18, TypeScript, Tailwind CSS, OpenAI API

