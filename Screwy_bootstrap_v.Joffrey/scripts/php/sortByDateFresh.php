<?php

	//Connexion à la bdd
	include("connect.php");

	//Date en secondes
	$current_date = time();
	//Une heure c'est 3600 secondes
	$weekToSeconds = 3600;
	
	//On récupère la date limite en secondes équivalente à 1 jour avant la date actuelle
	//Exemple : si la date actuelle est 1 000 000, celle d'hier à la même heure était 913 600
	$difference = $current_date - $weekToSeconds;

	//On récupère toutes nos images uploadées triées par date de la plus récente à la plus ancienne, et ayant comme date limite celle calculée plus haut (= où la date est plus grande que celle calculée, car plus petite c'est ancien)
	$select_pictures_by_date_fresh = $connexion->prepare("SELECT photo_url, photo_title, photo_owner_id, photo_id FROM Photos WHERE photo_date_upload_tri > :difference ORDER BY photo_date_upload_tri DESC");
	//On lie notre variable
	$select_pictures_by_date_fresh->bindValue('difference', $difference, PDO::PARAM_INT);
	//On exécute
	$select_pictures_by_date_fresh->execute();
	//On récupère le nombre de lignes qui on été affectées/retournées
	$count = $select_pictures_by_date_fresh->rowCount();
	
	//Si on a des images qui datent d'une heure
	if($count != 0){

		//Tant qu'on a une ligne à afficher
		while($result_by_date_fresh = $select_pictures_by_date_fresh->fetch()){
			
			//On récupère les infos utiles
			$url_photo = $result_by_date_fresh['photo_url'];
			$title_photo = $result_by_date_fresh['photo_title'];
			$id_autor_photo = $result_by_date_fresh['photo_owner_id'];
			$id_image = $result_by_date_fresh['photo_id'];
			//$sent_ago = $current_date - $result_by_date_fresh['photo_date_upload_tri'];
			
			//On récupère le nom de l'auteur de la photo
			$select_autor = $connexion->prepare("SELECT pseudo FROM Users WHERE user_id = :user_id");
			//On lie notre variable
			$select_autor->bindValue('user_id', $id_autor_photo, PDO::PARAM_INT);
			//On exécute
			$select_autor->execute();
			//On récupère le résultat dans un tableau $result['clé']=valeur
			$result_autor = $select_autor->fetch();
			//Clore la requête préparée
			$select_autor->closeCursor();
			$select_autor = NULL;
			
			$autor = $result_autor['pseudo'];
			
			//On affiche une image
			print("
				<div class='box coll'>
					<a href='picture.php?image=$id_image'><img src='$url_photo' alt='$title_photo' /></a>
					<div class='detaile_image'>
						<p><b>$title_photo&nbsp;</b>by&nbsp;<i><a href='profile.php?member='$id_autor_photo'>$autor</a></i></p>
					</div>
				</div>
			");
		}
		
		//Clore la requête préparée
		$select_pictures_by_date_fresh->closeCursor();
		$select_pictures_by_date_fresh = NULL;
	}
	//Sinon on affiche les 10 dernières uploadées
	else{
		//On récupère nos 10 dernières images uploadées triées par date de la plus récente à la plus ancienne
		$select_pictures_by_date_desc = $connexion->prepare("SELECT photo_id, photo_url, photo_title, photo_owner_id FROM Photos ORDER BY photo_date_upload_tri DESC LIMIT 0, 10");
		//On exécute
		$select_pictures_by_date_desc->execute();
		
		print("<p>No pictures uploaded there was 1 hour, here are the 10 latest pictures uploaded.</p><br/><br/><div class='row-end'></div>");
		
		//Tant qu'on a une ligne à afficher
		while($result_by_date_desc = $select_pictures_by_date_desc->fetch()){
			
			//On récupère les infos utiles
			$url_photo = $result_by_date_desc['photo_url'];
			$title_photo = $result_by_date_desc['photo_title'];
			$id_autor_photo = $result_by_date_desc['photo_owner_id'];
			$id_image = $result_by_date_desc['photo_id'];
			//$sent_ago = $current_date - $result_by_date_desc['photo_date_upload_tri'];
			
			//On récupère le nom de l'auteur de la photo
			$select_autor = $connexion->prepare("SELECT pseudo FROM Users WHERE user_id = :user_id");
			//On lie notre variable
			$select_autor->bindValue('user_id', $id_autor_photo, PDO::PARAM_INT);
			//On exécute
			$select_autor->execute();
			//On récupère le résultat dans un tableau $result['clé']=valeur
			$result_autor = $select_autor->fetch();
			//Clore la requête préparée
			$select_autor->closeCursor();
			$select_autor = NULL;
			
			$autor = $result_autor['pseudo'];
			
			//On affiche une image
			print("
				<div class='box coll'>
					<a href='picture.php?image=$id_image'><img src='$url_photo' alt='$title_photo' /></a>
					<div class='detaile_image'>
						<p><b>$title_photo&nbsp;</b>by&nbsp;<i><a href='profile.php?member=$id_autor_photo'>$autor</a></i></p>
					</div>
				</div>
			");
		}
		
		//Clore la requête préparée
		$select_pictures_by_date_desc->closeCursor();
		$select_pictures_by_date_desc = NULL;
	}
?>