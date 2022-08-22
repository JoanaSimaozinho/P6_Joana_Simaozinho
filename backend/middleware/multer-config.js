const multer = require("multer");
//middleware multer pour la gestion des images
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants
const storage = multer.diskStorage({
  // Indique a multer d'enregistrer les fichers dans le dossier images
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // Indique à multer d'utiliser le nom d'origine, de remplacer les espaces per des underscores 
  // d'ajouter un timestamp (Date.now) comme nom de fichier. 
  // Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// L'élément multer est ensuite exporté entièrement configuré 
// puis la constante storage lui est passée 
// et on lui indique qu'on génére uniquement les téléchargements de fichiers image
module.exports = multer({ storage: storage }).single("image");