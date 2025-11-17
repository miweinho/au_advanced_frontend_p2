"use client";

import { PropsWithChildren, useState } from "react";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createEmotionCache from "./createEmotionCache";

// Criar tema claro personalizado
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // Azul moderno
      light: "#3b82f6",
      dark: "#1d4ed8",
    },
    secondary: {
      main: "#7c3aed", // Roxo moderno
      light: "#8b5cf6",
      dark: "#6d28d9",
    },
    background: {
      default: "#f8fafc", // Cinza muito claro
      paper: "#ffffff",   // Branco puro
    },
    text: {
      primary: "#1e293b", // Cinza escuro para texto
      secondary: "#64748b", // Cinza médio
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 700,
      color: "#1e293b",
    },
    h6: {
      fontWeight: 600,
      color: "#1e293b",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          border: "1px solid #e2e8f0",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          padding: "8px 16px",
        },
        contained: {
          background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
          },
        },
        outlined: {
          borderColor: "#e2e8f0",
          "&:hover": {
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.04)",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
          paddingTop: "24px",
          paddingBottom: "24px",
        },
      },
    },
  },
});

export default function EmotionRegistry({ children }: PropsWithChildren) {
  const [cache] = useState(() => createEmotionCache());

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Isso reseta o CSS e aplica o tema claro */}
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}