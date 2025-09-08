import { Student, Module, Project, ProjectStatus, ProjectTrackingType, ProjectStepStatus } from '../types';
import { realStudents } from './realStudentsData';

// Utilisation des vrais étudiants du trombinoscope
export const mockStudents: Student[] = realStudents;

export const mockModules: Module[] = [
  {
    id: '1',
    name: 'Atelier Conseil',
    description: 'Module d\'accompagnement et de conseil stratégique',
    color: '#4CAF50'
  },
  {
    id: '2',
    name: 'Politique Générale',
    description: 'Analyse des politiques publiques et stratégies',
    color: '#2196F3'
  },
  {
    id: '3',
    name: 'Global Challenge',
    description: 'Défis internationaux et enjeux mondiaux',
    color: '#FF9800'
  },
  {
    id: '4',
    name: 'Projet d\'Option',
    description: 'Projet spécialisé selon l\'orientation choisie',
    color: '#9C27B0'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    moduleId: '1',
    name: 'Audit Stratégique Entreprise A',
    description: 'Réalisation d\'un audit complet de l\'entreprise A',
    deadline: new Date('2024-03-15'),
    studentIds: ['real-1', 'real-2'],
    status: ProjectStatus.SUBMITTED,
    trackingType: ProjectTrackingType.SIMPLE,
    stepStatus: undefined,
    submissionDate: new Date('2024-03-14'),
    grade: 16,
    comments: 'Excellent travail, analyse très pertinente',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-14')
  },
  {
    id: '2',
    moduleId: '1',
    name: 'Conseil en Transformation Digitale',
    description: 'Accompagnement d\'une PME dans sa transformation digitale',
    deadline: new Date('2024-04-20'),
    studentIds: ['real-3', 'real-4'],
    status: ProjectStatus.TO_CORRECT,
    trackingType: ProjectTrackingType.SIMPLE,
    stepStatus: undefined,
    submissionDate: new Date('2024-04-18'),
    grade: 14,
    comments: 'Bon travail mais quelques améliorations nécessaires',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-04-18')
  },
  {
    id: '3',
    moduleId: '2',
    name: 'Analyse Politique Énergétique',
    description: 'Étude comparative des politiques énergétiques européennes',
    deadline: new Date('2024-05-10'),
    studentIds: ['real-1', 'real-3', 'real-5'],
    status: ProjectStatus.NOT_SUBMITTED,
    trackingType: ProjectTrackingType.SIMPLE,
    stepStatus: undefined,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: '4',
    moduleId: '3',
    name: 'Challenge Innovation Durable',
    description: 'Développement d\'une solution innovante pour le développement durable',
    deadline: new Date('2024-06-01'),
    studentIds: ['real-2', 'real-4', 'real-6'],
    status: ProjectStatus.VALIDATED,
    trackingType: ProjectTrackingType.SIMPLE,
    stepStatus: undefined,
    submissionDate: new Date('2024-05-28'),
    grade: 18,
    comments: 'Projet exceptionnel, innovation remarquable',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-05-28')
  },
  {
    id: '5',
    moduleId: '4',
    name: 'Projet Fin d\'Études - Spécialisation',
    description: 'Projet de fin d\'études selon la spécialisation choisie',
    deadline: new Date('2024-07-15'),
    studentIds: ['real-5', 'real-6'],
    status: ProjectStatus.NOT_SUBMITTED,
    trackingType: ProjectTrackingType.SIMPLE,
    stepStatus: undefined,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01')
  },
  {
    id: '6',
    moduleId: '1',
    name: 'Projet avec Suivi par Étapes',
    description: 'Exemple de projet utilisant le suivi par étapes',
    deadline: new Date('2024-08-30'),
    studentIds: ['real-1', 'real-3'],
    status: ProjectStatus.NOT_SUBMITTED,
    trackingType: ProjectTrackingType.STEP_BY_STEP,
    stepStatus: ProjectStepStatus.STEP_1,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-01')
  },
  {
    id: '7',
    moduleId: '1',
    name: 'Projet Groupe 1',
    description: 'Projet collaboratif pour le groupe 1',
    deadline: new Date('2024-08-15'),
    studentIds: ['real-7', 'real-8', 'real-9'],
    status: ProjectStatus.NOT_SUBMITTED,
    trackingType: ProjectTrackingType.SIMPLE,
    stepStatus: undefined,
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-05-01')
  },
  {
    id: '8',
    moduleId: '2',
    name: 'Projet Groupe 2',
    description: 'Projet collaboratif pour le groupe 2',
    deadline: new Date('2024-08-20'),
    studentIds: ['real-10', 'real-11', 'real-12'],
    status: ProjectStatus.SUBMITTED,
    trackingType: ProjectTrackingType.SIMPLE,
    stepStatus: undefined,
    submissionDate: new Date('2024-08-18'),
    grade: 15,
    comments: 'Bon travail d\'équipe',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-08-18')
  },
  {
    id: '8',
    moduleId: '3',
    name: 'Projet Groupe 3',
    description: 'Projet collaboratif pour le groupe 3',
    deadline: new Date('2024-08-25'),
    studentIds: ['real-13', 'real-14', 'real-15'],
    status: ProjectStatus.TO_CORRECT,
    trackingType: ProjectTrackingType.SIMPLE,
    stepStatus: undefined,
    submissionDate: new Date('2024-08-23'),
    grade: 12,
    comments: 'À améliorer',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-08-23')
  }
];
