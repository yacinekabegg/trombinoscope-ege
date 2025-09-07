import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Avatar,
  AvatarGroup,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  Assignment as ProjectIcon,
  TrendingUp as TrendingUpIcon,
  Grade as GradeIcon,
  Visibility as ViewIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Project, ProjectStatus, Student, ProjectWithDetails } from '../types';
import { useAppContext } from '../context/AppContext';
import { getStudentInitials } from '../utils/photoUtils';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard: React.FC = () => {
  const { projects, students, modules } = useAppContext();
  const [tabValue, setTabValue] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentDetailOpen, setStudentDetailOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleExportExcel = () => {
    exportToExcel(students, projects, modules, 'dashboard_ege');
  };

  const handleExportPDF = () => {
    exportToPDF(students, projects, modules, 'dashboard_ege');
  };

  const getModuleName = (moduleId: string) => {
    return modules.find(m => m.id === moduleId)?.name || 'Module inconnu';
  };

  const getModuleColor = (moduleId: string) => {
    return modules.find(m => m.id === moduleId)?.color || '#1976d2';
  };

  const getProjectStudents = (project: Project) => {
    return students.filter(s => project.studentIds.includes(s.id));
  };

  const getStudentProjects = (studentId: string): ProjectWithDetails[] => {
    return projects
      .filter(p => p.studentIds.includes(studentId))
      .map(p => ({
        ...p,
        module: modules.find(m => m.id === p.moduleId)!,
        students: getProjectStudents(p),
      }));
  };

  const getModuleProjects = (moduleId: string): ProjectWithDetails[] => {
    return projects
      .filter(p => p.moduleId === moduleId)
      .map(p => ({
        ...p,
        module: modules.find(m => m.id === p.moduleId)!,
        students: getProjectStudents(p),
      }));
  };

  const getDashboardStats = () => {
    const totalStudents = students.length;
    const totalProjects = projects.length;
    const submittedProjects = projects.filter(p => p.status === ProjectStatus.SUBMITTED || p.status === ProjectStatus.VALIDATED).length;
    const pendingCorrections = projects.filter(p => p.status === ProjectStatus.TO_CORRECT).length;
    const averageGrade = projects
      .filter(p => p.grade !== undefined)
      .reduce((sum, p) => sum + (p.grade || 0), 0) / projects.filter(p => p.grade !== undefined).length || 0;

    return {
      totalStudents,
      totalProjects,
      submittedProjects,
      pendingCorrections,
      averageGrade: isNaN(averageGrade) ? 0 : averageGrade,
    };
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

  const stats = getDashboardStats();

  const renderOverviewTab = () => (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Vue d'ensemble
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.totalStudents}</Typography>
                  <Typography color="text.secondary">Étudiants</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ProjectIcon color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.totalProjects}</Typography>
                  <Typography color="text.secondary">Projets</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.submittedProjects}</Typography>
                  <Typography color="text.secondary">Rendus</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GradeIcon color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.averageGrade.toFixed(1)}</Typography>
                  <Typography color="text.secondary">Moyenne</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Projets par Module
              </Typography>
              {modules.map((module) => {
                const moduleProjects = getModuleProjects(module.id);
                const submittedCount = moduleProjects.filter(p => p.status === ProjectStatus.SUBMITTED || p.status === ProjectStatus.VALIDATED).length;
                const progress = moduleProjects.length > 0 ? (submittedCount / moduleProjects.length) * 100 : 0;
                
                return (
                  <Box key={module.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: module.color }}>
                        {module.name}
                      </Typography>
                      <Typography variant="body2">
                        {submittedCount}/{moduleProjects.length}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Statuts des Projets
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {Object.values(ProjectStatus).map((status) => {
                      const count = projects.filter(p => p.status === status).length;
                      return (
                        <TableRow key={status}>
                          <TableCell>
                            <Chip
                              label={status}
                              color={getStatusColor(status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">{count}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderStudentsTab = () => (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Vue par Étudiant
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Étudiant</TableCell>
              <TableCell>Projets</TableCell>
              <TableCell>Rendus</TableCell>
              <TableCell>Moyenne</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => {
              const studentProjects = getStudentProjects(student.id);
              const submittedCount = studentProjects.filter(p => p.status === ProjectStatus.SUBMITTED || p.status === ProjectStatus.VALIDATED).length;
              const averageGrade = studentProjects
                .filter(p => p.grade !== undefined)
                .reduce((sum, p) => sum + (p.grade || 0), 0) / studentProjects.filter(p => p.grade !== undefined).length || 0;
              
              return (
                <TableRow key={student.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={student.photo && student.photo.trim() !== '' ? student.photo : undefined}
                        sx={{ mr: 2 }}
                      >
                        {(!student.photo || student.photo.trim() === '') && getStudentInitials(student.firstName, student.lastName)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {student.firstName} {student.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {student.studentNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{studentProjects.length}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${submittedCount}/${studentProjects.length}`}
                      color={submittedCount === studentProjects.length ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {averageGrade > 0 ? `${averageGrade.toFixed(1)}/20` : '-'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedStudent(student);
                        setStudentDetailOpen(true);
                      }}
                    >
                      <ViewIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderGroupsTab = () => (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Vue par Groupe
      </Typography>
      
      <Grid container spacing={3}>
        {projects.map((project) => {
          const projectStudents = getProjectStudents(project);
          const moduleName = getModuleName(project.moduleId);
          const moduleColor = getModuleColor(project.moduleId);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card sx={{ borderLeft: `4px solid ${moduleColor}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: moduleColor, mb: 1 }}>
                    {project.name}
                  </Typography>
                  <Chip label={moduleName} size="small" sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Groupe ({projectStudents.length} étudiant(s)):
                    </Typography>
                    <AvatarGroup max={4}>
                      {projectStudents.map((student) => (
                        <Tooltip key={student.id} title={`${student.firstName} ${student.lastName}`}>
                          <Avatar 
                            src={student.photo && student.photo.trim() !== '' ? student.photo : undefined}
                          >
                            {(!student.photo || student.photo.trim() === '') && getStudentInitials(student.firstName, student.lastName)}
                          </Avatar>
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">
                      Deadline: {project.deadline ? format(project.deadline, 'dd/MM/yyyy', { locale: fr }) : 'Non définie'}
                    </Typography>
                    <Chip
                      label={project.status}
                      color={getStatusColor(project.status) as any}
                      size="small"
                    />
                  </Box>
                  
                  {project.grade && (
                    <Typography variant="body2" fontWeight="bold">
                      Note: {project.grade}/20
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  const renderModulesTab = () => (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Vue par Module
      </Typography>
      
      <Grid container spacing={3}>
        {modules.map((module) => {
          const moduleProjects = getModuleProjects(module.id);
          const submittedCount = moduleProjects.filter(p => p.status === ProjectStatus.SUBMITTED || p.status === ProjectStatus.VALIDATED).length;
          const validatedCount = moduleProjects.filter(p => p.status === ProjectStatus.VALIDATED).length;
          const averageGrade = moduleProjects
            .filter(p => p.grade !== undefined)
            .reduce((sum, p) => sum + (p.grade || 0), 0) / moduleProjects.filter(p => p.grade !== undefined).length || 0;
          
          return (
            <Grid item xs={12} md={6} lg={4} key={module.id}>
              <Card sx={{ borderLeft: `4px solid ${module.color}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: module.color, mb: 2 }}>
                    {module.name}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Projets rendus</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {submittedCount}/{moduleProjects.length}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={moduleProjects.length > 0 ? (submittedCount / moduleProjects.length) * 100 : 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Chip
                        label={`${moduleProjects.length} projets`}
                        size="small"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Chip
                        label={`${validatedCount} validés`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  
                  {averageGrade > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Moyenne: {averageGrade.toFixed(1)}/20
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Tableau de Bord
        </Typography>
        <Box>
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
          >
            PDF
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Vue d'ensemble" />
          <Tab label="Par Étudiant" />
          <Tab label="Par Groupe" />
          <Tab label="Par Module" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        {renderOverviewTab()}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderStudentsTab()}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderGroupsTab()}
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {renderModulesTab()}
      </TabPanel>

      {/* Dialog de détail étudiant */}
      <Dialog open={studentDetailOpen} onClose={() => setStudentDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Détail de {selectedStudent?.firstName} {selectedStudent?.lastName}
        </DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  src={selectedStudent.photo && selectedStudent.photo.trim() !== '' ? selectedStudent.photo : undefined}
                  sx={{ width: 80, height: 80, mr: 3 }}
                >
                  {(!selectedStudent.photo || selectedStudent.photo.trim() === '') && getStudentInitials(selectedStudent.firstName, selectedStudent.lastName)}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedStudent.studentNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedStudent.email}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                Projets ({getStudentProjects(selectedStudent.id).length})
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Projet</TableCell>
                      <TableCell>Module</TableCell>
                      <TableCell>Deadline</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Note</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getStudentProjects(selectedStudent.id).map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={project.module.name}
                            size="small"
                            sx={{ backgroundColor: project.module.color, color: 'white' }}
                          />
                        </TableCell>
                        <TableCell>
                          {project.deadline ? format(project.deadline, 'dd/MM/yyyy', { locale: fr }) : 'Non définie'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={project.status}
                            color={getStatusColor(project.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {project.grade ? `${project.grade}/20` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStudentDetailOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
