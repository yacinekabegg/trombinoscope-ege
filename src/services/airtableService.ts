import base, { TABLES } from '../config/airtable';
import { Student, Project, Module, ProjectStatus, ProjectTrackingType, ProjectStepStatus } from '../types';

// Service pour les étudiants
export const studentService = {
  // Récupérer tous les étudiants
  async getAll(): Promise<Student[]> {
    return new Promise((resolve, reject) => {
      const students: Student[] = [];
      
      base(TABLES.STUDENTS).select({
        view: 'Grid view'
      }).eachPage(
        (records, fetchNextPage) => {
          records.forEach(record => {
            const student: Student = {
              id: record.id,
              firstName: record.get('firstName') as string || '',
              lastName: record.get('lastName') as string || '',
              email: record.get('email') as string || '',
              studentNumber: record.get('studentNumber') as string || '',
              photo: record.get('photo') as string || '',
              absenceCount: (record.get('absenceCount') as number) || 0
            };
            students.push(student);
          });
          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error('Erreur lors de la récupération des étudiants:', err);
            reject(err);
          } else {
            resolve(students);
          }
        }
      );
    });
  },

  // Sauvegarder un étudiant
  async save(student: Student): Promise<void> {
    return new Promise((resolve, reject) => {
      const fields = {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        studentNumber: student.studentNumber,
        photo: student.photo,
        absenceCount: student.absenceCount
      };

      if (student.id && student.id.startsWith('rec')) {
        // Mise à jour d'un étudiant existant
        base(TABLES.STUDENTS).update(student.id, fields, (err) => {
          if (err) {
            console.error('Erreur lors de la mise à jour de l\'étudiant:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        // Création d'un nouvel étudiant
        base(TABLES.STUDENTS).create(fields, (err, record) => {
          if (err) {
            console.error('Erreur lors de la création de l\'étudiant:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  },

  // Supprimer un étudiant
  async delete(studentId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      base(TABLES.STUDENTS).destroy(studentId, (err) => {
        if (err) {
          console.error('Erreur lors de la suppression de l\'étudiant:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};

// Service pour les projets
export const projectService = {
  // Récupérer tous les projets
  async getAll(): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      const projects: Project[] = [];
      
      base(TABLES.PROJECTS).select({
        view: 'Grid view'
      }).eachPage(
        (records, fetchNextPage) => {
          records.forEach(record => {
            const project: Project = {
              id: record.id,
              moduleId: (record.get('moduleId') as string[])?.[0] || '',
              name: record.get('name') as string || '',
              description: record.get('description') as string || '',
              deadline: record.get('deadline') ? new Date(record.get('deadline') as string) : new Date(),
              studentIds: (record.get('studentIds') as string[]) || [],
              status: (record.get('status') as ProjectStatus) || ProjectStatus.NOT_SUBMITTED,
              trackingType: (record.get('trackingType') as ProjectTrackingType) || ProjectTrackingType.SIMPLE,
              stepStatus: record.get('stepStatus') as ProjectStepStatus || undefined,
              submissionDate: record.get('submissionDate') ? new Date(record.get('submissionDate') as string) : undefined,
              grade: record.get('grade') as number || undefined,
              comments: record.get('comments') as string || undefined,
              createdAt: record.get('createdAt') ? new Date(record.get('createdAt') as string) : new Date(),
              updatedAt: record.get('updatedAt') ? new Date(record.get('updatedAt') as string) : new Date()
            };
            projects.push(project);
          });
          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error('Erreur lors de la récupération des projets:', err);
            reject(err);
          } else {
            resolve(projects);
          }
        }
      );
    });
  },

  // Sauvegarder un projet
  async save(project: Project): Promise<void> {
    return new Promise((resolve, reject) => {
      const fields = {
        moduleId: project.moduleId ? [project.moduleId] : [],
        name: project.name,
        description: project.description,
        deadline: project.deadline.toISOString().split('T')[0], // Format YYYY-MM-DD
        studentIds: project.studentIds,
        status: project.status,
        trackingType: project.trackingType,
        stepStatus: project.stepStatus,
        submissionDate: project.submissionDate ? project.submissionDate.toISOString().split('T')[0] : undefined,
        grade: project.grade,
        comments: project.comments,
        createdAt: project.createdAt.toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (project.id && project.id.startsWith('rec')) {
        // Mise à jour d'un projet existant
        base(TABLES.PROJECTS).update(project.id, fields, (err) => {
          if (err) {
            console.error('Erreur lors de la mise à jour du projet:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        // Création d'un nouveau projet
        base(TABLES.PROJECTS).create(fields, (err, record) => {
          if (err) {
            console.error('Erreur lors de la création du projet:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  },

  // Supprimer un projet
  async delete(projectId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      base(TABLES.PROJECTS).destroy(projectId, (err) => {
        if (err) {
          console.error('Erreur lors de la suppression du projet:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};

// Service pour les modules
export const moduleService = {
  // Récupérer tous les modules
  async getAll(): Promise<Module[]> {
    return new Promise((resolve, reject) => {
      const modules: Module[] = [];
      
      base(TABLES.MODULES).select({
        view: 'Grid view'
      }).eachPage(
        (records, fetchNextPage) => {
          records.forEach(record => {
            const module: Module = {
              id: record.id,
              name: record.get('name') as string || '',
              description: record.get('description') as string || '',
              color: record.get('color') as string || '#1976d2'
            };
            modules.push(module);
          });
          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error('Erreur lors de la récupération des modules:', err);
            reject(err);
          } else {
            resolve(modules);
          }
        }
      );
    });
  },

  // Sauvegarder un module
  async save(module: Module): Promise<void> {
    return new Promise((resolve, reject) => {
      const fields = {
        name: module.name,
        description: module.description,
        color: module.color
      };

      if (module.id && module.id.startsWith('rec')) {
        // Mise à jour d'un module existant
        base(TABLES.MODULES).update(module.id, fields, (err) => {
          if (err) {
            console.error('Erreur lors de la mise à jour du module:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        // Création d'un nouveau module
        base(TABLES.MODULES).create(fields, (err, record) => {
          if (err) {
            console.error('Erreur lors de la création du module:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  },

  // Supprimer un module
  async delete(moduleId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      base(TABLES.MODULES).destroy(moduleId, (err) => {
        if (err) {
          console.error('Erreur lors de la suppression du module:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};
