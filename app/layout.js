import "./globals.css";

export const metadata = {
  title: "ZenAI",
  description: "AI Business Assistant",
};

export default function L({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
