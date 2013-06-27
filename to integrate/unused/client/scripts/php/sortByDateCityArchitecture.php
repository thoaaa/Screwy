<?php

	//Connexion � la bdd
	include("connect.php");
	
	//On d�clare notre cat�gorie
	$category = "CityArchitecture";
	
	//On r�cup�re toutes nos images cityarchitecture upload�es tri�es par date de la plus r�cente � la plus ancienne
	$select_pictures_by_date_cityarchitecture = $connexion->prepare("SELECT photo_url, photo_title, photo_owner_id, photo_id FROM Photos WHERE photo_category = :photo_category ORDER BY photo_date_upload_tri DESC");
	//On lie notre variable
	$select_pictures_by_date_cityarchitecture->bindValue('photo_category', $category, PDO::PARAM_STR);
	//On ex�cute
	$select_pictures_by_date_cityarchitecture->execute();

	//Date en secondes
	$current_date = time();
	
	//Tant qu'on a une ligne � afficher
	while($result_by_date_cityarchitecture = $select_pictures_by_date_cityarchitecture->fetch()){
		
		//On r�cup�re les infos utiles
		$url_photo = $result_by_date_cityarchitecture['photo_url'];
		$title_photo = $result_by_date_cityarchitecture['photo_title'];
		$id_autor_photo = $result_by_date_cityarchitecture['photo_owner_id'];
		$id_image = $result_by_date_cityarchitecture['photo_id'];
		//$sent_ago = $current_date - $result_by_date_cityarchitecture['photo_date_upload_tri'];
		
		//On r�cup�re le nom de l'auteur de la photo
		$select_autor = $connexion->prepare("SELECT pseudo FROM Users WHERE user_id = :user_id");
		//On lie notre variable
		$select_autor->bindValue('user_id', $id_autor_photo, PDO::PARAM_INT);
		//On ex�cute
		$select_autor->execute();
		//On r�cup�re le r�sultat dans un tableau $result['cl�']=valeur
		$result_autor = $select_autor->fetch();
		//Clore la requ�te pr�par�e
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
	//Clore la requ�te pr�par�e
	$select_pictures_by_date_cityarchitecture->closeCursor();
	$select_pictures_by_date_cityarchitecture = NULL;
?>