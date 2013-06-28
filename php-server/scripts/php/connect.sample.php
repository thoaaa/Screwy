<?php
	/*
	//On récupère les variables de notre appli
	$env = getenv('VCAP_SERVICES');
	echo $env;
	*/
	if ('##db-use_vcap_service###' == 'true') {
		$services_json = json_decode(getenv("VCAP_SERVICES"),true);
		$mysql_config = $services_json["mysql-5.1"][0]["credentials"];
		$username = $mysql_config["username"];
		$password = $mysql_config["password"];
		$hostname = $mysql_config["hostname"];
		$port = $mysql_config["port"];
		$db = $mysql_config["name"];
	} else {
	 	$username = '##db-username##';
		$password = '##db-password##';
		$hostname = '##db-hostname##';
		$port = '##db-port##';
		$db = '##db-name##';
	}

	$link = mysql_connect("$hostname:$port", $username, $password);
	$db_selected = mysql_select_db($db, $link);
	
	/*$nom = 'Starkadh'; 
	$email = 'kisskooltagazok@msn.com'; 

	$requete = "INSERT INTO Joueur (pseudo,email) VALUES('$nom','$email')"; 
	mysql_query($requete) or die ('Erreur '.mysql_errno().' : ' . mysql_error());  
	*/

	
	//Connexion via PDO
	/*$PARAM_hote='screwy_pma.eu01.aws.af.cm'; // le chemin vers le serveur
	$PARAM_port='3306'; //port
	$PARAM_nom_bd='dcf1462cbdf434f9ebf4c43f5ec4a51f8'; // le nom de votre base de données
	$PARAM_utilisateur='projetscrewy@gmail.com'; // nom d'utilisateur pour se connecter
	$PARAM_mot_passe='sil2013screwy'; // mot de passe de l'utilisateur pour se connecter*/
	
	try {
		$connexion = new PDO('mysql:host='.$hostname.';port='.$port.';dbname='.$db, $username, $password);
		$connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch(Exception $e) {
        echo 'Erreur : '.$e->getMessage().'<br />';
        echo 'N° : '.$e->getCode();
	}
?>
