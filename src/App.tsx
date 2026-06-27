import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Toolbar, CircularProgress, Snackbar, Alert } from '@mui/material';
import { AirtableProvider, useAirtableContext } from './context/AirtableContext';
import Navigation, { drawerWidth } from './components/Navigation';
import Trombinoscope from './pages/Trombinoscope';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import Projects from './pages/Projects';

let theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
});
theme = responsiveFontSizes(theme);

const Layout: React.FC = () => {
  const { loading, error } = useAirtableContext();
  const [errorOpen, setErrorOpen] = React.useState(false);

  React.useEffect(() => {
    if (error) setErrorOpen(true);
  }, [error]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {/* Espaceur sous la barre supérieure fixe (mobile uniquement) */}
        <Toolbar sx={{ display: { md: 'none' } }} />

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Routes>
            <Route path="/" element={<Trombinoscope />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        )}
      </Box>

      <Snackbar
        open={errorOpen}
        autoHideDuration={12000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setErrorOpen(false)} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AirtableProvider>
        <Router>
          <Layout />
        </Router>
      </AirtableProvider>
    </ThemeProvider>
  );
}

export default App;
