<?php
	//Accès aux variables superglobales de la session
	session_start();
	//On détruit toutes nos variables de session
	session_unset();
	//On met à 0 notre tableau de variables de session
	$_SESSION = array();
	//On détruit notre session
	session_destroy();
	//On écrit les données de session et on ferme
	session_write_close();
	//On change l'id de session par un nouveau
	session_regenerate_id();  
	
	$array = array('logout'=>'Logout_OK');
	echo json_encode($array);
?>