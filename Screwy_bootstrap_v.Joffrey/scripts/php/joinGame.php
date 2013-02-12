<?php
	session_start();
	
	//On récupère nos valeurs POST pour plus de clarté
	$post_id_utilisateur = $_POST["idUtilisateur"];
	$post_id_salon = $_POST["idCible"];
	
	$array = array('error_no_exist'=>'',
					'id_salon'=>'',
					'success'=>''
			);
			
	//Connexion à la bdd
	include("connect.php");
	
	//On vérifie que la partie existe (donc soit en attente, soit en cours)
	$check_statut_game = $connexion->prepare("SELECT id_salon_statut FROM Salon WHERE id_salon = :id_salon");
	//On lie nos variables
	$check_statut_game->bindValue('id_salon', $post_id_salon, PDO::PARAM_STR);
	//On exécute
	$check_statut_game->execute();
	//On récupère le résultat dans un tableau $result['clé']=valeur
	$result_check = $check_statut_game->fetch();
	//Clore la requête préparée
	$check_statut_game->closeCursor();
	$check_statut_game = NULL;
	
	//Si l'id est supérieur à 2 (donc si la partie est en attente ou en cours), erreur
	if ($result_check['id_salon_statut'] > 2) {
		$array['error_no_exist']='Erreur_No_Exist';
	}
	//Sinon, on permet à l'utilisateur de rejoindre la partie
	else{
		//Première requête : on met à jour l'id du salon de la table de l'utilisateur
		$update_player = $connexion->prepare("UPDATE Joueur SET id_salon = :id_salon WHERE id_joueur = :id_joueur");
		//On lie les valeurs de mes variables à la requête
		$update_player->bindValue('id_salon', $post_id_salon, PDO::PARAM_STR);
		$update_player->bindValue('id_joueur', $post_id_utilisateur, PDO::PARAM_STR);
		//On exécute
		$update_player->execute();
		//Clore la requête préparée
		$update_player->closeCursor();
		$update_player = NULL;
		
		//Ensuite, on récupère le nombre de joueurs présents dans le salon
		$get_number_player = $connexion->prepare("SELECT nombre_joueur_actuel FROM Salon WHERE id_salon = :id_salon");
		//On lie nos variables
		$get_number_player->bindValue('id_salon', $post_id_salon, PDO::PARAM_STR);
		//On exécute
		$get_number_player->execute();
		//On récupère le résultat dans un tableau $result['clé']=valeur
		$result_number_player = $get_number_player->fetch();
		//Clore la requête préparée
		$get_number_player->closeCursor();
		$get_number_player = NULL;
		
		//On stocke notre nombre de joueurs retourné et on l'incrémente de 1
		$nombre_joueur_actuel = $result_number_player['nombre_joueur_actuel'];
		
		$nombre_joueur_actuel_now = $nombre_joueur_actuel + 1;
		
		$nombre_joueur_incremente = '$nombre_joueur_actuel_now';
		
		//$nombre_joueur_actuel = '2';
		
		//Enfin, on met à jour le nombre de joueur de la table du salon
		//UPDATE  `dcf1462cbdf434f9ebf4c43f5ec4a51f8`.`Salon` SET  `nombre_joueur_actuel` =  '2' WHERE  `Salon`.`id_salon` =7;
		$update_salon = $connexion->prepare("UPDATE Salon SET nombre_joueur_actuel = :nombre_joueur_actuel WHERE id_salon = :id_salon");
		//On lie les valeurs de mes variables à la requête
		$update_salon->bindValue('nombre_joueur_actuel', $nombre_joueur_actuel_now, PDO::PARAM_STR);
		$update_salon->bindValue('id_salon', $post_id_salon, PDO::PARAM_STR);
		//On exécute
		$update_salon->execute();
		//Clore la requête préparée
		$update_salon->closeCursor();
		$update_salon = NULL;
		
		//On met notre id_salon dans notre json (c'est presque débile vu qu'on l'a également dans le js)
		$array['id_salon']=$post_id_salon;
		
		//Et on envoi un message de succès
		$array['success']='Success';
	}

	echo json_encode($array);

?>