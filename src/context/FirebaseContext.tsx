import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Project, Module } from '../types';
import { studentService, projectService, moduleService } from '../services/databaseService';
import { mockStudents, mockProjects, mockModules } from '../data/mockData';

interface FirebaseContextType {
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
  loading: boolean;
  error: string | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseContext must be used within a FirebaseProvider');
  }
  return context;
};

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialiser les données depuis Firebase
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger les données depuis Firebase
        const [firebaseStudents, firebaseProjects, firebaseModules] = await Promise.all([
          studentService.getAll(),
          projectService.getAll(),
          moduleService.getAll()
        ]);

        // Si aucune donnée n'existe, utiliser les données mockées
        if (firebaseStudents.length === 0 && firebaseProjects.length === 0 && firebaseModules.length === 0) {
          console.log('Aucune donnée Firebase trouvée, initialisation avec les données mockées');
          
          // Sauvegarder les données mockées dans Firebase
          await Promise.all([
            ...mockStudents.map(student => studentService.save(student)),
            ...mockProjects.map(project => projectService.save(project)),
            ...mockModules.map(module => moduleService.save(module))
          ]);

          setStudents(mockStudents);
          setProjects(mockProjects);
          setModules(mockModules);
        } else {
          setStudents(firebaseStudents);
          setProjects(firebaseProjects);
          setModules(firebaseModules);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur de connexion à la base de données');
        
        // Fallback vers les données mockées en cas d'erreur
        setStudents(mockStudents);
        setProjects(mockProjects);
        setModules(mockModules);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Écouter les changements en temps réel
  useEffect(() => {
    const unsubscribeStudents = studentService.onSnapshot((newStudents) => {
      setStudents(newStudents);
    });

    const unsubscribeProjects = projectService.onSnapshot((newProjects) => {
      setProjects(newProjects);
    });

    const unsubscribeModules = moduleService.onSnapshot((newModules) => {
      setModules(newModules);
    });

    return () => {
      unsubscribeStudents();
      unsubscribeProjects();
      unsubscribeModules();
    };
  }, []);

  const updateStudent = async (student: Student) => {
    try {
      await studentService.save(student);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'étudiant:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const addStudent = async (student: Student) => {
    try {
      await studentService.save(student);
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'étudiant:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const updateProject = async (project: Project) => {
    try {
      await projectService.save(project);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du projet:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const addProject = async (project: Project) => {
    try {
      await projectService.save(project);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du projet:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await projectService.delete(projectId);
    } catch (err) {
      console.error('Erreur lors de la suppression du projet:', err);
      setError('Erreur lors de la suppression');
    }
  };

  const updateModule = async (module: Module) => {
    try {
      await moduleService.save(module);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du module:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const addModule = async (module: Module) => {
    try {
      await moduleService.save(module);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du module:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  const resetData = async () => {
    try {
      setLoading(true);
      
      // Supprimer toutes les données Firebase
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

      setStudents(mockStudents);
      setProjects(mockProjects);
      setModules(mockModules);
    } catch (err) {
      console.error('Erreur lors de la réinitialisation:', err);
      setError('Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  const value: FirebaseContextType = {
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
    loading,
    error
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
