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
// Dessine une source image (HTMLImageElement ou ImageBitmap) sur un canvas
// redimensionné, et renvoie une data URL JPEG compressée.
const drawToJpeg = (
  source: CanvasImageSource,
  srcWidth: number,
  srcHeight: number,
  maxSize: number,
  quality: number
): string => {
  let width = srcWidth;
  let height = srcHeight;
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
    throw new Error('Contexte canvas indisponible');
  }
  ctx.drawImage(source, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality);
};

// Repli historique : FileReader + <img>. Fonctionne pour les formats que le
// navigateur affiche nativement (JPEG, PNG, et HEIC sur Safari récent).
const resizeViaImageElement = (
  file: File,
  maxSize: number,
  quality: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Lecture du fichier impossible'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Image invalide ou format non pris en charge'));
      img.onload = () => {
        try {
          resolve(drawToJpeg(img, img.width, img.height, maxSize, quality));
        } catch (err) {
          reject(err);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const resizeImageFile = async (
  file: File,
  maxSize: number = 400,
  quality: number = 0.72
): Promise<string> => {
  // Décodeur moderne en priorité : createImageBitmap décode davantage de
  // formats (dont le HEIC de l'iPhone) et gère les photos très haute
  // résolution prises avec l'appareil — là où <img> échoue parfois.
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      const dataUrl = drawToJpeg(bitmap, bitmap.width, bitmap.height, maxSize, quality);
      bitmap.close?.();
      return dataUrl;
    } catch (err) {
      // Repli sur la méthode <img> si le décodage moderne échoue
      console.warn('createImageBitmap a échoué, repli sur <img>:', err);
    }
  }
  return resizeViaImageElement(file, maxSize, quality);
};
