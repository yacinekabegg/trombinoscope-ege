import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Student, Project, Module } from '../types';

// Collections Firestore
const STUDENTS_COLLECTION = 'students';
const PROJECTS_COLLECTION = 'projects';
const MODULES_COLLECTION = 'modules';

// Service pour les étudiants
export const studentService = {
  // Récupérer tous les étudiants
  async getAll(): Promise<Student[]> {
    const querySnapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
  },

  // Sauvegarder un étudiant
  async save(student: Student): Promise<void> {
    await setDoc(doc(db, STUDENTS_COLLECTION, student.id), student);
  },

  // Supprimer un étudiant
  async delete(studentId: string): Promise<void> {
    await deleteDoc(doc(db, STUDENTS_COLLECTION, studentId));
  },

  // Écouter les changements en temps réel
  onSnapshot(callback: (students: Student[]) => void) {
    const q = query(collection(db, STUDENTS_COLLECTION), orderBy('lastName'));
    return onSnapshot(q, (querySnapshot) => {
      const students = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
      callback(students);
    });
  }
};

// Service pour les projets
export const projectService = {
  // Récupérer tous les projets
  async getAll(): Promise<Project[]> {
    const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        deadline: data.deadline ? new Date(data.deadline.seconds * 1000) : new Date(),
        submissionDate: data.submissionDate ? new Date(data.submissionDate.seconds * 1000) : undefined,
        createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt.seconds * 1000) : new Date(),
      } as Project;
    });
  },

  // Sauvegarder un projet
  async save(project: Project): Promise<void> {
    const projectData = {
      ...project,
      deadline: project.deadline,
      submissionDate: project.submissionDate,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
    await setDoc(doc(db, PROJECTS_COLLECTION, project.id), projectData);
  },

  // Supprimer un projet
  async delete(projectId: string): Promise<void> {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
  },

  // Écouter les changements en temps réel
  onSnapshot(callback: (projects: Project[]) => void) {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const projects = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          deadline: data.deadline ? new Date(data.deadline.seconds * 1000) : new Date(),
          submissionDate: data.submissionDate ? new Date(data.submissionDate.seconds * 1000) : undefined,
          createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date(),
          updatedAt: data.updatedAt ? new Date(data.updatedAt.seconds * 1000) : new Date(),
        } as Project;
      });
      callback(projects);
    });
  }
};

// Service pour les modules
export const moduleService = {
  // Récupérer tous les modules
  async getAll(): Promise<Module[]> {
    const querySnapshot = await getDocs(collection(db, MODULES_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module));
  },

  // Sauvegarder un module
  async save(module: Module): Promise<void> {
    await setDoc(doc(db, MODULES_COLLECTION, module.id), module);
  },

  // Supprimer un module
  async delete(moduleId: string): Promise<void> {
    await deleteDoc(doc(db, MODULES_COLLECTION, moduleId));
  },

  // Écouter les changements en temps réel
  onSnapshot(callback: (modules: Module[]) => void) {
    const q = query(collection(db, MODULES_COLLECTION), orderBy('name'));
    return onSnapshot(q, (querySnapshot) => {
      const modules = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Module));
      callback(modules);
    });
  }
};
