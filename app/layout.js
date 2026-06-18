import "./globals.css";
import TopNav from "@/components/TopNav";

export const metadata = {
  title: "Nurse Informatics System",
  description: "Clinical nursing informatics demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Prevent flash of wrong theme before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.theme==='dark'||(localStorage.theme===undefined&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}` }} />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <TopNav />
        <main style={{ flex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
