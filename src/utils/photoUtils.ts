// URL d'image par défaut pour les étudiants sans photo
export const DEFAULT_STUDENT_PHOTO = 'https://via.placeholder.com/150/1976d2/white?text=User';


/**
 * Génère les initiales d'un étudiant pour les avatars sans photo
 * @param firstName - Prénom de l'étudiant
 * @param lastName - Nom de l'étudiant
 * @returns Initiales (ex: "AM" pour Alice Martin)
 */
export const getStudentInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
};
