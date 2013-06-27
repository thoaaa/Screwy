<?php

	//Connexion à la bdd
	include("connect.php");
	
	//On définit notre id_salon_statut à 1 (= en attente de joueurs)
	$id_salon_statut_defini = 1;
	
	//On récupère toutes nos parties en cours, triées par nombre de joueurs
	$select_game_by_date_desc = $connexion->prepare("SELECT * FROM Salon WHERE id_salon_statut = :id_salon_statut ORDER BY nombre_joueur_actuel DESC");
	//On lie notre variable
	$select_game_by_date_desc->bindValue('id_salon_statut', $id_salon_statut_defini, PDO::PARAM_STR);
	//On exécute
	$select_game_by_date_desc->execute();	
	//On compte combien de lignes on été affectées par la requête
	$count = $select_game_by_date_desc->rowCount();
	
	//S'il y a plus que 0 lignes affectées par la requête, c'est qu'il existe au moins une partie en cours
	if ($count > 0) {
	
		//Tant qu'on a une ligne à afficher
		while($result_game_by_date_desc = $select_game_by_date_desc->fetch()){
			
			//On récupère les infos utiles
			$id_salon = $result_game_by_date_desc['id_salon'];
			$nom_salon = $result_game_by_date_desc['nom_salon'];
			$nombre_joueur_actuel = $result_game_by_date_desc['nombre_joueur_actuel'];
			$nombre_max_joueur = $result_game_by_date_desc['nombre_max_joueur'];
			$date_creation = $result_game_by_date_desc['date_creation'];
			$id_salon_statut = $result_game_by_date_desc['id_salon_statut'];
			$id_createur = $result_game_by_date_desc['id_createur'];
			$id_jeu = $result_game_by_date_desc['id_jeu'];
			
			//On filtre par rapport à l'id_salon_statut (car le filtre WHERE fait tout planter...
			if($id_salon_statut == 1){
				
				//On va ensuite chercher le nom du créateur de la partie
				$select_name_creator = $connexion->prepare("SELECT pseudo FROM Joueur WHERE id_joueur = :id_createur");
				//On lie nos variables
				$select_name_creator->bindValue('id_createur', $id_createur, PDO::PARAM_STR);
				//On exécute
				$select_name_creator->execute();
				//On récupère le résultat dans un tableau $result['clé']=valeur
				$result_name = $select_name_creator->fetch();
				//Clore la requête préparée
				$select_name_creator->closeCursor();
				$select_name_creator = NULL;
				//On stocke notre nom
				$nom_createur = $result_name['pseudo'];
				
				//On va également chercher le libellé du set de jeu en cours (on pourrait le faire en "dur" mais c'est pas joli joli)
				$select_libelle_jeu = $connexion->prepare("SELECT libelle_jeu FROM Jeu WHERE id_jeu = :id_jeu");
				//On lie nos variables
				$select_libelle_jeu->bindValue('id_jeu', $id_jeu, PDO::PARAM_STR);
				//On exécute
				$select_libelle_jeu->execute();
				//On récupère le résultat dans un tableau $result['clé']=valeur
				$result_libelle = $select_libelle_jeu->fetch();
				//Clore la requête préparée
				$select_libelle_jeu->closeCursor();
				$select_libelle_jeu = NULL;
				//On stocke notre libellé
				$libelle_jeu = $result_libelle['libelle_jeu'];
				
				//On calcule depuis combien de temps elle est en attente de joueurs
				$duree_attente = GetTimeDiff($date_creation);
		
				//On affiche une ligne qui contient toutes les infos relatives à la partie
				print("
					<tr idSalon='$id_salon' class='liste_li' title='Rejoindre ce salon'>
						<td class='liste_nom_salon span3'>$nom_salon</td>
						<td class='liste_createur_salon span2'>$nom_createur</td>
						<td class='liste_nombre_joueur_actuel span2'>$nombre_joueur_actuel/$nombre_max_joueur</td>
						<td class='liste_duree_attente span2'>$duree_attente</td>
						<td class='liste_libelle_jeu span1'>$libelle_jeu</td>
					</tr>
				");
				
			}	
		
	    }
		//Clore la requête préparée
		$select_game_by_date_desc->closeCursor();
		$select_game_by_date_desc = NULL;
	}
	else{
		print("
			<tr>
				<td class='liste_pas_salon'>Il n'y a pas de parties en cours. Créez-en une !</td>
			</tr>
		");
	}
	
	//Fonction qui permet de faire la différence entre 2 timestamp et de la convertir
	function GetTimeDiff($timestamp) {
	    $how_log_ago = '';
	    $seconds = time() - $timestamp; 
	    $minutes = (int)($seconds / 60);
	    $hours = (int)($minutes / 60);
	    $days = (int)($hours / 24);
	    if ($days >= 1) {
	      $how_log_ago = $days . ' jour' . ($days != 1 ? 's' : '');
	    } else if ($hours >= 1) {
	      $how_log_ago = $hours . ' heure' . ($hours != 1 ? 's' : '');
	    } else if ($minutes >= 1) {
	      $how_log_ago = $minutes . ' minute' . ($minutes != 1 ? 's' : '');
	    } else {
	      $how_log_ago = $seconds . ' seconde' . ($seconds != 1 ? 's' : '');
	    }
	    return $how_log_ago;
	}
	
?>