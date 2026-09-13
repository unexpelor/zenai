import { getLocale, getMessages } from "next-intl/server";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { ZenLocaleProvider } from "../providers/ZenLocaleProvider";
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

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <ZenLocaleProvider initialLocale={locale} initialMessages={messages}>
          {children}
          <LanguageSwitcher />
        </ZenLocaleProvider>
      </body>
    </html>
  );
}
