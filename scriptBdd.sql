DROP TABLE IF EXISTS Salon ;
CREATE TABLE Salon (
id_salon int AUTO_INCREMENT NOT NULL,
nom_salon VARCHAR(255),
nombre_joueur INT(2),
date_creation DATE,
date_fin DATE,
id_statut_salon INT,
id_joueur INT,
id_personnage INT,
id_jeu INT NOT NULL,
PRIMARY KEY (id_salon) ) ENGINE=InnoDB;

DROP TABLE IF EXISTS Joueur ;
CREATE TABLE Joueur (
id_joueur int AUTO_INCREMENT NOT NULL,
pseudo VARCHAR,
email VARCHAR(255),
mdp VARCHAR(255),
date_inscription DATE,
date_last_connexion DATE,
nombre_parties INT(10),
nombre_points INT(10),
id_salon INT,
cle_salon VARCHAR(255),
PRIMARY KEY (id_joueur) ) ENGINE=InnoDB;

DROP TABLE IF EXISTS Role ;
CREATE TABLE Role (id_role int AUTO_INCREMENT NOT NULL,
libelle_role VARCHAR(255),
PRIMARY KEY (id_role) ) ENGINE=InnoDB;

DROP TABLE IF EXISTS Statut_Salon ;
CREATE TABLE Statut_Salon (
id_statut_salon int AUTO_INCREMENT NOT NULL,
libelle_statut_salon VARCHAR(255),
id_salon INT NOT NULL,
PRIMARY KEY (id_statut_salon) ) ENGINE=InnoDB;

DROP TABLE IF EXISTS Jeu ;
CREATE TABLE Jeu (id_jeu int AUTO_INCREMENT NOT NULL,
libelle_jeu VARCHAR(255),
PRIMARY KEY (id_role) ) ENGINE=InnoDB;
