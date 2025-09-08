import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  AvatarGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Assignment as ProjectIcon,
  Schedule as ScheduleIcon,
  Grade as GradeIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { format, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Project, ProjectStatus, Student } from '../types';
import { useFirebaseContext } from '../context/FirebaseContext';
import { getStudentInitials } from '../utils/photoUtils';

const Projects: React.FC = () => {
  const { projects, students, modules, updateProject, addProject, deleteProject } = useFirebaseContext();
  const location = useLocation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [filteredModule, setFilteredModule] = useState<string | null>(null);

  // Gérer le filtre par module depuis la navigation
  useEffect(() => {
    if (location.state?.filterModule) {
      setFilteredModule(location.state.filterModule);
    }
  }, [location.state]);

  const getModuleName = (moduleId: string) => {
    return modules.find(m => m.id === moduleId)?.name || 'Module inconnu';
  };

  // Filtrer les projets selon le module sélectionné
  const filteredProjects = filteredModule 
    ? projects.filter(project => project.moduleId === filteredModule)
    : projects;

  const getModuleColor = (moduleId: string) => {
    return modules.find(m => m.id === moduleId)?.color || '#1976d2';
  };

  const getProjectStudents = (project: Project) => {
    return students.filter(s => project.studentIds.includes(s.id));
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.NOT_SUBMITTED:
        return 'error';
      case ProjectStatus.SUBMITTED:
        return 'warning';
      case ProjectStatus.TO_CORRECT:
        return 'info';
      case ProjectStatus.VALIDATED:
        return 'success';
      default:
        return 'default';
    }
  };

  const isOverdue = (deadline: Date, status: ProjectStatus) => {
    if (!deadline || !(deadline instanceof Date) || isNaN(deadline.getTime())) {
      return false;
    }
    return isAfter(new Date(), deadline) && status === ProjectStatus.NOT_SUBMITTED;
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setSelectedStudents(getProjectStudents(project));
    setEditDialogOpen(true);
  };

  const handleSaveProject = () => {
    if (editingProject) {
      const updatedProject = {
        ...editingProject,
        studentIds: selectedStudents.map(s => s.id),
        updatedAt: new Date(),
      };
      
      // Vérifier si c'est un nouveau projet ou une modification
      const isExistingProject = projects.some(p => p.id === editingProject.id);
      
      if (isExistingProject) {
        updateProject(updatedProject);
      } else {
        addProject(updatedProject);
      }
    }
    setEditDialogOpen(false);
    setEditingProject(null);
    setSelectedStudents([]);
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      moduleId: modules[0]?.id || '',
      name: '',
      description: '',
      deadline: new Date(),
      studentIds: [],
      status: ProjectStatus.NOT_SUBMITTED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEditingProject(newProject);
    setSelectedStudents([]);
    setEditDialogOpen(true);
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      const updatedProject = { ...project, status: newStatus, updatedAt: new Date() };
      updateProject(updatedProject);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project && window.confirm(`Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ? Cette action ne peut pas être annulée.`)) {
      deleteProject(projectId);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            Gestion des Projets
          </Typography>
          {filteredModule && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <FilterIcon fontSize="small" color="primary" />
              <Chip
                label={`Module: ${getModuleName(filteredModule)}`}
                color="primary"
                variant="outlined"
                onDelete={() => setFilteredModule(null)}
                size="small"
              />
            </Box>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProject}
        >
          Nouveau Projet
        </Button>
      </Box>

      <Grid container spacing={3}>
        {filteredProjects.map((project) => {
          const projectStudents = getProjectStudents(project);
          const moduleName = getModuleName(project.moduleId);
          const moduleColor = getModuleColor(project.moduleId);
          const overdue = isOverdue(project.deadline, project.status);

          return (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: `4px solid ${moduleColor}`,
                  ...(overdue && {
                    border: '2px solid #f44336',
                    backgroundColor: '#ffebee',
                  }),
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ color: moduleColor }}>
                      {project.name}
                    </Typography>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditProject(project)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteProject(project.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Chip
                    label={moduleName}
                    size="small"
                    sx={{ backgroundColor: moduleColor, color: 'white', mb: 2 }}
                  />

                  {project.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {project.description}
                    </Typography>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <ScheduleIcon fontSize="small" />
                      <Typography variant="body2">
                        Deadline: {project.deadline ? format(project.deadline, 'dd/MM/yyyy', { locale: fr }) : 'Non définie'}
                      </Typography>
                      {overdue && (
                        <Chip label="En retard" size="small" color="error" />
                      )}
                    </Box>

                    {project.submissionDate && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <ProjectIcon fontSize="small" />
                        <Typography variant="body2">
                          Rendu: {project.submissionDate ? format(project.submissionDate, 'dd/MM/yyyy', { locale: fr }) : 'Non défini'}
                        </Typography>
                      </Box>
                    )}

                    {project.grade && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <GradeIcon fontSize="small" />
                        <Typography variant="body2" fontWeight="bold">
                          Note: {project.grade}/20
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Groupe ({projectStudents.length} étudiant(s)):
                    </Typography>
                    <AvatarGroup max={4}>
                      {projectStudents.map((student) => (
                        <Tooltip key={student.id} title={`${student.firstName} ${student.lastName}`}>
                          <Avatar 
                            src={student.photo && student.photo.trim() !== '' ? student.photo : undefined}
                            alt={`${student.firstName} ${student.lastName}`}
                          >
                            {(!student.photo || student.photo.trim() === '') && getStudentInitials(student.firstName, student.lastName)}
                          </Avatar>
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={project.status}
                      color={getStatusColor(project.status) as any}
                      size="small"
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={project.status}
                        onChange={(e) => handleStatusChange(project.id, e.target.value as ProjectStatus)}
                        size="small"
                      >
                        {Object.values(ProjectStatus).map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {project.comments && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                      "{project.comments}"
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<PeopleIcon />}
                    onClick={() => handleEditProject(project)}
                  >
                    Gérer Groupe
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Dialog d'édition de projet */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProject?.id && projects.find(p => p.id === editingProject.id) ? 'Modifier le projet' : 'Nouveau projet'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nom du projet"
              value={editingProject?.name || ''}
              onChange={(e) => setEditingProject(prev => prev ? { ...prev, name: e.target.value } : null)}
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={editingProject?.description || ''}
              onChange={(e) => setEditingProject(prev => prev ? { ...prev, description: e.target.value } : null)}
              fullWidth
              multiline
              rows={3}
            />

            <FormControl fullWidth required>
              <InputLabel>Module</InputLabel>
              <Select
                value={editingProject?.moduleId || ''}
                onChange={(e) => setEditingProject(prev => prev ? { ...prev, moduleId: e.target.value } : null)}
                label="Module"
              >
                {modules.map((module) => (
                  <MenuItem key={module.id} value={module.id}>
                    {module.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Deadline"
              type="date"
              value={editingProject?.deadline ? format(editingProject.deadline, 'yyyy-MM-dd') : ''}
              onChange={(e) => setEditingProject(prev => prev ? { ...prev, deadline: new Date(e.target.value) } : null)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />

            <Autocomplete
              multiple
              options={students}
              value={selectedStudents}
              onChange={(event, newValue) => setSelectedStudents(newValue)}
              getOptionLabel={(student) => `${student.firstName} ${student.lastName} (${student.studentNumber})`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Étudiants du groupe"
                  placeholder="Sélectionner les étudiants"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((student, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={student.id}
                    avatar={
                      <Avatar src={student.photo && student.photo.trim() !== '' ? student.photo : undefined}>
                        {(!student.photo || student.photo.trim() === '') && getStudentInitials(student.firstName, student.lastName)}
                      </Avatar>
                    }
                    label={`${student.firstName} ${student.lastName}`}
                  />
                ))
              }
            />

            {editingProject?.status === ProjectStatus.SUBMITTED || editingProject?.status === ProjectStatus.VALIDATED ? (
              <>
                <TextField
                  label="Date de rendu"
                  type="date"
                  value={editingProject?.submissionDate ? format(editingProject.submissionDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, submissionDate: new Date(e.target.value) } : null)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="Note (/20)"
                  type="number"
                  value={editingProject?.grade || ''}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, grade: parseFloat(e.target.value) || undefined } : null)}
                  fullWidth
                  inputProps={{ min: 0, max: 20, step: 0.5 }}
                />

                <TextField
                  label="Commentaires"
                  value={editingProject?.comments || ''}
                  onChange={(e) => setEditingProject(prev => prev ? { ...prev, comments: e.target.value } : null)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </>
            ) : null}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveProject} variant="contained">
            {editingProject?.id && projects.find(p => p.id === editingProject.id) ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Projects;
