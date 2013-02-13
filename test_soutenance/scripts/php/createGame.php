<?php
	session_start();
	
	//On récupère nos valeurs POST pour plus de clarté
	$post_id = $_POST["idCreateur"];
	$post_nom_partie = $_POST["nomPartie"];
	$post_nombre_joueur_actuels_max = $_POST["nombreJoueurs"];
	
	//Suivant le $post_set_carte envoyé, on initialise notre nombre de joueurs max
	switch($post_nombre_joueur_actuels_max){
		case 5:
			$id_jeu = 1;
			break;
		case 6:
			$id_jeu = 2;
			break;
		case 7:
			$id_jeu = 3;
			break;
		case 8:
			$id_jeu = 4;
			break;
		case 9:
			$id_jeu = 5;
			break;
		case 10:
			$id_jeu = 6;
			break;
		case 11:
			$id_jeu = 7;
			break;
		case 12:
			$id_jeu = 8;
			break;
		case 13:
			$id_jeu = 9;
			break;
		case 14:
			$id_jeu = 10;
			break;
		case 15:
			$id_jeu = 11;
			break;
	}
	
	$array = array('error_empty_nom'=>'',
					'error_nom'=>'',
					'id_salon'=>'',
					'success'=>''
			);
	
	//On lance notre vérification "côté client"
	//Si le nom est vide
	if (empty($post_nom_partie)) {
		$array['error_empty_nom']='Nom_Vide';
	}
	//Sinon, on fait notre vérification côté bdd
	else {
		//Connexion à la bdd
		include("connect.php");
		
		//On prépare notre requête		
		$select_nom_salon = $connexion->prepare("SELECT COUNT(*) nom_salon FROM Salon WHERE nom_salon = :nom_salon");
		//On lie nos variables
		$select_nom_salon->bindValue('nom_salon', $post_nom_partie, PDO::PARAM_STR);
		//On exécute
		$select_nom_salon->execute();
		//On récupère le résultat dans un tableau $result['clé']=valeur
		$result = $select_nom_salon->fetch();
		//Clore la requête préparée
		$select_nom_salon->closeCursor();
		$select_nom_salon = NULL;
		
		//On teste si c'est égal à 1, alors la partie existe et on renvoi une erreur
		if ($result['nom_salon'] == 1) {
			$array['error_nom']='Erreur_Nom';
		}
		//Si c'est égal à 0, alors la partie n'existe pas et on peut la créer
		else {
			//On met le statut du salon à 1, ce qui correspond à "en attente de joueurs"
			$id_salon_statut = 1;
			
			//On récupère la date actuelle en secondes
			$date_creation = time();
			
			//On met le nombre de joueur à 1 (puisqu'il y a obligatoirement le créateur dans la partie)
			$nombre_joueur_actuel = 1;
			
			//On créé un nouveau salon
			$create_salon = $connexion->prepare("INSERT INTO Salon (nom_salon, nombre_joueur_actuel, nombre_max_joueur, date_creation, id_salon_statut, id_createur, id_jeu) VALUES (:post_nom_partie, :nombre_joueur_actuel, :nombre_max_joueur, :date_creation, :id_salon_statut, :post_id, :id_jeu)");
			//On lie les valeurs de mes variables à la requête
			$create_salon->bindValue('post_nom_partie', $post_nom_partie, PDO::PARAM_STR);
			$create_salon->bindValue('nombre_joueur_actuel', $nombre_joueur_actuel, PDO::PARAM_STR);
			$create_salon->bindValue('nombre_max_joueur', $post_nombre_joueur_actuels_max, PDO::PARAM_STR);
			$create_salon->bindValue('date_creation', $date_creation, PDO::PARAM_STR);
			$create_salon->bindValue('id_salon_statut', $id_salon_statut, PDO::PARAM_STR);
			$create_salon->bindValue('post_id', $post_id, PDO::PARAM_STR);
			$create_salon->bindValue('id_jeu', $id_jeu, PDO::PARAM_STR);
			//On exécute
			$create_salon->execute();
			//Clore la requête préparée
			$create_salon->closeCursor();
			$create_salon = NULL;
			
			//Maintenant, on va chercher l'id du salon qu'on vient de créer
			$get_id_salon = $connexion->prepare("SELECT id_salon FROM Salon WHERE nom_salon = :nom_salon");
			//On lie nos variables
			$get_id_salon->bindValue('nom_salon', $post_nom_partie, PDO::PARAM_STR);
			//On exécute
			$get_id_salon->execute();
			//On récupère le résultat dans un tableau $result['clé']=valeur
			$result_id = $get_id_salon->fetch();
			//Clore la requête préparée
			$get_id_salon->closeCursor();
			$get_id_salon = NULL;
			
			//On récupère notre id
			$id_new_salon = $result_id['id_salon'];
			
			//On le balance dans notre json
			$array['id_salon']=$id_new_salon;
			
			//On met à jour l'id_salon de la table Joueur du créateur de la partie
			$insert_salon = $connexion->prepare("UPDATE Joueur SET id_salon = :id_salon WHERE id_joueur = :id_createur");
			//On lie les valeurs de mes variables à la requête
			$insert_salon->bindValue('id_salon', $id_new_salon, PDO::PARAM_STR);
			$insert_salon->bindValue('id_createur', $post_id, PDO::PARAM_STR);
			//On exécute
			$insert_salon->execute();
			//Clore la requête préparée
			$insert_salon->closeCursor();
			$insert_salon = NULL;
			
			//Et on envoi un message de succès
			$array['success']='Success';
		}
	}
	
	echo json_encode($array);
?>