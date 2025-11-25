import "./globals.css";
import EmotionRegistry from "./EmotionRegistry";

export const metadata = {
  title: "Fitness App - Seu Personal Trainer Digital",
  description: "Gerencie seus programas de treino e alcance seus objetivos fitness",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <EmotionRegistry>
          {children}
        </EmotionRegistry>
      </body>
    </html>
  );
}