import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Assignment as ProjectIcon,
} from '@mui/icons-material';
import { Module, ProjectStatus } from '../types';
import { useFirebaseContext } from '../context/FirebaseContext';

const Modules: React.FC = () => {
  const { modules, projects, updateModule, addModule } = useFirebaseContext();
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const getModuleProjects = (moduleId: string) => {
    return projects.filter(project => project.moduleId === moduleId);
  };

  const getModuleStats = (moduleId: string) => {
    const moduleProjects = getModuleProjects(moduleId);
    const totalProjects = moduleProjects.length;
    const submittedProjects = moduleProjects.filter(p => p.status === ProjectStatus.SUBMITTED || p.status === ProjectStatus.VALIDATED).length;
    const validatedProjects = moduleProjects.filter(p => p.status === ProjectStatus.VALIDATED).length;
    const averageGrade = moduleProjects
      .filter(p => p.grade !== undefined)
      .reduce((sum, p) => sum + (p.grade || 0), 0) / moduleProjects.filter(p => p.grade !== undefined).length || 0;

    return {
      totalProjects,
      submittedProjects,
      validatedProjects,
      averageGrade: isNaN(averageGrade) ? 0 : averageGrade,
      submissionRate: totalProjects > 0 ? (submittedProjects / totalProjects) * 100 : 0,
    };
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setEditDialogOpen(true);
  };

  const handleSaveModule = () => {
    if (editingModule) {
      if (editingModule.id) {
        updateModule(editingModule);
      } else {
        const newModule = { ...editingModule, id: Date.now().toString() };
        addModule(newModule);
      }
    }
    setEditDialogOpen(false);
    setEditingModule(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Modules d'Enseignement
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingModule({
              id: '',
              name: '',
              description: '',
              color: '#1976d2',
            });
            setEditDialogOpen(true);
          }}
        >
          Ajouter Module
        </Button>
      </Box>

      <Grid container spacing={3}>
        {modules.map((module) => {
          const stats = getModuleStats(module.id);

          return (
            <Grid item xs={12} md={6} lg={4} key={module.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: `4px solid ${module.color}`,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ color: module.color }}>
                      {module.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleEditModule(module)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>

                  {module.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {module.description}
                    </Typography>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Projets</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {stats.submittedProjects}/{stats.totalProjects}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stats.submissionRate}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Chip
                        label={`${stats.totalProjects} projets`}
                        size="small"
                        variant="outlined"
                        icon={<ProjectIcon />}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Chip
                        label={`${stats.validatedProjects} validés`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>

                  {stats.averageGrade > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Moyenne: {stats.averageGrade.toFixed(1)}/20
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => {
                      // Navigation vers la page des projets avec filtre par module
                      navigate('/projects', { 
                        state: { 
                          filterModule: module.id,
                          moduleName: module.name 
                        } 
                      });
                    }}
                  >
                    Voir Projets
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Dialog d'édition de module */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingModule?.id ? 'Modifier le module' : 'Ajouter un nouveau module'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nom du module"
              value={editingModule?.name || ''}
              onChange={(e) => setEditingModule(prev => prev ? { ...prev, name: e.target.value } : null)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={editingModule?.description || ''}
              onChange={(e) => setEditingModule(prev => prev ? { ...prev, description: e.target.value } : null)}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Couleur (hex)"
              value={editingModule?.color || '#1976d2'}
              onChange={(e) => setEditingModule(prev => prev ? { ...prev, color: e.target.value } : null)}
              fullWidth
              placeholder="#1976d2"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveModule} variant="contained">
            {editingModule?.id ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Modules;
