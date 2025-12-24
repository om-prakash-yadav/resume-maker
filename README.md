# AI Resume Builder

A modern, ATS-friendly resume builder powered by AI. Built with Next.js, Tailwind CSS, and Groq (Llama 3).

## Features

- **AI-Powered Improvements**: Use Groq (Llama 3) to enhance your summary, experience descriptions, and skills.
- **Real-time Preview**: See your resume update instantly as you type.
- **PDF Export**: Download your resume as a high-quality PDF.
- **ATS Friendly**: Clean, structured layout suitable for Applicant Tracking Systems.
- **Customizable**: Add or remove sections easily.

## Getting Started

1.  **Clone the repository** (if you haven't already).

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    - Rename `.env.local.example` to `.env.local` (or create it).
    - Add your Groq API Key:
      ```
      NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
      ```
    - You can get a free API key from [Groq Console](https://console.groq.com/keys).

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Groq SDK](https://www.npmjs.com/package/groq-sdk)
- [html2canvas](https://html2canvas.hertzen.com/) & [jspdf](https://github.com/parallax/jsPDF)
- [Lucide React](https://lucide.dev/) (Icons)

