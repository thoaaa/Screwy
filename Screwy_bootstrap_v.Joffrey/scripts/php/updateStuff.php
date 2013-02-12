<?php
	session_start();
	
	//On récupère nos valeurs POST pour plus de clarté
	$post_camera = $_POST["my_camera"];
	$post_lens = $_POST["my_lens"];
	$post_equipment = $_POST["my_equipment"];
	//On récupère l'id de l'utilisateur via la variable de session
	$id_user = $_SESSION['id_user_logged'];
	
	$array = array('error_stuff'=>'',
					'success'=>''
			);
	
	//On lance notre vérification "côté client"
	//Si tous les champs sont vides, on fait rien
	if ((empty($post_camera)) && (empty($post_lens)) && (empty($post_equipment))) {
		$array['error_stuff']='Nothing_Update';
	}
	//Sinon, on fait notre vérification côté bdd
	else {
		//Connexion à la bdd
		include("connect.php");
		
		//On prépare notre requête : mettre à jour les champs camera, lens et equipment de l'utilisateur
		$update_stuff = $connexion->prepare("UPDATE Users SET user_camera=:user_camera, user_lens=:user_lens, user_equipment=:user_equipment WHERE user_id=:user_id");
		//On lie nos variables
		$update_stuff->bindValue('user_camera', $post_camera, PDO::PARAM_STR);
		$update_stuff->bindValue('user_lens', $post_lens, PDO::PARAM_STR);
		$update_stuff->bindValue('user_equipment', $post_equipment, PDO::PARAM_STR);
		$update_stuff->bindValue('user_id', $id_user, PDO::PARAM_INT);
		//On exécute
		$update_stuff->execute();
		//Clore la requête préparée
		$update_stuff->closeCursor();
		$update_stuff = NULL;
		
		//On stocke les nouveaux champs dans nos variables de session
		$_SESSION['camera_user_logged'] = $post_camera;
		$_SESSION['lens_user_logged'] = $post_lens;
		$_SESSION['equipment_user_logged'] = $post_equipment;
		
		//On renvoit success via json
		$array['success']='Success';
	}
	
	echo json_encode($array);
?>