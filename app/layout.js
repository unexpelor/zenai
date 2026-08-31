import "./globals.css";

export const metadata = {
  title: "ZENAI",
  description: "Pahami. Putuskan. Tumbuh.",
  icons: {
    icon: "/zenai-mark.png",
    shortcut: "/zenai-mark.png",
    apple: "/zenai-mark.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
