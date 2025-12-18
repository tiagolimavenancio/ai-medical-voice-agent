# 🩺 Doctor AI Agent

Doctor AI Agent is a modern **AI-powered medical voice assistant** built with **Next.js**.
It allows users to interact with an AI doctor through **real-time voice conversations**, leveraging speech-to-text, text-to-speech, and large language models.

This project is inspired by real-time AI voice agent implementations and educational content focused on building full-stack AI applications.

---

## 🎥 Demo & Reference

* 📺 Video Tutorial:
  [Build & Deploy a Real-Time AI Medical Voice Agent](https://www.youtube.com/watch?v=zjwj21wzs4U)

* 📦 Reference Repository:
  [https://github.com/sumamakhan761/Ai-docter-agent](https://github.com/sumamakhan761/Ai-docter-agent)

---

## ✨ Features

* 🎙️ Real-time voice interaction
* 🧠 AI-powered medical responses
* 🔊 Speech-to-Text using **AssemblyAI**
* 🗣️ Text-to-Speech using **Murf AI** (with browser fallback)
* 🔁 Turn-based conversation flow
* 👤 Authentication with **Clerk**
* 📝 Live captions for user and AI
* 💻 Responsive and modern UI
* 🗂️ Session-based conversation handling

> ⚠️ **Disclaimer:** This project is for educational purposes only and **does not replace professional medical advice**.

---

## 🛠️ Tech Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **AssemblyAI** – Speech-to-Text
* **Murf AI** – Text-to-Speech
* **OpenRouter / OpenAI** – AI responses
* **Clerk** – Authentication
* **Prisma** (optional) – Database ORM

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/doctor-ai-agent.git
cd doctor-ai-agent
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Environment variables

Create a `.env.local` file in the root of the project:

```env
# AI & Voice
NEXT_PUBLIC_ASSEMBLYAI_API_KEY=your_assemblyai_key
MURF_API_KEY=your_murf_key
OPEN_ROUTER_API_KEY=your_openrouter_key

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (optional)
DATABASE_URL=postgresql://user:password@localhost:5432/doctor_ai
```

---

### 4️⃣ Run the project

```bash
npm run dev
```

Open:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔄 Conversation Flow

1. User starts the voice session
2. AI greets the user
3. User speaks
4. Speech is converted to text
5. AI processes the input
6. AI responds with synthesized voice
7. Flow repeats until the session ends

---

## 🧪 Troubleshooting

**Microphone not working**

* Allow microphone access in browser
* Use Chrome or Edge

**Speech-to-Text issues**

* Check AssemblyAI API key

**Text-to-Speech issues**

* Ensure Murf AI key is valid
* Browser TTS will be used as fallback

**Auth issues**

* Verify Clerk keys and redirect URLs

---

## 📚 Learning Purpose

This project was created to explore:

* Real-time AI voice agents
* Full-stack AI applications with Next.js
* AI integrations for healthcare-related use cases
* Authentication and session management

---

## 📄 License

This project is licensed under the **MIT License**.

---

⭐ If you like this project, consider giving it a star!
