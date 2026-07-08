# TaskFlow Pro 🚀


TaskFlow Pro is a highly polished, full-stack productivity and task management application designed for both personal and business use. It features a stunning, state-of-the-art frosted glass UI (Glassmorphism), real-time data persistence, and interactive drag-and-drop Kanban boards.

Built with a focus on premium aesthetics and seamless user experience, TaskFlow Pro makes organizing your daily life and workflows not just efficient, but genuinely enjoyable.

---

## ✨ Key Features

- **🔒 Secure Authentication:** Fully custom JWT-based authentication system with real-time input validation, strong password enforcement, and a gorgeous animated neon-blob background.
- **📋 Smart Task Management:** Create, edit, and organize tasks across multiple custom lists. Easily mark tasks as important, set deadlines, and track your performance.
- **🖱️ Drag & Drop Kanban Board:** Visualize your workflow! Seamlessly drag tasks between "To Do", "In Progress", and "Complete" columns. The database updates your task status instantly.
- **🔍 Global Search:** A powerful, debounced global search command palette that lets you instantly find any task across all of your lists and navigate directly to it.
- **📈 Day-Wise Tracking & Streaks:** Advanced daily progress tracking with streak counters and dynamic heatmaps to keep you motivated and productive every single day.
- **🚀 Onboarding Wizard:** A beautiful, multi-step interactive onboarding flow to welcome new users and guide them through setting up their first project.
- **💡 Full-Stack Feedback System:** A dedicated, fully integrated user feedback mechanism connecting a stunning frontend form directly to a secure backend SQL database.
- **🎨 Premium UI/UX Engineering:** Built with Tailwind CSS, featuring subtle micro-animations, customized scrollbars, and dynamic gradients.
- **🛡️ Dual-Layer Security:** Secured via Cloudflare (Layer 1) and native ASP.NET Core Rate Limiting (Layer 2) to mitigate brute-forcing and API abuse.
- **⚡ Perceived Performance:** Integrated advanced Shimmer UI (skeleton loaders) to mask network latency and ensure the app feels instantaneous.
- **💎 Hardware-Accelerated Scrolling:** Powered by the Lenis smooth-scrolling engine for a luxurious, "royal" scrolling experience alongside glassmorphism and parallax backgrounds.
- **🌗 Seamless Light & Dark Mode:** Carefully engineered global theming architecture ensuring flawless accessibility and contrast across both visual modes.
- **👨‍💻 Integrated Developer Portfolio:** A massive, dedicated "About" page acting as an immersive portfolio—showcasing the complete 1-month engineering sprint, tech stack, and developer profile.

---

## 📸 Screenshots

*(Replace the image paths below with the actual screenshots before pushing to GitHub)*

### 1. Authentication Interface

<p align="center">
  <img src="./Docs/login.png" alt="Login Page" width="600" />
  <br /><br />
  <img src="./Docs/registration.png" alt="Registration Page" width="600" />
</p>
> *The login and registration flow featuring real-time password strength validation, regex email checking, and the signature animated floating neon blobs in the background.*

### 2. Dashboard & Today's Progress
![Dashboard View](./Docs/Dashboard.png)
> *The main dashboard summarizing your day. Features a mathematical SVG circular progress indicator that perfectly tracks your daily task completion rate.*

### 3. Interactive Kanban Board
![Kanban Board](./Docs/Kanban_Dashboard.png)
> *The list view configured as a Kanban Board. Users can click and drag tasks effortlessly between status columns, triggering real-time database updates.*

### 4. Global Search Palette
![Global Search](./Docs/Global_Search.png)
> *The debounced global search dropdown in the Navbar, allowing users to instantly locate tasks across their entire workspace.*

---

## 🛠️ Technology Stack

**Frontend (Client)**
- React 19 (TypeScript)
- Vite (Build Tool)
- Tailwind CSS v4 (Styling & Animations)
- Lucide React (Icons)
- Context API (State Management)
- Lenis (Smooth Scrolling)

**Backend (API)**
- .NET 8 (C# ASP.NET Core Web API)
- Entity Framework Core
- Microsoft SQL Server
- JWT Bearer Authentication
- ASP.NET Core Rate Limiting

---

## 🚀 Installation & Setup

Before starting, ensure you have **Node.js**, **.NET 8 SDK**, and **SQL Server** installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/Jamiwal-3704/taskflow-pro.git
cd taskflow-pro
```

### 2. Backend Setup (.NET API)
1. Navigate to the API directory:
   ```bash
   cd TaskFlowPro.API
   ```
2. Update the `appsettings.json` file with your local SQL Server connection string. (Ensure `appsettings.Development.json` is not committed).
3. Apply the Entity Framework database migrations:
   ```bash
   dotnet ef database update
   ```
4. Run the API Server:
   ```bash
   dotnet run
   ```
   *The server will start on `http://localhost:5100`. You can access the Swagger UI at `/swagger`.*

### 3. Frontend Setup (React/Vite)
1. Open a new terminal and navigate to the client directory:
   ```bash
   cd taskflow-client
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`.*

---

## 🔮 Future Scope

While TaskFlow Pro is fully operational, development is continuous! Here are the features currently planned for the roadmap to show that this project is actively evolving:

- [ ] **Collaborative Lists:** Invite other users to your lists via email to collaborate on projects, assign tasks to specific team members, and chat in real-time.
- [ ] **Workout / Fitness Integrations:** A dedicated module for tracking gym routines, exercise templates, and workout logs directly within the TaskFlow ecosystem.
- [ ] **Push Notifications:** Web-based push notifications to remind users of impending task deadlines and daily check-ins.
- [ ] **Task Attachments:** Allow users to upload and attach images or PDFs directly to specific tasks.

---

> **Note on Security:** All sensitive files, including `.env`, `appsettings.Development.json`, and database connection strings, have been strictly excluded via `.gitignore` to ensure safe deployment and repository sharing.

---

<div align="center">
  <i>made with lots of love ❤️ by <b style="text-shadow: 0 0 10px #a78bfa, 0 0 20px #a78bfa; color: #a78bfa;">✨ Sahil Ittan ✨</b></i>
</div>
