const Sauce = require('../models/sauce');
const fs = require('fs'); // File system de Node pour gérer les fichiers images


// Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, 
        // Création de l'URL de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    });
    // Sauvegarde de la sauce dans la base de données
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce créée' }))
        .catch(error => res.status(400).json({ error }));
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    // Vérification que l'utilisateur modifie le fichier image
    if(req.file){ 
        // Recherche de la sauce dans la base de données
        Sauce.findOne({ _id: req.params.id }) 
            // Suppression et remplacement de l'image 
            .then(sauce => { 
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {  // Permet de supprimer le fichier du dossier "images"
                    const sauceObject = {
                        ...JSON.parse(req.body.sauce),  
                        // Génération de l'URL de la nouvelle image
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                // On récupère les informations modifiées pour les envoyer dans la base de données
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
                    .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ error }));
    } else { 
        // Si l'image n'est pas changée, on récupère directement les informations modifiées  
        const sauceObject = { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
            .catch(error => res.status(400).json({ error }));
    }
};

// Suppression d'une sauce et de son image dans le dossier "images"
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {  // Permet de supprimer le fichier du dossier "images"
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Affichage d'une seule sauce grâce à son id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Affichage de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Ajout de Like ou Dislike sur une sauce
exports.likeSauce = (req, res, next) => {

    // Ajout d'un like à la sauce quand l'utilisateur n'a pas encore mis de Like ou de Dislike
    if( req.body.like === 1){
        Sauce.updateOne({ _id: req.params.id },
            {
                $inc: { likes: +1 },  // Ajout du Like, incrémentation 
                $push: { usersLiked: req.body.userId} // Ajout de l'Id de l'utilisateur dans le tableau
            })
            .then(sauce => res.status(200).json({ message: 'Vous avez mis un Like'}))
            .catch(error => res.status(400).json({ error }));

    // Ajout d'un Dislike à la sauce quand l'utilisateur n'a pas encore mis de Like ou de Dislike
    } else if ( req.body.like === -1){
        Sauce.updateOne({ _id: req.params.id},
            {
                $inc: { dislikes: +1 }, // Ajout d'un Dislike  
                $push: { usersDisliked: req.body.userId} // Ajout de l'Id de l'utilisateur dans le tableau
            })
            .then(sauce => res.status(200).json({ message: 'Vous avez mis un Dislike'}))
            .catch(error => res.status(400).json({ error }));

    // Suppression du Like ou du Dislike déjà donné à la sauce
    } else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                // Si l'id de l'utilisateur apparaît dans le tableau des utilisateurs qui ont mis un Like
                if(sauce.usersLiked.includes(req.body.userId)){
                    Sauce.updateOne({ _id: req.params.id},
                        {
                            $pull: { usersLiked: req.body.userId }, // Suppression de l'utilisateur du tableau
                            $inc: { likes: -1 } // Suppression d'un Like, décrémentation
                        })
                        .then(sauce => res.status(200).json({ message: 'Vous avez supprimé votre Like'}))
                        .catch(error => res.status(400).json({ error }));
                //Si l'id de l'utilisateur apparaît dans le tableau des utilisateurs qui ont mis un Dislike
                } else if(sauce.usersDisliked.includes(req.body.userId)){
                    Sauce.updateOne({ _id: req.params.id},
                        {
                            $pull: { usersDisliked: req.body.userId }, // Suppression de l'id de l'utilisateur du tableau
                            $inc: { dislikes: -1 } // Suppression d'un Dislike, décrémentation
                        })
                        .then(sauce => res.status(200).json({ message: 'Vous avez supprimé votre Dislike'}))
                        .catch(error => res.status(400).json({ error }));
                } else {
                    throw 'Utilisateur non trouvé';
                }
            })
            .catch(error => res.status(400).json({ error }));
    };
};