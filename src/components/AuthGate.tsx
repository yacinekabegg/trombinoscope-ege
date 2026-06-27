import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

const AUTH_KEY = 'ege_auth';
// Mot de passe injecté au build (secret GitHub REACT_APP_APP_PASSWORD).
// Valeur de repli pour que l'app reste utilisable si le secret n'est pas défini.
const APP_PASSWORD = process.env.REACT_APP_APP_PASSWORD || 'ege2026';

interface AuthGateProps {
  children: React.ReactNode;
}

const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const [authed, setAuthed] = useState<boolean>(
    () => sessionStorage.getItem(AUTH_KEY) === 'ok'
  );
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === APP_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'ok');
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (authed) {
    return <>{children}</>;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundColor: 'background.default',
      }}
    >
      <Paper sx={{ p: 4, width: '100%', maxWidth: 400, textAlign: 'center' }} elevation={3}>
        <LockIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
          Trombinoscope EGE
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Accès réservé — veuillez saisir le mot de passe
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            type="password"
            label="Mot de passe"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            fullWidth
            autoFocus
            error={error}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
              Mot de passe incorrect.
            </Alert>
          )}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Se connecter
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthGate;
