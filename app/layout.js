import "./globals.css";
import TopNav from "@/components/TopNav";

export const metadata = {
  title: "Nurse Informatics System",
  description: "Clinical nursing informatics demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc", color: "#0f172a" }}>
        <TopNav />
        <main style={{ flex: 1 }}>{children}</main>
      </body>
    </html>
  );
}
