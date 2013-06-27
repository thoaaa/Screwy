<?php
	function getMemberPictures($id_member){
	
		//Connexion à la bdd
		include("connect.php");
		
		$user_id = $id_member;
		
		//On va chercher toutes les images du membre, ainsi que toutes l'id, le titre et la catégorie de celles-ci, triées par date
		$get_member_pictures = $connexion->prepare("SELECT photo_id, photo_url, photo_title, photo_category FROM Photos WHERE photo_owner_id = :photo_owner_id ORDER BY photo_date_upload_tri DESC");
		//On lie notre variable
		$get_member_pictures->bindValue('photo_owner_id', $user_id, PDO::PARAM_INT);
		//On exécute
		$get_member_pictures->execute();
		
		//Tant qu'on a une ligne à afficher
		while($member_pictures = $get_member_pictures->fetch()){
			
			//On stocke nos résultats dans des variables
			$photo_id = $member_pictures['photo_id'];
			$photo_url = $member_pictures['photo_url'];
			$photo_title = $member_pictures['photo_title'];
			$photo_category = $member_pictures['photo_category'];
			
			//On stocke dans une autre variable notre catégorie : c'est celle qui sera affichée
			$photo_category_display = $photo_category;
			
			//On met en forme la catégorie dans le cas de CityArchitecture
			if($photo_category_display == "CityArchitecture"){
				$photo_category_display = "City And Architecture";
			}
			
			//On créé un lien vers la catégorie
			$category_to_lower = strtolower($photo_category);
			$category_url = "http://www.joottle.com/HDRDaily/$category_to_lower.php";
			
			//On affiche une image
			print("
				<div class='box coll'>
					<a href='picture.php?image=$photo_id'><img src='$photo_url' alt='$photo_title' title='$photo_title' /></a>
					<div class='detaile_image'>
						<p><b>$photo_title&nbsp;</b> in <i><a href='$category_url' title='All $photo_category_display pictures'>$photo_category_display</a></i></p>
					</div>
				</div>
			");
		}
		//Clore la requête préparée
		$get_member_pictures->closeCursor();
		$get_member_pictures = NULL;
	}
?>