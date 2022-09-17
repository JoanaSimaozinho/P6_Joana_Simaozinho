// Permet de hasher le mot de passe
const bcrypt = require("bcrypt");
const User = require("../models/User");
// Permet de créer et vérifier des token d'authentification
const jwt = require("jsonwebtoken");
const validator = require("email-validator");
require('dotenv').config();

// User signup controller
exports.signup = (req, res, next) => {
  const isValidateEmail = validator.validate(req.body.email);
  if (!isValidateEmail) {
    res.writeHead(400, 'Email incorrect !"}', {
      "content-type": "application/json",
    });
    res.end("Le format de l'email est incorrect.");
  } else {
    // Fonction asynchrone qui renvoie une Promise dans laquelle on reçois le hash généré
    bcrypt
      .hash(req.body.password, 10)
      // On crée un utilisateur et l'enregistrons dans la base de données en revoyant une réponse de réussite en cas de succés et des erreurs avec le code d'erreur en cas d'échec
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

// Modèle mongoose utilisé pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
      // Fonction compare pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            // S'il ne correspond pas une erreur 401 Unauthorized est renvoyée avec le même message que lorsque l'utilisateur n'a pas été trouvé
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // S'il correspond les infos d'identification de l'utilisateur sont valides
          // Dans ce cas une reponse 200 est envoyée contenant l'ID de l'utilisateur et un token
          res.status(200).json({
            userId: user._id,
            // Fonction sign utilisée pour chiffrer un nouveau token
            // Ce token contient l'ID de l'utilisateur en tant que payload (données encodées dans le token)
            token: jwt.sign({ userId: user._id }, process.env.JWT, {
              // Durée de validité du token définie à 24h donc au bout de ces 24h l'utilisateur devra se reconnecter
              // Puis le token est envoyé au front-end avec la réponse
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};