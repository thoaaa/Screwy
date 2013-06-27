<?php
	//On récupère nos valeurs POST pour plus de clarté
	$post_pseudo = $_POST["inputPseudoSign"];
	$post_email = $_POST["inputEmailSign"];
	$post_check_email = $_POST["inputConfirmEmailSign"];
	$post_password = $_POST["inputPasswordSign"];
	$post_check_password = $_POST["inputConfirmPasswordSign"];
	$array = array('error_empty_pseudo'=>'',
					'error_empty_email'=>'',
					'error_empty_password'=>'',
					'error_empty_check_email'=>'',
					'error_empty_check_password'=>'',
					'error_invalid_email'=>'',
					'error_check_email'=>'',
					'error_check_password'=>'',
					'error_pseudo'=>'',
					'error_email'=>'',
					'success'=>''
			);
	
	//On lance notre vérification "côté client"
	//Si un des champs est vide
	if ((empty($post_pseudo)) || (empty($post_email)) || (empty($post_check_email)) || (empty($post_password)) || (empty($post_check_password))) {

		//Si le pseudo est vide
		if (empty($post_pseudo)){
			$array['error_empty_pseudo']='Pseudo_Vide';
		}
		
		//Si l'email est vide
		if (empty($post_email)){
			$array['error_empty_email']='Email_Vide';
		}
		
		//Si le password est vide
		if (empty($post_password)){
			$array['error_empty_password']='Password_Vide';
		}
		
		//Si le check_email est vide
		if (empty($post_check_email)){
			$array['error_empty_check_email']='Check_Email_Vide';
		}
		
		//Si le check_password est vide
		if (empty($post_check_password)){
			$array['error_empty_check_password']='Check_Password_Vide';
		}	
	}
	//Si l'email est invalide et ne correspond pas à la vérification, ou que le mdp ne correspond pas à la vérification
	elseif ( ( ($post_email != $post_check_email) || (!(CheckAndValidateEmail($post_email))) ) || ($post_password != $post_check_password) ) {
		
		//Si l'email entrée n'est pas une adresse email
		if (!(CheckAndValidateEmail($post_email))){
			$array['error_invalid_email']='Email_Invalide';
		}
		
		//Si l'email est valide, mais si l'email ne correspond pas à la vérification
		elseif ($post_email != $post_check_email) {
			$array['error_check_email']='Error_Check_Email';
		}
		
		//Si le mdp ne correspond pas à la vérification
		if ($post_password != $post_check_password){
			$array['error_check_password']='Error_Check_Password';
		}
	}
	//Sinon, on fait notre vérification côté bdd
	else {
		//Connexion à la bdd
		include("connect.php");
		
		$select_pseudo_email = $connexion->prepare("SELECT p.pseudo, e.email FROM (SELECT COUNT(*) pseudo FROM Joueur WHERE pseudo = :pseudo) p, (SELECT COUNT(*) email FROM Joueur WHERE email = :email) e");
		//On lie nos variables
		$select_pseudo_email->bindValue('pseudo', $post_pseudo, PDO::PARAM_STR);
		$select_pseudo_email->bindValue('email', $post_email, PDO::PARAM_STR);
		//On exécute
		$select_pseudo_email->execute();
		//On récupère le résultat dans un tableau $result['clé']=valeur
		$result = $select_pseudo_email->fetch();
		//Clore la requête préparée
		$select_pseudo_email->closeCursor();
		$select_pseudo_email = NULL;
		
		//On teste si c'est égal à 1, alors ça existe déjà, donc on renvoie le message d'erreur
		if ($result['pseudo'] != 0) {
			$array['error_pseudo']='Erreur_Pseudo';
		}
		if ($result['email'] != 0) {
			$array['error_email']='Erreur_Email';
		}
		//Sinon, si le pseudo et l'email n'existent pas, on inscrit
        if ( ($result['pseudo'] == 0) && ($result['email'] == 0)) {
			//On crypte le mdp
			$encrypted_password = sha1($post_password);
			
			//On génère une url pour l'avatar suivant le hashage de l'email renseignée, retourne $gravatar_url
			$gravatar_url = get_gravatar($post_email);
			
			//On récupère la date actuelle en secondes
			$date_inscription = time();
			
			//On prépare notre requête
			$insert_new_user = $connexion->prepare("INSERT INTO Joueur (pseudo, mdp, email, date_inscription, avatar) VALUES (:post_pseudo, :encrypted_password, :post_email, :date_inscription, :gravatar_url)");
			//On lie les valeurs de mes variables à la requête
			$insert_new_user->bindValue('post_pseudo', $post_pseudo, PDO::PARAM_STR);
			$insert_new_user->bindValue('encrypted_password', $encrypted_password, PDO::PARAM_STR);
			$insert_new_user->bindValue('post_email', $post_email, PDO::PARAM_STR);
			$insert_new_user->bindValue('date_inscription', $date_inscription, PDO::PARAM_STR);
			$insert_new_user->bindValue('gravatar_url', $gravatar_url, PDO::PARAM_STR);
			//On exécute
			$insert_new_user->execute();
			//Clore la requête préparée
			$insert_new_user->closeCursor();
			$insert_new_user = NULL;
			
			//On créé un répertoire perso sur le serveur
			//mkdir("../pictures/$post_pseudo", 0755);
			//On renvoit du json à notre ajax
			$array['success']='Success';
        }
	}
	
	echo json_encode($array);
	
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
	
	/**
	* Get either a Gravatar URL or complete image tag for a specified email address.
	*
	* @param string $email The email address
	* @param string $s Size in pixels, defaults to 80px [ 1 - 2048 ]
	* @param string $d Default imageset to use [ 404 | mm | identicon | monsterid | wavatar ]
	* @param string $r Maximum rating (inclusive) [ g | pg | r | x ]
	* @param boole $img True to return a complete IMG tag False for just the URL
	* @param array $atts Optional, additional key/value attributes to include in the IMG tag
	* @return String containing either just a URL or a complete image tag
	* @source http://gravatar.com/site/implement/images/php/
	*/
	function get_gravatar( $post_email, $s = 80, $d = 'identicon', $r = 'g', $img = false, $atts = array() ) {
		$url = 'http://www.gravatar.com/avatar/';
		$url .= md5( strtolower( trim( $post_email ) ) );
		$url .= "?s=$s&d=$d&r=$r";
		
		if ( $img ) {
			$url = '<img src="' . $url . '"';
			foreach ( $atts as $key => $val )
				$url .= ' ' . $key . '="' . $val . '"';
			$url .= ' />';
		}
		
		return $url;
	}
?>