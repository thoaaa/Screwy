<?php
	function getDetails($id_image){
	
		//Connexion à la bdd
		include("connect.php");
		
		$photo_id = $id_image;
		
		//On va chercher dans un premier temps toutes les infos relatives à l'image via son id
		$get_picture_details = $connexion->prepare("SELECT photo_owner_id, photo_url, photo_title, photo_description, photo_category, photo_date_upload, photo_date_taken, photo_camera, photo_lens, photo_focal, photo_shutter, photo_aperture, photo_iso FROM Photos WHERE photo_id = :photo_id");
		//On lie notre variable
		$get_picture_details->bindValue('photo_id', $photo_id, PDO::PARAM_INT);
		//On exécute
		$get_picture_details->execute();
		//On récupère le résultat dans un tableau $result['clé']=valeur
		$picture_details = $get_picture_details->fetch();
		//Clore la requête préparée
		$get_picture_details->closeCursor();
		$get_picture_details = NULL;
		
		//On stocke nos résultats dans des variables
		$photo_owner_id = $picture_details['photo_owner_id'];
		$photo_url = $picture_details['photo_url'];
		$photo_title = $picture_details['photo_title'];
		$photo_description = $picture_details['photo_description'];
		$photo_category = $picture_details['photo_category'];
		$photo_date_upload = $picture_details['photo_date_upload'];
		$photo_date_taken = $picture_details['photo_date_taken'];
		$photo_camera = $picture_details['photo_camera'];
		$photo_lens = $picture_details['photo_lens'];
		$photo_focal = $picture_details['photo_focal'];
		$photo_shutter = $picture_details['photo_shutter'];
		$photo_aperture = $picture_details['photo_aperture'];
		$photo_iso = $picture_details['photo_iso'];
		
		//On va chercher dans un second temps toutes les infos relatives au propriétaire de l'image
		$get_author_details = $connexion->prepare("SELECT pseudo, user_avatar FROM Users WHERE user_id = :photo_owner_id");
		//On lie notre variable
		$get_author_details->bindValue('photo_owner_id', $photo_owner_id, PDO::PARAM_INT);
		//On exécute
		$get_author_details->execute();
		//On récupère le résultat dans un tableau $result['clé']=valeur
		$author_details = $get_author_details->fetch();
		//Clore la requête préparée
		$get_author_details->closeCursor();
		$get_author_details = NULL;
		
		//On stocke nos résultats dans des variables
		$author_id = $photo_owner_id;
		$author_pseudo = $author_details['pseudo'];
		$author_avatar = $author_details['user_avatar'];
		
		//On met tout ça dans un tableau
		$array_details = array("$photo_url", "$photo_title", "$photo_description", "$photo_category", "$photo_date_upload", "$photo_date_taken", "$photo_camera", "$photo_lens", "$photo_focal", "$photo_shutter", "$photo_aperture", "$photo_iso", "$author_id", "$author_pseudo", "$author_avatar");
		
		//Et on le retourne
		return $array_details;
	}
?>