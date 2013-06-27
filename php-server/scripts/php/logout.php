<?php
	//Acc�s aux variables superglobales de la session
	session_start();
	//On d�truit toutes nos variables de session
	session_unset();
	//On met � 0 notre tableau de variables de session
	$_SESSION = array();
	//On d�truit notre session
	session_destroy();
	//On �crit les donn�es de session et on ferme
	session_write_close();
	//On change l'id de session par un nouveau
	session_regenerate_id();  
	
	$array = array('logout'=>'Logout_OK');
	echo json_encode($array);
?>