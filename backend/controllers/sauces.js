const Sauce = require("../models/Sauce");
const fs = require("fs");

// création d'une sauce par un utilisateur
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject.id;
  const sauce = new Sauce({
    ...sauceObject,
    likes: 0,
    dislikes: 0,
    usersDisliked: [],
    usersLiked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

//Permet de trouver la Sauce unique ayant le même ID que le paramètre de la requête
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    id: req.params.id,
  })
  // La Sauce est ensuite retournée dans une Promise et envoyée au front-end
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    // Si aucune Sauce n'est trouvée ou si une erreur se produit, une erreur 404 est envoyée au front-end avec l'erreur générée
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Permet a l'utilisateur de mettre a jour ou de modifier une sauce qu'il a créee
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      const sauceObject = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };
        // updateOne permet de mettre a jour la Sauce qui correspond à l'objet passé comme premier argument
        // Le paramètre id passé dans la demande est utilisé puis il est remplacé par la Sauce passée comme second argument
      Sauce.updateOne(
        { id: req.params.id },
        { ...sauceObject, id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
};

// Permet de supprimer (on lui passe un objet correspondant au document à supprimer puis une réponse de réussite ou d'échec est envoyée au front-end)
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// L'utilisateur peut voir toutes le ssauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// l'utilisateur peut liker ou disliker les sauces
exports.likeSauce = (req, res, next) => {
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;
  // 1. l'utilisateur aime une sauce pour la première fois (comme === 1)
  // pousser l'userId vers le tableau usersLiked ; incrémente les likes
  if (like === 1) {
    Sauce.updateOne(
      { id: sauceId },
      {
        $inc: { likes: like },
        $push: { usersLiked: userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Sauce appréciée" }))
      .catch((error) => res.status(500).json({ error }));
  }

  // 2. l'utilisateur n'aime pas une sauce pour la première fois (comme === -1)
  // pousse l'userId vers le tableau usersLiked ; un like de moins.
  else if (like === -1) {
    Sauce.updateOne(
      { id: sauceId },
      {
        $inc: { dislikes: -1 * like },
        $push: { usersDisliked: userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Sauce dépréciée" }))
      .catch((error) => res.status(500).json({ error }));
  }
  // 3. L'utilisateur change d'avis
  // 3.1. l'utilisateur reprend son like :
  else {
    Sauce.findOne({ id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Sauce dépréciée" });
            })
            .catch((error) => res.status(500).json({ error }));
          //3.2 l'utilisateur change d'avis sur son dislike
        } else if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { id: sauceId },
            {
              $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Sauce appréciée" });
            })
            .catch((error) => res.status(500).json({ error }));
        }
      })
      .catch((error) => res.status(401).json({ error }));
  }
};
