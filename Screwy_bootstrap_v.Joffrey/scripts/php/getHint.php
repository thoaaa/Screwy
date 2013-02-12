<?php
	
	//Récupération de la lettre tapée
	$lettre = $_POST['search'];
	//$truc = var_dump($lettre);
	//echo $truc;
	
	//On effectue la recherche que si la lettre n'est pas vide
	if($lettre != ''){
	
		$theSearch = $lettre.'%';
		
		//Connexion à la bdd
		include("connect.php");
		
		//On va chercher tous les titres des photos de la bdd commençant par la lettre
		$get_hint = $connexion->prepare("SELECT photo_title, photo_id FROM Photos WHERE photo_title LIKE :lettre");
		//On lie notre variable
		$get_hint->bindValue('lettre', $theSearch, PDO::PARAM_STR);
		//On exécute
		//$get_hint->execute(array(':lettre' => $lettre . '%'));
		$get_hint->execute();
		//On récupère le nombre de lignes qui on été affectées/retournées
		$count = $get_hint->rowCount();
		
		//Si on a des titres commençant par la lettre
		if($count != 0){
		
			//Tant qu'on a une ligne à afficher
			while($hint = $get_hint->fetch()){
				//On récupère les infos utiles
				$photo_id = $hint['photo_id'];
				$photo_title = $hint['photo_title'];
				
				//On ajoute ça dans un li
				print("<li class='one_suggest'><a href='picture.php?image=$photo_id'>$photo_title</a></li>");
			}
			//Clore la requête préparée
			$get_hint->closeCursor();
			$get_hint = NULL;
		}
		
	}
?>