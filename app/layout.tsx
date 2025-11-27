import "./globals.css";
import EmotionRegistry from "./EmotionRegistry";
import Shell from "./components/Shell";
import { AuthProvider } from "./ui/AuthProvider";

export const metadata = {
  title: "AU 25 Advanced Frontend Group 31",
  description: "Next.js fitness application.",
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      <body>
        {/* Emotion/Theme providers kept at root */}
        <EmotionRegistry>
          {/* Provide auth to the whole app (token normalization, set axios header) */}
          <AuthProvider>
            {/* Shell decides whether to show the global AppBar/Drawer or render children (login) */}
            <Shell>{children}</Shell>
          </AuthProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}