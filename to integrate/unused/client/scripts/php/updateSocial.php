<?php
	session_start();
	
	//On récupère nos valeurs POST pour plus de clarté
	$post_website = $_POST["my_website"];
	$post_twitter = $_POST["my_twitter"];
	$post_facebook = $_POST["my_facebook"];
	$post_google = $_POST["my_google"];
	$post_tumblr = $_POST["my_tumblr"];
	$post_flickr = $_POST["my_flickr"];
	$post_blog = $_POST["my_blog"];
	//On récupère l'id de l'utilisateur via la variable de session
	$id_user = $_SESSION['id_user_logged'];
	
	$array = array('error_website'=>'',
					'error_twitter'=>'',
					'error_facebook'=>'',
					'error_google'=>'',
					'error_tumblr'=>'',
					'error_flickr'=>'',
					'error_blog'=>'',
					'error_update'=>'',
					'success'=>''
			);
	
	//On lance notre vérification "côté client"
	//Si tous les champs sont vides, on fait rien
	if ((empty($post_website)) && (empty($post_twitter)) && (empty($post_facebook)) && (empty($post_google)) && (empty($post_tumblr)) && (empty($post_flickr)) && (empty($post_blog))) {
		$array['error_update']='Error_Update';
	}
	//Sinon, on fait notre vérification côté bdd
	else {
		//Connexion à la bdd
		include("connect.php");

		//On prépare notre requête 1 : on va chercher les champs concernés associés à l'id de l'utilisateur
		$get_social_user = $connexion->prepare("SELECT user_website, user_twitter, user_facebook, user_google, user_tumblr, user_flickr, user_blog FROM Users WHERE user_id=:user_id");
		//On lie nos variables
		$get_social_user->bindValue('user_id', $id_user, PDO::PARAM_INT);
		//On exécute
		$get_social_user->execute();
		//On récupère le résultat dans un tableau $result['clé']=valeur
		$result_get_social_user = $get_social_user->fetch();
		//Clore la requête préparée
		$get_social_user->closeCursor();
		$get_social_user = NULL;
		//On récupère les résultats
		$user_website = $result_get_social_user['user_website'];
		$user_twitter = $result_get_social_user['user_twitter'];
		$user_facebook = $result_get_social_user['user_facebook'];
		$user_google = $result_get_social_user['user_google'];
		$user_tumblr = $result_get_social_user['user_tumblr'];
		$user_flickr = $result_get_social_user['user_flickr'];
		$user_blog = $result_get_social_user['user_blog'];
		
		//On vérifie que les champs renseignés existent déjà, S'ILS sont différents de ceux de l'utilisateur
		if( ($user_website != $post_website) || ($user_twitter != $post_twitter) || ($user_facebook != $post_facebook) || ($user_google != $post_google) || ($user_tumblr != $post_tumblr) || ($user_flickr != $post_flickr) || ($user_blog != $post_blog) ){
			
			//On prépare notre requête 2 : on va chercher les champs concernés de tous les utilisateurs
			$get_all_social = $connexion->prepare("
				SELECT uw.user_website, ut.user_twitter, uf.user_facebook, ug.user_google, utr.user_tumblr, ufc.user_flickr, ub.user_blog 
				FROM 
				(SELECT COUNT(*) user_website FROM Users WHERE user_website=:user_website) uw, 
				(SELECT COUNT(*) user_twitter FROM Users WHERE user_twitter=:user_twitter) ut, 
				(SELECT COUNT(*) user_facebook FROM Users WHERE user_facebook=:user_facebook) uf, 
				(SELECT COUNT(*) user_google FROM Users WHERE user_google=:user_google) ug, 
				(SELECT COUNT(*) user_tumblr FROM Users WHERE user_tumblr=:user_tumblr) utr, 
				(SELECT COUNT(*) user_flickr FROM Users WHERE user_flickr=:user_flickr) ufc, 
				(SELECT COUNT(*) user_blog FROM Users WHERE user_blog=:user_blog) ub
			");
			//On lie nos variables (bindParam peut-être ?)
			$get_all_social->bindValue('user_website', $post_website, PDO::PARAM_STR);
			$get_all_social->bindValue('user_twitter', $post_twitter, PDO::PARAM_STR);
			$get_all_social->bindValue('user_facebook', $post_facebook, PDO::PARAM_STR);
			$get_all_social->bindValue('user_google', $post_google, PDO::PARAM_STR);
			$get_all_social->bindValue('user_tumblr', $post_tumblr, PDO::PARAM_STR);
			$get_all_social->bindValue('user_flickr', $post_flickr, PDO::PARAM_STR);
			$get_all_social->bindValue('user_blog', $post_blog, PDO::PARAM_STR);
			//On exécute
			$get_all_social->execute();
			//On récupère le résultat dans un tableau $result['clé']=valeur
			$result_get_all_social = $get_all_social->fetch();
			//Clore la requête préparée
			$get_all_social->closeCursor();
			$get_all_social = NULL;
			//On récupère les résultats
			$number_website = $result_get_all_social['user_website'];
			$number_twitter = $result_get_all_social['user_twitter'];
			$number_facebook = $result_get_all_social['user_facebook'];
			$number_google = $result_get_all_social['user_google'];
			$number_tumblr = $result_get_all_social['user_tumblr'];
			$number_flickr = $result_get_all_social['user_flickr'];
			$number_blog = $result_get_all_social['user_blog'];
			
			//On teste si c'est différent de 0, alors ça existe déjà, donc on renvoie le message d'erreur approprié
			if (($number_website != 0) || ($number_twitter != 0) || ($number_facebook != 0) || ($number_google != 0) || ($number_tumblr != 0) || ($number_flickr != 0) || ($number_blog != 0)){
				if ($number_website != 0) {
					$array['error_website']='Error_Website';
				}
				if ($number_twitter != 0) {
					$array['error_twitter']='Error_Twitter';
				}
				if ($number_facebook != 0) {
					$array['error_facebook']='Error_Facebook';
				}
				if ($number_google != 0) {
					$array['error_google']='Error_Google';
				}
				if ($number_tumblr != 0) {
					$array['error_tumblr']='Error_Tumblr';
				}
				if ($number_flickr != 0) {
					$array['error_flickr']='Error_Flickr';
				}
				if ($number_blog != 0) {
					$array['error_blog']='Error_Blog';
				}
			}
			//Sinon, c'est qu'ils sont disponibles donc on peut faire la mise à jour
			else{
				
				//On prépare notre requête : mettre à jour les champs camera, lens et equipment de l'utilisateur
				$update_social = $connexion->prepare("UPDATE Users SET user_website=:user_website, user_twitter=:user_twitter, user_facebook=:user_facebook, user_google=:user_google, user_tumblr=:user_tumblr, user_flickr=:user_flickr, user_blog=:user_blog WHERE user_id=:user_id");
				//On lie nos variables
				$update_social->bindValue('user_website', $post_website, PDO::PARAM_STR);
				$update_social->bindValue('user_twitter', $post_twitter, PDO::PARAM_STR);
				$update_social->bindValue('user_facebook', $post_facebook, PDO::PARAM_STR);
				$update_social->bindValue('user_google', $post_google, PDO::PARAM_STR);
				$update_social->bindValue('user_tumblr', $post_tumblr, PDO::PARAM_STR);
				$update_social->bindValue('user_flickr', $post_flickr, PDO::PARAM_STR);
				$update_social->bindValue('user_blog', $post_blog, PDO::PARAM_STR);
				$update_social->bindValue('user_id', $id_user, PDO::PARAM_INT);
				//On exécute
				$update_social->execute();
				//Clore la requête préparée
				$update_social->closeCursor();
				$update_social = NULL;
				
				//On stocke les nouveaux champs dans nos variables de session
				$_SESSION['website_user_logged'] = $post_website;
				$_SESSION['twitter_user_logged'] = $post_twitter;
				$_SESSION['facebook_user_logged'] = $post_facebook;
				$_SESSION['google_user_logged'] = $post_google;
				$_SESSION['tumblr_user_logged'] = $post_tumblr;
				$_SESSION['flickr_user_logged'] = $post_flickr;
				$_SESSION['blog_user_logged'] = $post_blog;
				
				//On renvoit success via json
				$array['success']='Success';
			
			}		
		}
		//Si rien n'a changé, on fait rien
		elseif( ($user_website == $post_website) && ($user_twitter == $post_twitter) && ($user_facebook == $post_facebook) && ($user_google == $post_google) && ($user_tumblr == $post_tumblr) && ($user_flickr == $post_flickr) && ($user_blog == $post_blog) ){
			$array['error_update']='Error_Update';
		}
	}
	
	echo json_encode($array);
?>