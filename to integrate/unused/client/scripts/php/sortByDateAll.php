<?php

	//Connexion à la bdd
	include("connect.php");
	
	//On récupère toutes nos images uploadées triées par date de la plus récente à la plus ancienne
	$select_pictures_by_date_all = $connexion->prepare("SELECT photo_url, photo_title, photo_owner_id, photo_id FROM Photos ORDER BY photo_date_upload_tri DESC");
	//On exécute
	$select_pictures_by_date_all->execute();

	//Date en secondes
	$current_date = time();
	
	//Tant qu'on a une ligne à afficher
	while($result_by_date_all = $select_pictures_by_date_all->fetch()){
		
		//On récupère les infos utiles
		$url_photo = $result_by_date_all['photo_url'];
		$title_photo = $result_by_date_all['photo_title'];
		$id_autor_photo = $result_by_date_all['photo_owner_id'];
		$id_image = $result_by_date_all['photo_id'];
		//$sent_ago = $current_date - $result_by_date_all['photo_date_upload_tri'];
		
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
	$select_pictures_by_date_all->closeCursor();
	$select_pictures_by_date_all = NULL;
?>