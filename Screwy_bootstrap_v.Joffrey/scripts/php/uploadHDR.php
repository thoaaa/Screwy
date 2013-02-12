<?php
	session_start();
 
	//On récupère nos valeurs POST pour plus de clarté
	$post_photo_title = $_POST["photo_title"];
	$post_photo_description = $_POST["photo_description"];
	$post_photo_category = $_POST["photo_category"];
	$post_photo_date_taken = $_POST["photo_date_taken"];
	$post_photo_camera = $_POST["photo_camera"];
	$post_photo_lens = $_POST["photo_lens"];
	$post_photo_focal = $_POST["photo_focal"];
	$post_photo_shutter = $_POST["photo_shutter"];
	$post_photo_aperture = $_POST["photo_aperture"];
	$post_photo_iso = $_POST["photo_iso"];
	
	//On récupère la date d'upload de la photo sur le serveur
	$date_upload = date("Y-m-d");
	//Pour trier facilement, on récupère la date de l'upload de la photo sur le serveur mais sous forme de secondes depuis ledébut de l'époque UNIX (1er janvier 1970 00:00:00 GMT)
	$date_upload_tri = time();
	//On fixe l'état de la photo à 1 = en attente de confirmation de l'admin (2 = ok)
	$photo_etat = 1;
	
	//On récupère nos données relatives à l'image
	$userfile = $_FILES['upload_HDR_input']['name'];
    $file_size = $_FILES['upload_HDR_input']['size'];
    $file_temp = $_FILES['upload_HDR_input']['tmp_name'];
    $file_err = $_FILES['upload_HDR_input']['error'];
	//On récupère l'id de l'utilisateur via la variable de session
	$id_user = $_SESSION['id_user_logged'];
	
	//On définit l'endroit où seront uploadés nos images
	$path = 'http://www.joottle.com/HDRDaily/pictures/';
	$extension  = 'jpg';
	$extension2 = 'png';
	$extension3 = 'jpeg';
	$extension4 = 'gif';
	
    //On créé un nombre aléatoire pour que les fichiers uploadés n'aient pas le même nom => nom de type nombreNomFichier
    $randomizer = rand(0000, 9999);
    $file_name = $randomizer.$userfile;

	//On extrait les 3 derniers caractères du nom du fichier (on obtient par exemple jpg ou png)
    $file_type = $userfile;
    $file_type_length = strlen($file_type) - 3;
    $file_type = substr($file_type, $file_type_length);
	
	//On vérifie si le champ n'est pas vide
	if(!empty($userfile)) {
        /*echo '<div style="font-weight: bold; padding: 6px;">File Uploaded  Information</div>
        <ul>
        <li>Original File Name: ' .$userfile. '</li>
        <li>New File Name: ' .$file_name. '</li>
        <li>File Type: ' .$file_type.'</li>
        <li>File Size: ' .$file_size. '</li>
        <li>File Temporary Name: ' .$file_temp. '</li>
        <li>Fille Error: ' . $file_err. '</li>
        <li><img src="../pictures/'.$file_name.'"></li>
        </ul>';*/

        //On limite la taille du fichier à 5Mb
        if($file_size > 5242880) {
            echo 'Error_Size';
            exit();
        }

        //On définit tous les types de fichier acceptés, et on les met en minuscule
        $file_type = strtolower($file_type);
        $files = array();
        $files[] = 'jpeg';
        $files[] = 'jpg';
        $files[] = 'gif';
        $files[] = 'png';
		
        //On vérifie que notre fichier est bien d'un type autorisé via une recherche dans le tableau définit plus haut
        $key = array_search($file_type, $files);
        if($key) {
            //echo '<b>File allowed!</b><br />';
        } else {
            echo 'Error_Extension';
            exit();
        }

		//On vérifie s'il y a des erreurs, et on upload
		$error_count = count($file_error);
		if($error_count > 0) {
        	for($i = 0; $i <= $error_count; ++$i) {
            	//echo $_FILES['upload_HDR_input']['error'][$i];
				echo 'Error_Not_Img';
        	}
		} else {
		
			//Connexion à la bdd
			include("connect.php");
		
			//On prépare notre requête : on va chercher le nom de l'utilisateur via son id
			$get_name_user = $connexion->prepare("SELECT pseudo FROM Users WHERE user_id = :id_user");
			//On lie nos variables
			$get_name_user->bindValue('id_user', $id_user, PDO::PARAM_INT);
			//On exécute
			$get_name_user->execute();
			//On récupère le résultat dans un tableau $result['clé']=valeur
			$result_name = $get_name_user->fetch();
			//Clore la requête préparée
			$get_name_user->closeCursor();
			$get_name_user = NULL;
			
			//On récupère le nom
			$name_user = $result_name['pseudo'];

			//Suivant la catégorie choisie, on définit notre répertoire et on déplace l'image dans le bon dossier
			if($post_photo_category == 'Nature'){
				//On définit notre répertoire
				$rep = '/nature/';
			}
			if($post_photo_category == 'Abstract'){
				//On définit notre répertoire
				$rep = '/abstract/';
			}
			if($post_photo_category == 'Animals'){
				//On définit notre répertoire
				$rep = '/animals/';
			}
			if($post_photo_category == 'CityArchitecture'){
				//On définit notre répertoire
				$rep = '/cityarchitecture/';
			}
			if($post_photo_category == 'Food'){
				//On définit notre répertoire
				$rep = '/food/';
			}
			if($post_photo_category == 'Street'){
				//On définit notre répertoire
				$rep = '/street/';
			}
			if($post_photo_category == 'Sport'){
				//On définit notre répertoire
				$rep = '/sport/';
			}
			if($post_photo_category == 'Landscapes'){
				//On définit notre répertoire
				$rep = '/landscapes/';
			}
			if($post_photo_category == 'Travel'){
				//On définit notre répertoire
				$rep = '/travel/';
			}
			if($post_photo_category == 'Uncategory'){
				//On définit notre répertoire
				$rep = '/uncategorised/';
			}
			
			//On déplace notre image et on vérifie en même temps si ça fonctionne == upload
        	if(move_uploaded_file($file_temp, '../pictures/'.$name_user.'/'.$rep.$file_name)) {
			
				//On définit notre url : http://www.joottle.com/HDRDaily/pictures/username/rep/filename
				$photo_url = $path.$name_user.'/'.$rep.$file_name;

				//On prépare notre requête : on insert dans la bdd toutes les infos relatives à l'upload
				$update_photo = $connexion->prepare("
								INSERT INTO Photos (
									photo_owner_id,
									photo_url,
									photo_etat,
									photo_title,
									photo_description,
									photo_category,
									photo_date_upload,
									photo_date_upload_tri,
									photo_date_taken,
									photo_camera,
									photo_lens,
									photo_focal,
									photo_shutter,
									photo_aperture,
									photo_iso) 
								VALUES (
									:id_user,
									:photo_url,
									:photo_etat,
									:post_photo_title,
									:post_photo_description,
									:post_photo_category,
									:date_upload,
									:date_upload_tri,
									:post_photo_date_taken,
									:post_photo_camera,
									:post_photo_lens,
									:post_photo_focal,
									:post_photo_shutter,
									:post_photo_aperture,
									:post_photo_iso)
								");
								
				//On lie nos variables
				$update_photo->bindValue('id_user', $id_user, PDO::PARAM_INT);
				$update_photo->bindValue('photo_url', $photo_url, PDO::PARAM_STR);
				$update_photo->bindValue('photo_etat', $photo_etat, PDO::PARAM_INT);
				$update_photo->bindValue('post_photo_title', $post_photo_title, PDO::PARAM_STR);
				$update_photo->bindValue('post_photo_description', $post_photo_description, PDO::PARAM_STR);
				$update_photo->bindValue('post_photo_category', $post_photo_category, PDO::PARAM_STR);
				$update_photo->bindValue('date_upload', $date_upload, PDO::PARAM_STR);
				$update_photo->bindValue('date_upload_tri', $date_upload_tri, PDO::PARAM_INT);
				$update_photo->bindValue('post_photo_date_taken', $post_photo_date_taken, PDO::PARAM_STR);
				$update_photo->bindValue('post_photo_camera', $post_photo_camera, PDO::PARAM_STR);
				$update_photo->bindValue('post_photo_lens', $post_photo_lens, PDO::PARAM_STR);
				$update_photo->bindValue('post_photo_focal', $post_photo_focal, PDO::PARAM_STR);
				$update_photo->bindValue('post_photo_shutter', $post_photo_shutter, PDO::PARAM_STR);
				$update_photo->bindValue('post_photo_aperture', $post_photo_aperture, PDO::PARAM_STR);
				$update_photo->bindValue('post_photo_iso', $post_photo_iso, PDO::PARAM_STR);
				
				//On exécute
				$update_photo->execute();
				//Clore la requête préparée
				$update_photo->closeCursor();
				$update_photo = NULL;
				
				header('Location: http://www.joottle.com/HDRDaily/upload.php');
            	echo 'Success';
        	} else {
            	echo 'Error_Upload';
        	}
		}
    } else {
        echo 'Error_Nothing';
    }	
?>