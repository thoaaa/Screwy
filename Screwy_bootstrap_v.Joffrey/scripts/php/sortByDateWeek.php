<?php

	//Connexion à la bdd
	include("connect.php");

	//Date en secondes
	$current_date = time();
	//Une semaine c'est 604 800 secondes
	$weekToSeconds = 604800;
	
	//On récupère la date limite en secondes équivalente à 1 semaine avant la date actuelle
	//Exemple : si la date actuelle est 1 000 000, celle de la semaine dernière à la même heure était 395 200
	$difference = $current_date - $weekToSeconds;

	//On récupère toutes nos images uploadées triées par date de la plus récente à la plus ancienne, et ayant comme date limite celle calculée plus haut (= où la date est plus grande que celle calculée, car plus petite c'est ancien)
	$select_pictures_by_date_week = $connexion->prepare("SELECT photo_url, photo_title, photo_owner_id, photo_id FROM Photos WHERE photo_date_upload_tri > :difference ORDER BY photo_date_upload_tri DESC");
	//On lie notre variable
	$select_pictures_by_date_week->bindValue('difference', $difference, PDO::PARAM_INT);
	//On exécute
	$select_pictures_by_date_week->execute();
	
	//Tant qu'on a une ligne à afficher
	while($result_by_date_week = $select_pictures_by_date_week->fetch()){
		
		//On récupère les infos utiles
		$url_photo = $result_by_date_week['photo_url'];
		$title_photo = $result_by_date_week['photo_title'];
		$id_autor_photo = $result_by_date_week['photo_owner_id'];
		$id_image = $result_by_date_week['photo_id'];
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
	$select_pictures_by_date_week->closeCursor();
	$select_pictures_by_date_week = NULL;
?>