// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';

// Configuration des options Swagger JSDoc
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EnerGiraud',
      version: '1.0.0',
      description: "Cette API permet de gérer les comptes des hébergés, leur solde et les différentes opérations liées à l'utilisation et au crédit de leur compte. Elle inclut :\n\n- La gestion des comptes des hébergés (création, modification, suppression).\n- L'ajout et l'utilisation de crédits.\n- La consultation du solde actuel en fonction de l'historique des transactions.\n- La gestion des transactions passées pour assurer un suivi précis des mouvements de fonds.\n- La mise en place de restrictions en fonction du solde disponible et des règles d'utilisation.\n\nL'API fonctionne sur un système de jetons pour l'authentification et sécurise toutes les opérations effectuées."
    },
    servers: [
      {
        url: 'https://api-energiraud.lamaisondesloges.com',
      },
    ],
  },
  // Rechercher les fichiers contenant les annotations Swagger
  apis: ['./src/routes/api/**/*.js'],  // Assure-toi que le chemin est correct
};

// Générer le fichier swagger.json
const swaggerSpec = swaggerJSDoc(options);

// Sauvegarder le fichier swagger.json
const swaggerFilePath = './src/lib/swagger.json';
fs.writeFileSync(swaggerFilePath, JSON.stringify(swaggerSpec, null, 2), 'utf-8');

console.log('swagger.json généré avec succès !');

// Ajouter la configuration de sécurité
const swaggerJson = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf-8'));

// Ajouter la section des composants de sécurité
swaggerJson.components = {
  securitySchemes: {
    ApiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    },
  },
};

// Ajouter la configuration de sécurité globale
swaggerJson.security = [
  {
    ApiKeyAuth: [],
  },
];

// Sauvegarder à nouveau le fichier avec les ajouts
fs.writeFileSync(swaggerFilePath, JSON.stringify(swaggerJson, null, 2), 'utf-8');

console.log('Composants de sécurité ajoutés au fichier swagger.json');
