import React, { useState } from 'react';
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';
import {
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Edit as EditIcon,
  Add as AddIcon,
  FileDownload as ExportIcon,
  PhotoCamera as PhotoIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Student } from '../types';
import { useAppContext } from '../context/AppContext';
import { exportToExcel, exportToPDF, exportTrombinoscopeToPDF } from '../utils/exportUtils';
import { getStudentInitials } from '../utils/photoUtils';

type ViewMode = 'gallery' | 'table';

const Trombinoscope: React.FC = () => {
  const { students, projects, modules, updateStudent, addStudent, resetData } = useAppContext();
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    firstName: '',
    lastName: '',
    email: '',
    studentNumber: '',
  });

  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null,
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = true) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target?.result as string;
        if (isEditing && editingStudent) {
          setEditingStudent(prev => prev ? { ...prev, photo: photoUrl } : null);
        } else {
          setNewStudent(prev => ({ ...prev, photo: photoUrl }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (isEditing: boolean = true) => {
    if (isEditing && editingStudent) {
      setEditingStudent(prev => prev ? { ...prev, photo: '' } : null);
    } else {
      setNewStudent(prev => ({ ...prev, photo: '' }));
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setEditDialogOpen(true);
  };

  const handleSaveStudent = () => {
    if (editingStudent) {
      updateStudent(editingStudent);
    }
    setEditDialogOpen(false);
    setEditingStudent(null);
  };

  const handleAddStudent = () => {
    if (newStudent.firstName && newStudent.lastName && newStudent.email && newStudent.studentNumber) {
      const student: Student = {
        id: Date.now().toString(),
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        email: newStudent.email,
        studentNumber: newStudent.studentNumber,
        photo: `https://via.placeholder.com/150/4CAF50/white?text=${newStudent.firstName[0]}${newStudent.lastName[0]}`,
      };
      addStudent(student);
      setNewStudent({
        firstName: '',
        lastName: '',
        email: '',
        studentNumber: '',
      });
      setAddDialogOpen(false);
    }
  };

  const handleExportExcel = () => {
    exportToExcel(students, projects, modules, 'trombinoscope_ege');
  };

  const handleExportPDF = () => {
    exportToPDF(students, projects, modules, 'trombinoscope_ege');
  };

  const handleExportTrombinoscopePDF = () => {
    exportTrombinoscopeToPDF(students, 'trombinoscope-gallery', 'trombinoscope_photos');
  };


  const getStudentProjects = (studentId: string) => {
    return projects.filter(project => project.studentIds.includes(studentId));
  };


  const getModuleColor = (moduleId: string) => {
    return modules.find(m => m.id === moduleId)?.color || '#1976d2';
  };

  const renderGalleryView = () => (
    <Grid container spacing={3} id="trombinoscope-gallery">
      {students.map((student) => {
        const studentProjects = getStudentProjects(student.id);
        
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={student.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
                border: selectedStudents.includes(student.id) ? '2px solid' : 'none',
                borderColor: 'primary.main',
                height: '100%',
                minHeight: 420,
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={() => handleStudentSelect(student.id)}
            >
              {student.photo && student.photo.trim() !== '' ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={student.photo}
                  alt={`${student.firstName} ${student.lastName}`}
                  sx={{ objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    fontSize: '4rem',
                    fontWeight: 'bold'
                  }}
                >
                  {getStudentInitials(student.firstName, student.lastName)}
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flexGrow: 1, pr: 1 }}>
                    <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
                      {student.firstName} {student.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {student.studentNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
                      {student.email}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{ 
                      flexShrink: 0,
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.08)',
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStudent(student);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Section des projets */}
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                    Projets ({studentProjects.length})
                  </Typography>
                  {studentProjects.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {studentProjects.slice(0, 3).map((project) => (
                        <Chip
                          key={project.id}
                          label={project.name}
                          size="small"
                          sx={{
                            backgroundColor: getModuleColor(project.moduleId),
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 20,
                            '& .MuiChip-label': {
                              px: 1
                            }
                          }}
                        />
                      ))}
                      {studentProjects.length > 3 && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          +{studentProjects.length - 3} autres projets
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      Aucun projet assigné
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  const renderTableView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
                checked={selectedStudents.length === students.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>Photo</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Prénom</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Numéro Étudiant</TableCell>
            <TableCell>Projets</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => {
            const studentProjects = getStudentProjects(student.id);
            
            return (
              <TableRow
                key={student.id}
                selected={selectedStudents.includes(student.id)}
                hover
                onClick={() => handleStudentSelect(student.id)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleStudentSelect(student.id)}
                  />
                </TableCell>
                <TableCell>
                  <Avatar 
                    src={student.photo && student.photo.trim() !== '' ? student.photo : undefined}
                    alt={`${student.firstName} ${student.lastName}`}
                  >
                    {(!student.photo || student.photo.trim() === '') && getStudentInitials(student.firstName, student.lastName)}
                  </Avatar>
                </TableCell>
                <TableCell>{student.lastName}</TableCell>
                <TableCell>{student.firstName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.studentNumber}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
                    {studentProjects.length > 0 ? (
                      studentProjects.slice(0, 2).map((project) => (
                        <Chip
                          key={project.id}
                          label={project.name}
                          size="small"
                          sx={{
                            backgroundColor: getModuleColor(project.moduleId),
                            color: 'white',
                            fontSize: '0.7rem',
                            height: '20px',
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Aucun projet
                      </Typography>
                    )}
                    {studentProjects.length > 2 && (
                      <Typography variant="caption" color="text.secondary">
                        +{studentProjects.length - 2}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStudent(student);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Trombinoscope
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {selectedStudents.length > 0 && (
            <Chip
              label={`${selectedStudents.length} étudiant(s) sélectionné(s)`}
              color="primary"
              onDelete={() => setSelectedStudents([])}
            />
          )}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="mode d'affichage"
          >
            <ToggleButton value="gallery" aria-label="vue galerie">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="table" aria-label="vue tableau">
              <ListViewIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={handleExportExcel}
            sx={{ mr: 1 }}
          >
            Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={handleExportPDF}
            sx={{ mr: 1 }}
          >
            PDF
          </Button>
          {viewMode === 'gallery' && (
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExportTrombinoscopePDF}
              sx={{ mr: 1 }}
            >
              Photos PDF
            </Button>
          )}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Ajouter Étudiant
        </Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={resetData}
          sx={{ ml: 2 }}
        >
          Reset Données
        </Button>
        </Box>
      </Box>

      {viewMode === 'gallery' ? renderGalleryView() : renderTableView()}

      {/* Dialog d'édition */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier l'étudiant</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* Section Photo */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h6">Photo de l'étudiant</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={editingStudent?.photo && editingStudent.photo.trim() !== '' ? editingStudent.photo : undefined}
                  sx={{ width: 80, height: 80 }}
                >
                  {(!editingStudent?.photo || editingStudent.photo.trim() === '') && 
                    editingStudent && getStudentInitials(editingStudent.firstName, editingStudent.lastName)}
                </Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoIcon />}
                    size="small"
                  >
                    Choisir une photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, true)}
                    />
                  </Button>
                  {editingStudent?.photo && editingStudent.photo.trim() !== '' && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      size="small"
                      onClick={() => handleRemovePhoto(true)}
                    >
                      Supprimer
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>

            <TextField
              label="Prénom"
              value={editingStudent?.firstName || ''}
              onChange={(e) => setEditingStudent(prev => prev ? { ...prev, firstName: e.target.value } : null)}
              fullWidth
            />
            <TextField
              label="Nom"
              value={editingStudent?.lastName || ''}
              onChange={(e) => setEditingStudent(prev => prev ? { ...prev, lastName: e.target.value } : null)}
              fullWidth
            />
            <TextField
              label="Email"
              value={editingStudent?.email || ''}
              onChange={(e) => setEditingStudent(prev => prev ? { ...prev, email: e.target.value } : null)}
              fullWidth
            />
            <TextField
              label="Numéro Étudiant"
              value={editingStudent?.studentNumber || ''}
              onChange={(e) => setEditingStudent(prev => prev ? { ...prev, studentNumber: e.target.value } : null)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveStudent} variant="contained">Sauvegarder</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'ajout */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un nouvel étudiant</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* Section Photo */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h6">Photo de l'étudiant</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={newStudent.photo && newStudent.photo.trim() !== '' ? newStudent.photo : undefined}
                  sx={{ width: 80, height: 80 }}
                >
                  {(!newStudent.photo || newStudent.photo.trim() === '') && 
                    newStudent.firstName && newStudent.lastName && 
                    getStudentInitials(newStudent.firstName, newStudent.lastName)}
                </Avatar>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoIcon />}
                    size="small"
                  >
                    Choisir une photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, false)}
                    />
                  </Button>
                  {newStudent.photo && newStudent.photo.trim() !== '' && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      size="small"
                      onClick={() => handleRemovePhoto(false)}
                    >
                      Supprimer
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>

            <TextField
              label="Prénom"
              value={newStudent.firstName || ''}
              onChange={(e) => setNewStudent(prev => ({ ...prev, firstName: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Nom"
              value={newStudent.lastName || ''}
              onChange={(e) => setNewStudent(prev => ({ ...prev, lastName: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Email"
              value={newStudent.email || ''}
              onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Numéro Étudiant"
              value={newStudent.studentNumber || ''}
              onChange={(e) => setNewStudent(prev => ({ ...prev, studentNumber: e.target.value }))}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleAddStudent} variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Trombinoscope;
