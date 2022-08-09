const jwt = require("jsonwebtoken");

// middleware auth
module.exports = (req, res, next) => {
  try {
    // Le token est extait du header Authorization de la requête entrante. 
    // La fonction split est utilisée pour tout récupérer après l'espace dans le header. 
    const token = req.headers.authorization.split(" ")[1];
    // La fonction verify est utilisée pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée.
    const decodedToken = jwt.verify(token, process.env.JWT);
    //L'ID utilisateur est extrait du token et est rajouté à l’objet Request afin que les différentes routes puissent l’exploiter. 
    // Dans le cas contraire, tout fonctionne et l'utilisateur est authentifié. Nous passons à l'exécution à l'aide de la fonction next().
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};