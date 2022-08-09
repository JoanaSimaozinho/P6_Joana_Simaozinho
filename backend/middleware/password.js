// Permet d'obtenir le modèle de mot de passe.
const passwordSchema = require("../models/password");

// Vérifier que le mot de passe de l'utilisateur est correct avec notre modèle de mot de passe
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    res.writeHead(
      400,
      "Le mot de passe doit comprendre 8 caractères dont un chiffre, une majuscule, sans espaces",
      {
        "content-type": "application/json",
      }
    );
    res.end("Le format du mot de passe est incorrect.");
  } else {
    next();
  }
};