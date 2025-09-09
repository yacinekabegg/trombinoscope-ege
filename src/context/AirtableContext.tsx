import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Project, Module } from '../types';
import { studentService, projectService, moduleService } from '../services/airtableService';
import { mockStudents, mockProjects, mockModules } from '../data/mockData';

interface AirtableContextType {
  students: Student[];
  projects: Project[];
  modules: Module[];
  updateStudent: (student: Student) => void;
  addStudent: (student: Student) => void;
  updateProject: (project: Project) => void;
  addProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  updateModule: (module: Module) => void;
  addModule: (module: Module) => void;
  resetData: () => void;
  migrateStudents: () => void;
  loading: boolean;
  error: string | null;
}

const AirtableContext = createContext<AirtableContextType | undefined>(undefined);

export const useAirtableContext = () => {
  const context = useContext(AirtableContext);
  if (context === undefined) {
    throw new Error('useAirtableContext must be used within an AirtableProvider');
  }
  return context;
};

interface AirtableProviderProps {
  children: ReactNode;
}

export const AirtableProvider: React.FC<AirtableProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialiser les données depuis Airtable
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger les données depuis Airtable
        const [airtableStudents, airtableProjects, airtableModules] = await Promise.all([
          studentService.getAll(),
          projectService.getAll(),
          moduleService.getAll()
        ]);

        // Si aucune donnée n'existe, utiliser les données mockées
        if (airtableStudents.length === 0 && airtableProjects.length === 0 && airtableModules.length === 0) {
          console.log('Aucune donnée Airtable trouvée, initialisation avec les données mockées');
          
          // Sauvegarder les données mockées dans Airtable
          await Promise.all([
            ...mockStudents.map(student => studentService.save(student)),
            ...mockProjects.map(project => projectService.save(project)),
            ...mockModules.map(module => moduleService.save(module))
          ]);

          // S'assurer que les données mockées ont le bon format
          const formattedMockStudents = mockStudents.map(student => ({
            ...student,
            absenceCount: typeof student.absenceCount === 'number' && !isNaN(student.absenceCount) ? student.absenceCount : 0
          }));
          setStudents(formattedMockStudents);
          setProjects(mockProjects);
          setModules(mockModules);
        } else {
          // S'assurer que les données Airtable ont le bon format
          const formattedAirtableStudents = airtableStudents.map(student => ({
            ...student,
            absenceCount: typeof student.absenceCount === 'number' && !isNaN(student.absenceCount) ? student.absenceCount : 0
          }));
          setStudents(formattedAirtableStudents);
          setProjects(airtableProjects);
          setModules(airtableModules);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur de connexion à Airtable');
        
        // Fallback vers les données mockées en cas d'erreur
        const formattedMockStudents = mockStudents.map(student => ({
          ...student,
          absenceCount: typeof student.absenceCount === 'number' && !isNaN(student.absenceCount) ? student.absenceCount : 0
        }));
        setStudents(formattedMockStudents);
        setProjects(mockProjects);
        setModules(mockModules);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const updateStudent = async (student: Student) => {
    try {
      await studentService.save(student);
      // Mettre à jour l'état local
      setStudents(prev => prev.map(s => s.id === student.id ? student : s));
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'étudiant:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const addStudent = async (student: Student) => {
    try {
      await studentService.save(student);
      // Mettre à jour l'état local
      setStudents(prev => [...prev, student]);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'étudiant:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const updateProject = async (project: Project) => {
    try {
      await projectService.save(project);
      // Mettre à jour l'état local
      setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du projet:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const addProject = async (project: Project) => {
    try {
      await projectService.save(project);
      // Mettre à jour l'état local
      setProjects(prev => [...prev, project]);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du projet:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await projectService.delete(projectId);
      // Mettre à jour l'état local
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err) {
      console.error('Erreur lors de la suppression du projet:', err);
      setError('Erreur lors de la suppression');
    }
  };

  const updateModule = async (module: Module) => {
    try {
      await moduleService.save(module);
      // Mettre à jour l'état local
      setModules(prev => prev.map(m => m.id === module.id ? module : m));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du module:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const addModule = async (module: Module) => {
    try {
      await moduleService.save(module);
      // Mettre à jour l'état local
      setModules(prev => [...prev, module]);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du module:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const migrateStudents = async () => {
    try {
      console.log('Migration des étudiants en cours...');
      const studentsToMigrate = students.filter(student => 
        typeof student.absenceCount !== 'number' || isNaN(student.absenceCount)
      );
      
      if (studentsToMigrate.length > 0) {
        console.log(`Migration de ${studentsToMigrate.length} étudiants`);
        await Promise.all(
          studentsToMigrate.map(student => 
            studentService.save({
              ...student,
              absenceCount: 0
            })
          )
        );
        console.log('Migration terminée');
      } else {
        console.log('Aucun étudiant à migrer');
      }
    } catch (err) {
      console.error('Erreur lors de la migration:', err);
      setError('Erreur lors de la migration');
    }
  };

  const resetData = async () => {
    try {
      setLoading(true);
      
      // Supprimer toutes les données Airtable
      await Promise.all([
        ...students.map(student => studentService.delete(student.id)),
        ...projects.map(project => projectService.delete(project.id)),
        ...modules.map(module => moduleService.delete(module.id))
      ]);

      // Réinitialiser avec les données mockées
      await Promise.all([
        ...mockStudents.map(student => studentService.save(student)),
        ...mockProjects.map(project => projectService.save(project)),
        ...mockModules.map(module => moduleService.save(module))
      ]);

      // Mettre à jour l'état local
      const formattedMockStudents = mockStudents.map(student => ({
        ...student,
        absenceCount: typeof student.absenceCount === 'number' && !isNaN(student.absenceCount) ? student.absenceCount : 0
      }));
      setStudents(formattedMockStudents);
      setProjects(mockProjects);
      setModules(mockModules);
    } catch (err) {
      console.error('Erreur lors de la réinitialisation:', err);
      setError('Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  const value: AirtableContextType = {
    students,
    projects,
    modules,
    updateStudent,
    addStudent,
    updateProject,
    addProject,
    deleteProject,
    updateModule,
    addModule,
    resetData,
    migrateStudents,
    loading,
    error
  };

  return (
    <AirtableContext.Provider value={value}>
      {children}
    </AirtableContext.Provider>
  );
};
