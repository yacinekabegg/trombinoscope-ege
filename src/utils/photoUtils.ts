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

/**
 * Redimensionne et compresse une image (fichier) en une petite vignette JPEG
 * encodée en data URL. Indispensable pour Airtable : une photo brute de
 * téléphone (plusieurs Mo) dépasse la limite de taille des champs texte et fait
 * échouer la requête ("Load failed"). On réduit donc à une taille raisonnable.
 *
 * @param file - Le fichier image choisi par l'utilisateur
 * @param maxSize - Dimension maximale (largeur ou hauteur) en pixels
 * @param quality - Qualité JPEG entre 0 et 1
 * @returns Une data URL JPEG compressée
 */
export const resizeImageFile = (
  file: File,
  maxSize: number = 400,
  quality: number = 0.72
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Lecture du fichier impossible'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Image invalide'));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Contexte canvas indisponible'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
