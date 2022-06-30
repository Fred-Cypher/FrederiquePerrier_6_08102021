# Hot Takes

***

Projet 6 du parcours Développeur Web d'OpenClassRooms. 

Le but de ce projet est de créer la partie backend d'une appli pour partager des sauces piquantes avec la possibilité de liker ou disliker les sauces des autres utilisateurs. 

***

## Frontend

La partie frontend du projet est fournie et se trouve ici : https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6.git. 

Installez la partie frontend en suivant les instructions du README.md du repository ci-dessus (faites attention de bien avoir installé NodeJS 12.14 ou 14, Angular CLI 7.0.2 et node-sass) puis lancez-la en tapant 'npm start'.  

## Backend

Clonez ce repository, ouvrez-le dans votre terminal et tapez 'npm install'. 
Une fois les dépendances installées, modifiez le fichier '.env.example' en changeant les valeurs de DB et TOKEN, par le lien vers votre base de données MongoDB et le token secret de votre choix, puis renommez le fichier en '.env'. Vous pouvez maintenant lancer le serveur en tapant la commande 'nodemon serve' dans votre terminal. 

Créez un dossier "images" dans le dossier "backend" pour que les images de l'appli puissent s'enregistrer correctement. 

***

### Contraintes techniques :
* le mot de passe doit être hashé
* l'authentification doit être renforcée sur toutes les routes
* les adresses électroniques doivent être uniques
* la sécurité de la base de données ne doit pas empêcher l'application de s'ouvrir sur la machine d'un utilisateur

### Langages, technologies et dépendances utilisées :
* HTML, CSS, JavaScript
* NodeJS, Express
* MongoDB, mongoose
* bcrypt
* jsonwebtoken
* helmet
* express-rate-limit
* multer
