<?php
	session_start();
	
	//On r�cup�re nos valeurs POST pour plus de clart�
	$post_pseudo_update = $_POST["my_pseudo"];
	$post_email_update = $_POST["my_email"];
	$post_lastname_update = $_POST["my_lastname"];
	$post_firstname_update = $_POST["my_firstname"];
	$post_description_update = $_POST["my_description"];
	$post_sex_update = $_POST["my_sex"];
	$post_city_update = $_POST["my_city"];
	$post_country_update = $_POST["my_country"];
	//On r�cup�re l'id de l'utilisateur via la variable de session
	$id_user = $_SESSION['id_user_logged'];
	
	$array = array('error_empty_pseudo'=>'',
					'error_empty_email'=>'',
					'error_invalid_email'=>'',
					'error_pseudo'=>'',
					'error_email'=>'',
					//'id'=>'',
					'success'=>''
			);
	
	//On lance notre v�rification "c�t� client"
	//Si un des champs pseudo ou email est vide
	if ((empty($post_pseudo_update)) || (empty($post_email_update))) {

		//Si le pseudo est vide
		if (empty($post_pseudo_update)){
			$array['error_empty_pseudo']='Pseudo_Vide';
		}
		
		//Si l'email est vide
		if (empty($post_email_update)){
			$array['error_empty_email']='Email_Vide';
		}	
	}
	//Sinon si l'email est invalide et n'est pas vide
	elseif ((!(CheckAndValidateEmail($post_email_update))) &&  (isset($post_email_update))){
		//Si l'email entr�e n'est pas une adresse email
		if (!(CheckAndValidateEmail($post_email_update))){
			$array['error_invalid_email']='Email_Invalide';
		}
	}
	//Sinon, on fait notre v�rification c�t� bdd
	else {
		//Connexion � la bdd
		include("connect.php");
		
		//On pr�pare notre requ�te 1 : s�lectionner tous les champs pseudo et email des utilisateurs associ�s � l'id de la session
		$select_pseudo_mail_by_id = $connexion->prepare("SELECT pseudo, email FROM Users WHERE user_id=:user_id");
		//On lie notre variable
		$select_pseudo_mail_by_id->bindValue('user_id', $id_user, PDO::PARAM_INT);
		//On ex�cute
		$select_pseudo_mail_by_id->execute();
		//On r�cup�re le r�sultat dans un tableau $result['cl�']=valeur
		$result_pseudo_mail_by_id = $select_pseudo_mail_by_id->fetch();
		//Clore la requ�te pr�par�e
		$select_pseudo_mail_by_id->closeCursor();
		$select_pseudo_mail_by_id = NULL;
		//On r�cup�re le pseudo et l'email associ�s � l'id de la session
		$pseudo_user = $result_pseudo_mail_by_id['pseudo'];
		//$array['id']=$id_user;
		$email_user = $result_pseudo_mail_by_id['email'];
		
		//Si le pseudo entr� par l'utilisateur est le sien ET que l'email entr�e est la sienne, on fait la M�J
		if (($pseudo_user == $post_pseudo_update) && ($email_user == $post_email_update)) {
			
			//On pr�pare notre requ�te : mettre � jour tous les champs voulus de l'utilisateur ayant l'id associ� au pseudo de la session (son pseudo d'origine)
			$update_user_details = $connexion->prepare("UPDATE Users SET pseudo=:pseudo, email=:email, user_firstname=:user_firstname, user_lastname=:user_lastname, user_description=:user_description, user_sex=:user_sex, user_city=:user_city, user_country=:user_country WHERE user_id=:user_id");
			//On lie nos variables
			$update_user_details->bindValue('pseudo', $post_pseudo_update, PDO::PARAM_STR);
			$update_user_details->bindValue('email', $post_email_update, PDO::PARAM_STR);
			$update_user_details->bindValue('user_firstname', $post_firstname_update, PDO::PARAM_STR);
			$update_user_details->bindValue('user_lastname', $post_lastname_update, PDO::PARAM_STR);
			$update_user_details->bindValue('user_description', $post_description_update, PDO::PARAM_STR);
			$update_user_details->bindValue('user_sex', $post_sex_update, PDO::PARAM_STR);
			$update_user_details->bindValue('user_city', $post_city_update, PDO::PARAM_STR);
			$update_user_details->bindValue('user_country', $post_country_update, PDO::PARAM_STR);
			$update_user_details->bindValue('user_id', $id_user, PDO::PARAM_INT);
			//On ex�cute
			$update_user_details->execute();
			//Clore la requ�te pr�par�e
			$update_user_details->closeCursor();
			$update_user_details = NULL;
			
			//On pr�pare notre requ�te 4 : on met � jour nos variables de session avec ce qu'on vient de modifier
			$update_session = $connexion->prepare("SELECT pseudo, email, user_firstname, user_lastname, user_description, user_sex, user_city, user_country FROM Users WHERE user_id=:user_id");
			//On lie nos variables
			$update_session->bindValue('user_id', $id_user, PDO::PARAM_INT);
			//On ex�cute
			$update_session->execute();
			//On r�cup�re le r�sultat dans un tableau $result['cl�']=valeur
			$result_session = $update_session->fetch();
			//Clore la requ�te pr�par�e
			$update_session->closeCursor();
			$update_session = NULL;
			
			//On stocke tout dans nos variables de session
			$_SESSION['pseudo_user_logged'] = $result_session['pseudo'];
			$_SESSION['email_user_logged'] = $result_session['email'];
			$_SESSION['firstname_user_logged'] = $result_session['user_firstname'];
			$_SESSION['lastname_user_logged'] = $result_session['user_lastname'];
			$_SESSION['description_user_logged'] = $result_session['user_description'];
			$_SESSION['sex_user_logged'] = $result_session['user_sex'];
			$_SESSION['city_user_logged'] = $result_session['user_city'];
			$_SESSION['country_user_logged'] = $result_session['user_country'];
			
			//On renvoit success via json
			$array['success']='Success';
		}
		//Sinon si le pseudo entr� n'est pas le m�me que le sien, ou que l'email n'est pas la m�me que la sienne
		elseif(($pseudo_user != $post_pseudo_update) || ($email_user != $post_email_update)){
			//On pr�pare notre requ�te 2 : s�lectionner tous les champs pseudo et email des utilisateurs pour v�rifier s'ils ne sont pas d�j� utilis�s
			$select_pseudo_email = $connexion->prepare("SELECT p.pseudo, e.email FROM (SELECT COUNT(*) pseudo FROM Users WHERE pseudo=:pseudo) p, (SELECT COUNT(*) email FROM Users WHERE email=:email) e");
			//On lie nos variables
			$select_pseudo_email->bindValue('pseudo', $post_pseudo_update, PDO::PARAM_STR);
			$select_pseudo_email->bindValue('email', $post_email_update, PDO::PARAM_STR);
			//On ex�cute
			$select_pseudo_email->execute();
			//On r�cup�re le r�sultat dans un tableau $result['cl�']=valeur
			$result_select_pseudo_email = $select_pseudo_email->fetch();
			//Clore la requ�te pr�par�e
			$select_pseudo_email->closeCursor();
			$select_pseudo_email = NULL;
			
			//On teste si c'est diff�rent de 0, alors �a existe d�j�, donc on renvoie le message d'erreur
			if (($result_select_pseudo_email['pseudo'] != 0) || ($result_select_pseudo_email['email'] != 0)){
				if ($result_select_pseudo_email['pseudo'] != 0) {
					$array['error_pseudo']='Erreur_Pseudo';
				}
				if ($result_select_pseudo_email['email'] != 0) {
					$array['error_email']='Erreur_Email';
				}
			}
			//Dans le cas o� le pseudo et l'email sont disponibles, on lance la M�J
			if (($result_select_pseudo_email['pseudo'] == 0) && ($result_select_pseudo_email['email'] == 0)){
				/*//Connexion � la bdd
				include("connect.php");*/
				
				//On pr�pare notre requ�te 3 : mettre � jour tous les champs voulus de l'utilisateur ayant l'id associ� au pseudo de la session (son pseudo d'origine)
				$update_user_details = $connexion->prepare("UPDATE Users SET pseudo=:pseudo, email=:email, user_firstname=:user_firstname, user_lastname=:user_lastname, user_description=:user_description, user_sex=:user_sex, user_city=:user_city, user_country=:user_country WHERE user_id=:user_id");
				//On lie nos variables
				$update_user_details->bindValue('pseudo', $post_pseudo_update, PDO::PARAM_STR);
				$update_user_details->bindValue('email', $post_email_update, PDO::PARAM_STR);
				$update_user_details->bindValue('user_firstname', $post_firstname_update, PDO::PARAM_STR);
				$update_user_details->bindValue('user_lastname', $post_lastname_update, PDO::PARAM_STR);
				$update_user_details->bindValue('user_description', $post_description_update, PDO::PARAM_STR);
				$update_user_details->bindValue('user_sex', $post_sex_update, PDO::PARAM_STR);
				$update_user_details->bindValue('user_city', $post_city_update, PDO::PARAM_STR);
				$update_user_details->bindValue('user_country', $post_country_update, PDO::PARAM_STR);
				$update_user_details->bindValue('user_id', $id_user, PDO::PARAM_INT);
				//On ex�cute
				$update_user_details->execute();
				//Clore la requ�te pr�par�e
				$update_user_details->closeCursor();
				$update_user_details = NULL;
				
				//On pr�pare notre requ�te 4 : on met � jour nos variables de session avec ce qu'on vient de modifier
				$update_session = $connexion->prepare("SELECT pseudo, email, user_firstname, user_lastname, user_description, user_sex, user_city, user_country FROM Users WHERE user_id=:user_id");
				//On lie nos variables
				$update_session->bindValue('user_id', $id_user, PDO::PARAM_INT);
				//On ex�cute
				$update_session->execute();
				//On r�cup�re le r�sultat dans un tableau $result['cl�']=valeur
				$result_session = $update_session->fetch();
				//Clore la requ�te pr�par�e
				$update_session->closeCursor();
				$update_session = NULL;
				
				//On stocke tout dans nos variables de session
				$_SESSION['pseudo_user_logged'] = $result_session['pseudo'];
				$_SESSION['email_user_logged'] = $result_session['email'];
				$_SESSION['firstname_user_logged'] = $result_session['user_firstname'];
				$_SESSION['lastname_user_logged'] = $result_session['user_lastname'];
				$_SESSION['description_user_logged'] = $result_session['user_description'];
				$_SESSION['sex_user_logged'] = $result_session['user_sex'];
				$_SESSION['city_user_logged'] = $result_session['user_city'];
				$_SESSION['country_user_logged'] = $result_session['user_country'];
				//Et on met � jour notre cookie
				setcookie('hdr_pseudo', $result_session['pseudo'], time() + 365*12*3600, '/HDRDaily', null, false, true);
				
				//On renvoit success via json
				$array['success']='Success';
			}
		}
	}
	
	function CheckAndValidateEmail($mail){
		if(filter_var($mail, FILTER_VALIDATE_EMAIL)) {
			// ok
			list($user,$domaine)=split("@",$mail,2);
			if(!checkdnsrr($domaine,"MX")&& !checkdnsrr($domaine,"A")){
				//echo 'Mail OK but invalid domain';
				return false;
			}
			else {
				//echo'Mail ok';
				return true;
			}
		}
		else {
			//no
			//echo 'Invalid Mail';
			return false;
		}
	}
	
	echo json_encode($array);
?>