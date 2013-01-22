DROP TABLE IF EXISTS Salon ;
CREATE TABLE Salon (id_salon int AUTO_INCREMENT NOT NULL,
nom_salon VARCHAR(255),
nombre_joueur INT(2),
date_creation DATE,
date_fin DATE,
id_statut_salon INT,
id_joueur INT,
id_personnage INT,
PRIMARY KEY (id_salon) ) ENGINE=InnoDB;

DROP TABLE IF EXISTS Statut_Personnage ;
CREATE TABLE Statut_Personnage (id_statutpersonnage int AUTO_INCREMENT NOT NULL,
libelle_statutpersonnage VARCHAR(255),
PRIMARY KEY (id_statutpersonnage) ) ENGINE=InnoDB;

DROP TABLE IF EXISTS Joueur ;
CREATE TABLE Joueur (id_joueur int AUTO_INCREMENT NOT NULL,
pseudo VARCHAR,
email VARCHAR(255),
mdp VARCHAR(255),
date_inscription DATE,
date_last_connexion DATE,
nombre_parties INT(10),
nombre_points INT(10),
id_salon INT,
PRIMARY KEY (id_joueur) ) ENGINE=InnoDB;

DROP TABLE IF EXISTS Role ;
CREATE TABLE Role (id_role int AUTO_INCREMENT NOT NULL,
libelle_role VARCHAR(255),
PRIMARY KEY (id_role) ) ENGINE=InnoDB;

DROP TABLE IF EXISTS Personnage ;
CREATE TABLE Personnage (id_personnage int AUTO_INCREMENT NOT NULL,
capacite VARCHAR(255),
id_role INT,
id_statut_personnage INT,
id_joueur INT,
PRIMARY KEY (id_personnage) ) ENGINE=InnoDB;

DROP TABLE IF EXISTS Vote ;
CREATE TABLE Vote (id_type_vote INT NOT NULL,
id_personnage_votant INT,
id_personnage_cible INT,
PRIMARY KEY (id_type_vote) ) ENGINE=InnoDB;

DROP TABLE IF EXISTS Type_Vote ;
CREATE TABLE Type_Vote (id_type_vote int AUTO_INCREMENT NOT NULL,
libelle_type_vote VARCHAR,
PRIMARY KEY (id_type_vote) ) ENGINE=InnoDB;

DROP TABLE IF EXISTS Statut_Salon ;
CREATE TABLE Statut_Salon (id_statut_salon int AUTO_INCREMENT NOT NULL,
libelle_statut_salon VARCHAR(255),
id_salon INT NOT NULL,
PRIMARY KEY (id_statut_salon) ) ENGINE=InnoDB;

DROP TABLE IF EXISTS Message ;
CREATE TABLE Message (id_message int AUTO_INCREMENT NOT NULL,
id_personnage INT,
texte_message VARCHAR(255),
heure_message DATE,
PRIMARY KEY (id_message) ) ENGINE=InnoDB;

DROP TABLE IF EXISTS dispose_de ;
CREATE TABLE dispose_de (id_salon int AUTO_INCREMENT NOT NULL,
id_role INT NOT NULL,
id_salon INT,
id_role INT,
nombre_role INT(2),
PRIMARY KEY (id_salon) ) ENGINE=InnoDB;

DROP TABLE IF EXISTS incarne ;
CREATE TABLE incarne (id_joueur int AUTO_INCREMENT NOT NULL,
id_personnage INT NOT NULL,
PRIMARY KEY (id_joueur,  id_personnage) ) ENGINE=InnoDB;
