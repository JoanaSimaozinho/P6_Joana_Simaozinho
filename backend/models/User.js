const mongoose = require("mongoose");

// S'assure que deux utilisateurs ne puissent partager la même adresse e-mail
const uniqueValidator = require("mongoose-unique-validator");

// schéma utilisateur, username et mot de passe (email unique)
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);