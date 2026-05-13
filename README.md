# ⚡ OptiCV: AI-Powered Resume Optimizer

OptiCV is a full-stack, AI-driven SaaS platform designed to instantly analyze, optimize, and score your resume against any target Job Description. Built with a modern tech stack and a highly premium "Bento Grid" glassmorphic UI, OptiCV helps you beat the ATS (Applicant Tracking System) by identifying missing keywords, rewriting weak bullet points, and visualizing your impact.

## 🌟 Features

- **Split-View Workspace**: A hyper-dense 3-column dashboard that compares your original PDF text with AI-optimized injections in real time.
- **ATS Match Score Gauge**: A beautifully animated, dynamic score ring representing your compatibility with the job role.
- **Glassmorphic Parsed Skills**: Extracts missing skills and highlights them using glowing amber pills.
- **Bullet Point Refinement**: Visually compares your *Before* and *After* experience bullet points, tagging weak action verbs and suggesting stronger, result-driven alternatives.
- **Deep Analytics Visualization**: Uses `recharts` to render a **Keyword Frequency Bar Chart** and an **Impact Analysis Radar Chart**.
- **Dark/Light Mode**: Full theme toggle support out of the box with custom CSS variables and Tailwind dark variants.
- **In-Memory PDF Parsing**: The Node.js backend handles heavy PDF extraction without ever writing your private documents to disk.

## 🛠️ Tech Stack

### Frontend
- **React 19 (Vite)**
- **Tailwind CSS v3**
- **Framer Motion** 
- **Recharts** 
- **Lucide-React** 
- **TanStack Query (React Query)**

### Backend
- **Node.js & Express**
- **TypeScript**
- **Multer**
- **pdf-parse** 
- **Google Gemini API**

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Gaganjod/OptiCV-.git
   cd OptiCV-
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   cd frontend
   npm install
   ```
   Start the Vite development server:
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to see the app running!

## 💡 How it Works

1. **Upload**: Drag and drop your `.pdf` resume into the dropzone.
2. **Target**: Paste the complete text of the Job Description you are applying for.
3. **Analyze**: Click "Run AI Analysis". The frontend sends the PDF buffer to the backend.
4. **Parse**: The Express server intercepts the file in memory, extracts raw text using `pdf-parse`, and structures a strict prompt for the Gemini API.
5. **Optimize**: Gemini evaluates the text and returns a strictly typed JSON schema containing scores, missing keywords, and rewritten bullet points.
6. **Visualize**: The frontend maps this data into the glassmorphic dashboard!
