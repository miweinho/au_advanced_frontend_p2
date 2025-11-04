'use client';

import { ReactNode, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../src/theme';

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
