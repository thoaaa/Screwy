<?php
	function getPicturesBySearch($search){

		//On effectue la recherche que si search n'est pas vide
		if($search != ''){
		
			$theSearch = $search.'%';
		
			//Connexion à la bdd
			include("connect.php");
		
			//On va chercher tous les titres des photos de la bdd commençant par search
			$get_pictures_by_search = $connexion->prepare("SELECT photo_id, photo_title, photo_url, photo_category  FROM Photos WHERE photo_title LIKE :search");
			//On lie notre variable
			$get_pictures_by_search->bindValue('search', $theSearch, PDO::PARAM_STR);
			//On exécute
			$get_pictures_by_search->execute();
			//On récupère le nombre de lignes qui on été affectées/retournées
			$count = $get_pictures_by_search->rowCount();
			
			//Si on a des titres commençant par la lettre
			if($count != 0){
			
				//Tant qu'on a une ligne à afficher
				while($pictures_by_search = $get_pictures_by_search->fetch()){
					//On récupère les infos utiles
					$photo_id = $pictures_by_search['photo_id'];
					$photo_url = $pictures_by_search['photo_url'];
					$photo_title = $pictures_by_search['photo_title'];
					$photo_category = $pictures_by_search['photo_category'];
					
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
				$get_pictures_by_search->closeCursor();
				$get_pictures_by_search = NULL;
			}
			//Sinon, il y a rien
			else{
				print("<p style='margin-top:20px;margin-bottom:65px;float:left'>No pictures to match the specified search words</p>");
			}
		}
	}
?>