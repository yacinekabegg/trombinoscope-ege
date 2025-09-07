import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Project, Module } from '../types';
import { mockStudents, mockProjects, mockModules } from '../data/mockData';

interface AppContextType {
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Fonction pour charger les données depuis localStorage
  const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return defaultValue;
      
      const parsed = JSON.parse(stored);
      
      // Vérifier si c'est l'ancienne version des données (avec les étudiants mockés)
      if (key === 'trombinoscope-students' && Array.isArray(parsed)) {
        const hasOldStudents = parsed.some((student: any) => 
          student.id === '1' || student.id === '2' || student.id === '3' || 
          student.id === '4' || student.id === '5' || student.id === '6'
        );
        if (hasOldStudents) {
          console.log('Anciennes données détectées, utilisation des nouvelles données');
          return defaultValue;
        }
      }
      
      // Reconvertir les dates pour les projets
      if (key === 'trombinoscope-projects' && Array.isArray(parsed)) {
        return parsed.map((project: any) => ({
          ...project,
          deadline: project.deadline ? new Date(project.deadline) : new Date(),
          submissionDate: project.submissionDate ? new Date(project.submissionDate) : undefined,
          createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
          updatedAt: project.updatedAt ? new Date(project.updatedAt) : new Date(),
        })) as T;
      }
      
      return parsed;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  // Fonction pour sauvegarder dans localStorage
  const saveToStorage = <T,>(key: string, data: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  const [students, setStudents] = useState<Student[]>(() => 
    loadFromStorage('trombinoscope-students', mockStudents)
  );
  const [projects, setProjects] = useState<Project[]>(() => 
    loadFromStorage('trombinoscope-projects', mockProjects)
  );
  const [modules, setModules] = useState<Module[]>(() => 
    loadFromStorage('trombinoscope-modules', mockModules)
  );

  // Sauvegarder automatiquement quand les données changent
  useEffect(() => {
    saveToStorage('trombinoscope-students', students);
  }, [students]);

  useEffect(() => {
    saveToStorage('trombinoscope-projects', projects);
  }, [projects]);

  useEffect(() => {
    saveToStorage('trombinoscope-modules', modules);
  }, [modules]);

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const addStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const addProject = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const updateModule = (updatedModule: Module) => {
    setModules(prev => prev.map(m => m.id === updatedModule.id ? updatedModule : m));
  };

  const addModule = (newModule: Module) => {
    setModules(prev => [...prev, newModule]);
  };

  const resetData = () => {
    // Nettoyer le localStorage
    localStorage.removeItem('trombinoscope-students');
    localStorage.removeItem('trombinoscope-projects');
    localStorage.removeItem('trombinoscope-modules');
    console.log('Données réinitialisées, rechargement des nouvelles données...');
    // Recharger la page pour forcer le rechargement des données mockées
    window.location.reload();
  };

  const value: AppContextType = {
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
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
