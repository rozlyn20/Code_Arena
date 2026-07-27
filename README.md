# 🚀 CodeArena

> **A modern collaborative coding and developer workspace for pair programming, technical interviews, placement preparation, and real-time team collaboration.**

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black?logo=socket.io)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI-38BDF8?logo=tailwind-css)

---

# 📖 About

CodeArena is a real-time collaborative coding platform built for developers, students, and interview preparation.

It combines a live collaborative code editor with a persistent developer workspace, allowing teams to discuss ideas, prepare for interviews, and code together in real time.

Whether you're conducting mock interviews, pair programming, mentoring, or practicing DSA with friends, CodeArena provides everything needed in one platform.

---

# ✨ Features

## 💻 Live Coding

- 🚀 Create and join coding rooms
- 👨‍💻 Real-time collaborative code editor
- ⚡ Instant synchronization using Socket.IO
- 💻 Multi-language code execution
- 📋 One-click room sharing
- 👥 Live participant list
- 🌙 Dark modern interface

---

## 💬 Team Workspace

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 🏠 Personal Workspace Dashboard
- 💬 Real-time discussion rooms
- 📚 Persistent chat history using MongoDB
- ⚡ Live messaging with Socket.IO
- 📂 Create & Join discussion rooms

---

## 🎨 User Experience

- Modern SaaS-inspired UI
- Fully responsive design
- Glassmorphism interface
- Framer Motion animations
- Toast notifications
- Consistent dark theme

---

# 🛠 Tech Stack

## Frontend

- React
- React Router
- Tailwind CSS
- Framer Motion
- React Hot Toast
- Monaco Editor
- Socket.IO Client

---

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Socket.IO
- JWT Authentication
- bcrypt.js

---

## Development Tools

- Vite
- Git
- GitHub

---

# 🏗 Architecture

```
                   CodeArena

         ┌────────────────────────┐
         │      Landing Page      │
         └────────────┬───────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼

 Team Workspace              Live Coding

 Login / Signup             Create Room
        │                   Join Room
        ▼                        │
 Dashboard                  Code Editor
        │                        │
 Chat Rooms             Real-Time Collaboration
        │                        │
 MongoDB + Socket.IO      Code Execution
```

---

# 📂 Project Structure

```
CodeArena
│
├── client
│   ├── components
│   ├── pages
│   ├── chat
│   │   ├── components
│   │   └── Workspace.jsx
│   ├── socket
│   └── App.jsx
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── socket
│   └── server.js
│
└── README.md
```

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/rozlyn20/CodeArena.git

cd CodeArena
```

---

## Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd server
npm install
```

---

## Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

## Run the application

### Backend

```bash
npm run server
```

### Frontend

```bash
npm run dev
```

---

# 🚀 Upcoming Features

- 🤖 AI Coding Assistant
- 🎙 Voice Chat
- 📝 Collaborative Whiteboard
- 📁 File Sharing
- 🧪 Interview Mode


---

# 📸 Screenshots

### Landing Page

> <img width="1365" height="611" alt="image" src="https://github.com/user-attachments/assets/d987123e-3ad7-4a10-a0e1-97faa64ffe0f" />


---

### Team Workspace

> <img width="1359" height="344" alt="image" src="https://github.com/user-attachments/assets/8d3bb8fb-4349-47a9-8459-3cc98a2d7553" />


---

### Discussion Room

> <img width="981" height="265" alt="image" src="https://github.com/user-attachments/assets/0995e5e6-0567-44c7-8652-e28e47e1bd4f" />


---

### Live Coding Room

> <img width="469" height="214" alt="image" src="https://github.com/user-attachments/assets/ef03575a-8442-47c3-8f3c-a958c7f43ab0" />


---

# 💡 Why CodeArena?

Unlike traditional online editors, CodeArena combines:

- Live collaborative coding
- Persistent developer workspaces
- Team discussions
- Interview preparation
- Real-time communication

into one unified developer platform.

---

# 🤝 Contributing

Contributions are welcome!

```bash
Fork the repository

Create your feature branch

git checkout -b feature-name

Commit your changes

git commit -m "Add amazing feature"

Push to GitHub

git push origin feature-name

Open a Pull Request
```

---

# 👩‍💻 Author

**Rose**

MCA Student @ Jawaharlal Nehru University

Full Stack Developer • MERN Stack • Problem Solver

🔗 GitHub

https://github.com/rozlyn20

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!

It helps others discover the project and motivates future development.
