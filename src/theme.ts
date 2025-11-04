import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // <— força modo claro
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
    text: { primary: '#000000' },
  },
});

export default theme;
