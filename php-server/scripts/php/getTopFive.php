<?php

	//Connexion à la bdd
	include("connect.php");
	
	//On récupère nos 5 joueurs ayanet le plus de points
	$select_player_by_points_desc = $connexion->prepare("SELECT id_joueur, pseudo, nombre_points FROM Joueur ORDER BY nombre_points DESC LIMIT 0, 5");
	//On exécute
	$select_player_by_points_desc->execute();
	
	//Tant qu'on a une ligne à afficher
	while($result_by_points_desc = $select_player_by_points_desc->fetch()){
		
		//On récupère les infos utiles
		$id_joueur_top = $result_by_points_desc['id_joueur'];
		$pseudo_top = $result_by_points_desc['pseudo'];
		$nomre_points_top = $result_by_points_desc['nombre_points'];

		//On affiche une image
		print("
			<li><a href='profile.php?member=$id_joueur_top' title='Voir le joueur'><span class='nom_top'>$pseudo_top</span><span class='points_top'>$nomre_points_top pts</span></a></li>
		");
    }
	//Clore la requête préparée
	$select_player_by_points_desc->closeCursor();
	$select_player_by_points_desc = NULL;
	
?>