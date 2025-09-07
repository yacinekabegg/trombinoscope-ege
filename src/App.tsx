import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import Trombinoscope from './pages/Trombinoscope';
import Dashboard from './pages/Dashboard';
import Modules from './pages/Modules';
import Projects from './pages/Projects';

const theme = createTheme({
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Navigation />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - 240px)` },
                ml: { sm: '240px' },
              }}
            >
              <Routes>
                <Route path="/" element={<Trombinoscope />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/modules" element={<Modules />} />
                <Route path="/projects" element={<Projects />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
