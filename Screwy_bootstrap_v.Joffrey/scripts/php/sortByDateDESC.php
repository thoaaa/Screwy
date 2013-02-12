<?php

	//Connexion à la bdd
	include("connect.php");
	
	//On récupère nos 15 dernières images uploadées triées par date de la plus récente à la plus ancienne
	$select_pictures_by_date_desc = $connexion->prepare("SELECT photo_url, photo_title, photo_owner_id, photo_id FROM Photos ORDER BY photo_date_upload_tri DESC LIMIT 0, 15");
	//On exécute
	$select_pictures_by_date_desc->execute();
	
	//Compteur
	$count = 0;
	//Date en secondes
	$current_date = time();
	
	//Tant qu'on a une ligne à afficher
	while($result_by_date_desc = $select_pictures_by_date_desc->fetch()){
		//On incrémente count
		$count++;
		
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
		
		//Si count = 1 donc 1er passage, on affiche l'image en grand
		/*if($count == 1){
			//On affiche une image
			print("
				<div class='box coll'>
					<a href=''><img src='$url_photo' alt='$title_photo' /></a>
					<div class='detaile_image'>
						<p><b>$title_photo&nbsp;</b>by&nbsp;<i>$autor</i></p>
					</div>
				</div>
			");
		}*/
		
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
?>