<?php
	function getProfileDetails($id_member){
	
		//Connexion à la bdd
		include("connect.php");
		
		$user_id = $id_member;
		
		//On va chercher toutes les infos relatives au membre via son id
		$get_member_details = $connexion->prepare("SELECT pseudo, user_firstname, user_lastname, user_description, user_sex, user_city, user_country, user_camera, user_lens, user_equipment, user_avatar, user_website, user_twitter, user_facebook, user_google, user_tumblr, user_flickr, user_blog FROM Users WHERE user_id = :user_id");
		//On lie notre variable
		$get_member_details->bindValue('user_id', $user_id, PDO::PARAM_INT);
		//On exécute
		$get_member_details->execute();
		//On récupère le résultat dans un tableau $result['clé']=valeur
		$member_details = $get_member_details->fetch();
		//Clore la requête préparée
		$get_member_details->closeCursor();
		$get_member_details = NULL;
		
		//On stocke nos résultats dans des variables
		$author_pseudo = $member_details['pseudo'];
		$author_firstname = $member_details['user_firstname'];
		$author_lastname = $member_details['user_lastname'];
		$author_description = $member_details['user_description'];
		$author_sex = $member_details['user_sex'];
		$author_city = $member_details['user_city'];
		$author_country = $member_details['user_country'];
		$author_camera = $member_details['user_camera'];
		$author_lens = $member_details['user_lens'];
		$author_equipment = $member_details['user_equipment'];
		$author_avatar = $member_details['user_avatar'];
		$author_website = $member_details['user_website'];
		$author_twitter = $member_details['user_twitter'];
		$author_facebook = $member_details['user_facebook'];
		$author_google = $member_details['user_google'];
		$author_tumblr = $member_details['user_tumblr'];
		$author_flickr = $member_details['user_flickr'];
		$author_blog = $member_details['user_blog'];
		
		//On met tout ça dans un tableau
		$array_ProfileDetails = array("$author_pseudo", "$author_firstname", "$author_lastname", "$author_description", "$author_sex", "$author_city", "$author_country", "$author_camera", "$author_lens", "$author_equipment", "$author_avatar", "$author_website", "$author_twitter", "$author_facebook", "$author_google", "$author_tumblr", "$author_flickr", "$author_blog");
		
		//Et on le retourne
		return $array_ProfileDetails;
	}
?>