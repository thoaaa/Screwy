<?php
	session_start();
	
	include("resize.php");
	
	//On récupère l'id de l'utilisateur via la variable de session
	$id_user = $_SESSION['id_user_logged'];
	
	$array = array('error_upload'=>'',
					'error_size'=>'',
					'error_extension'=>'',
					'error_nothing'=>'',
					'error_not_img'=>'',
					'success'=>''
			);
			
	//On définit nos variables
	$target     = 'http://www.joottle.com/HDRDaily/avatar';
	$extension  = 'jpg';
	$extension2 = 'png';
	$extension3 = 'jpeg';
	$extension4 = 'gif';
	//Taille max en octets du fichier (20Mo)
	$max_size   = 20971520;
	$width_max  = 1920;
	$height_max = 1080;

	if($_FILES["upload_avatar_input"]["error"]){
		//Upload
		foreach ($_FILES["upload_avatar_input"]["error"] as $key => $error) {
			
			//On récupère nos données relatives à l'image
			$avatar_name = $_FILES['upload_avatar_input']['name'][$key];
			$size = $_FILES['upload_avatar_input']['size'][$key];
			$tmp_path = $_FILES['upload_avatar_input']['tmp_name'][$key];
			
			// On vérifie si le champ est rempli
			if(isset($_FILES['upload_avatar_input']['name'][$key])) {
			
				// On vérifie l'extension du fichier
				if((substr($avatar_name, -3) == ($extension || $extension2 || $extension4)) || (substr($avatar_name, -4) == $extension3) ) {
				
					//On met la bonne extension après l'id
					if(substr($avatar_name, -3) == ($extension)){
						$uploaded_name =  $id_user.'.'.$extension;
					}
					if(substr($avatar_name, -3) == ($extension2)){
						$uploaded_name =  $id_user.'.'.$extension2;
					}
					if(substr($avatar_name, -3) == ($extension4)){
						$uploaded_name =  $id_user.'.'.$extension4;
					}
					if(substr($avatar_name, -4) == ($extension3)){
						$uploaded_name =  $id_user.'.'.$extension3;
					}
				
					// On récupère les dimensions du fichier
					if($infos_img = getimagesize($_FILES['upload_avatar_input']['tmp_name'][$key])) {
					
						// On vérifie les dimensions et taille de l'image
						if(($infos_img[0] <= $width_max) && ($infos_img[1] <= $height_max) && ($_FILES['upload_avatar_input']['size'][$key] <= $max_size)) {
						
							// Si c'est OK, on teste l'upload
							//if(move_uploaded_file($_FILES['upload_avatar_input']['tmp_name'][$key],'../avatar/'.$_FILES['upload_avatar_input']['name'][$key])) {
							if(move_uploaded_file($_FILES['upload_avatar_input']['tmp_name'][$key],'../avatar/'.$uploaded_name)) {
							
								//$uploaded_name = $_FILES['upload_avatar_input']['name'][$key];
								
								$url_avatar = "$target/$uploaded_name";
								
								//Connexion à la bdd
								include("connect.php");
								
								//On prépare notre requête : on met à jour l'avatar associé à l'id de l'utilisateur
								$update_avatar = $connexion->prepare("UPDATE Users SET user_avatar=:user_avatar WHERE user_id=:user_id");
								//On lie nos variables
								$update_avatar->bindValue('user_avatar', $url_avatar, PDO::PARAM_STR);
								$update_avatar->bindValue('user_id', $id_user, PDO::PARAM_INT);
								//On exécute
								$update_avatar->execute();
								//Clore la requête préparée
								$update_avatar->closeCursor();
								$update_avatar = NULL;
								
								//On stocke les nouveaux champs dans nos variables de session
								$_SESSION['avatar_user_logged'] = $url_avatar;
								
								//$requete2 = "UPDATE Connex_Membres SET URLPhoto='$url' Where Login='$login'";
								//$result2 = mysql_query($requete2);
								
								//On redimensionne
								resize("../avatar/$uploaded_name", 80);
								//On renvoit success via json
								//$array['success']='Success';
								echo 'Success';
							}
							else {
								// Sinon on affiche une erreur système
								//echo '<b>Problème lors de l\'upload !</b><br /><br /><b>', $_FILES['upload_avatar_input']['error'], '</b><br /><br />';
								echo 'Error_Upload';
								//$array['error_upload']='Error_Upload';
							}
						}
						else {
							// Sinon on affiche une erreur pour les dimensions et taille de l'image
							echo 'Error_Size';
							//$array['error_size']='Error_Size';
						}
					}
					else{
						//$array['error_not_img']='Error_Not_Img';
						echo 'Error_Not_Img';
					}
				}
				else {
					// Sinon on affiche une erreur pour l'extension
					echo 'Error_Extension';
					//$array['error_extension']='Error_Extension';
				}
			}
			else {
				// Sinon on affiche une erreur pour le champ vide
				echo 'Error_Nothing';
				//$array['error_nothing']='Error_Nothing';
			}
		}
	}
	else{
		echo 'Error_Upload';
	}
	//echo json_encode($array);
	
	/*foreach ($_FILES["upload_avatar_input"]["error"] as $key => $error) {
		if ($error == UPLOAD_ERR_OK) {
			$name = $_FILES["upload_avatar_input"]["name"][$key];
			echo "$name";
			move_uploaded_file( $_FILES["upload_avatar_input"]["tmp_name"][$key], "../avatar/" . $_FILES['upload_avatar_input']['name'][$key]);
		}
	}
	echo "<h2>Successfully Uploaded Images</h2>";*/

?>