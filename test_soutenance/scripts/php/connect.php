<?php
	/*
	//On récupère les variables de notre appli
	$env = getenv('VCAP_SERVICES');
	echo $env;
	*/
	
/*
    $services_json = json_decode(getenv("VCAP_SERVICES"),true);
    $mysql_config = $services_json["mysql-5.1"][0]["credentials"];
    $username = $mysql_config["username"];
    $password = $mysql_config["password"];
    $hostname = $mysql_config["hostname"];
    $port = $mysql_config["port"];
    $db = $mysql_config["name"];
    $link = mysql_connect("$hostname:$port", $username, $password);
    $db_selected = mysql_select_db($db, $link);*/
	
	/*$nom = 'Starkadh'; 
	$email = 'kisskooltagazok@msn.com'; 

	$requete = "INSERT INTO Joueur (pseudo,email) VALUES('$nom','$email')"; 
	mysql_query($requete) or die ('Erreur '.mysql_errno().' : ' . mysql_error());  
	*/

	
	//Connexion via PDO
	$PARAM_hote='localhost'; // le chemin vers le serveur
	$PARAM_port='3306'; //port
	$PARAM_nom_bd='dcf1462cbdf434f9ebf4c43f5ec4a51f8'; // le nom de votre base de données
	$PARAM_utilisateur='root'; // nom d'utilisateur pour se connecter
	$PARAM_mot_passe='root'; // mot de passe de l'utilisateur pour se connecter
	
	try {
		$connexion = new PDO('mysql:host='.$PARAM_hote.';port='.$PARAM_port.';dbname='.$PARAM_nom_bd, $PARAM_utilisateur, $PARAM_mot_passe);
		$connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch(Exception $e) {
        echo 'Erreur : '.$e->getMessage().'<br />';
        echo 'N° : '.$e->getCode();
	}
?>