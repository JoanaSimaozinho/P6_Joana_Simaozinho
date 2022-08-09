const express = require("express");
const mongoose = require("mongoose");
const Sauce = require("./models/Sauce");
const app = express();
const saucesRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");
const path = require("path");
const dotenv = require("dotenv");

// Middleware
app.use((req, res, next) => {
  // '*' Permet d'accéder a l'API depuis n'importe quelle origine
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    // Permet d'ajouter les headers mentionnées aux requêtes envoyées vers l'API
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    // Permet d'envoyer des requêtes avec les méthodes GET POST, ...
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

dotenv.config();

// Connection de l'API à la base de données
mongoose
  .connect('mongodb+srv://joana:projet6@projet6.ynfdjk0.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
