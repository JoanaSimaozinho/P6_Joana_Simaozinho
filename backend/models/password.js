var passwordValidator = require("password-validator");

// Création d'un schéma
var passwordSchema = new passwordValidator();

// Ajout des propiétés au schéma
passwordSchema
  .is()
  .min(8) // Caractères minimum 8
  .is()
  .max(100) // Caractères maximum 100
  .has()
  .uppercase() // Lettres majuscules
  .has()
  .lowercase() //Lettres minuscules
  .has()
  .digits(1) // minimum 2 chiffres
  .has()
  .not()
  .spaces() // pas d'espaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Met ces valeurs sur liste noire

module.exports = passwordSchema;