<?php

	//Connexion à la bdd
	include("connect.php");

	//Date en secondes
	$current_date = time();
	//Notre date au format : le 25 mai 1999 à 15:52:10
	$currentDateReadable = date('\l\e j m Y \à H:i:s', $current_date);
	$jour = date('j', $current_date);
	$mois = date('m', $current_date);
	$annee = date('Y', $current_date);

	//Aujourd'hui à minuit sous forme de time() c'est : (heure/minute/seconde/mois/jour/annee)
	$newTime = mktime(00, 00, 00, $mois, $jour, $annee);
	
	//Sous forme lisible :
	$newTimeReadable = date('j/m/Y/H:i:s', $newTime);

	//On récupère toutes nos images uploadées triées par date de la plus récente à la plus ancienne, et ayant comme date limite celle calculée plus haut (= où la date est plus grande que celle calculée, car plus petite c'est ancien)
	$select_pictures_by_date_today = $connexion->prepare("SELECT photo_url, photo_title, photo_owner_id, photo_id FROM Photos WHERE photo_date_upload_tri > :newtime ORDER BY photo_date_upload_tri DESC");
	//On lie notre variable
	$select_pictures_by_date_today->bindValue('newtime', $newTime, PDO::PARAM_INT);
	//On exécute
	$select_pictures_by_date_today->execute();
	//On récupère le nombre de lignes qui on été affectées/retournées
	$count = $select_pictures_by_date_today->rowCount();

	//Si on a des images qui datent d'une heure
	if($count != 0){
	
		//Tant qu'on a une ligne à afficher
		while($result_by_date_today = $select_pictures_by_date_today->fetch()){
			
			//On récupère les infos utiles
			$url_photo = $result_by_date_today['photo_url'];
			$title_photo = $result_by_date_today['photo_title'];
			$id_autor_photo = $result_by_date_today['photo_owner_id'];
			$id_image = $result_by_date_today['photo_id'];
			//$sent_ago = $current_date - $result_by_date_today['photo_date_upload_tri'];
			
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
		$select_pictures_by_date_today->closeCursor();
		$select_pictures_by_date_today = NULL;
	}
	//Sinon on affiche les 10 dernières uploadées
	else{
		//On récupère nos 10 dernières images uploadées triées par date de la plus récente à la plus ancienne
		$select_pictures_by_date_desc = $connexion->prepare("SELECT photo_id, photo_url, photo_title, photo_owner_id FROM Photos ORDER BY photo_date_upload_tri DESC LIMIT 0, 10");
		//On exécute
		$select_pictures_by_date_desc->execute();
		
		print("<p>No pictures uploaded today, here are the 10 latest pictures uploaded.</p>");
		
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