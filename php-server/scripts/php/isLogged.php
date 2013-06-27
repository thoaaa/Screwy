<?php
    //On récupère les variables de session
    $id_user = $_SESSION['id_user_logged'];
    $pseudo_user = $_SESSION['pseudo_user_logged'];
    $password_user = $_SESSION['password_user_logged'];
    $email_user = $_SESSION['email_user_logged'];
    $date_inscription_user = $_SESSION['date_inscription_user_logged'];
	$avatar_user = $_SESSION['avatar_user_logged'];
	$date_last_connexion_user = $_SESSION['date_last_connexion_user_logged'];
	$nombre_parties_user = $_SESSION['nombre_parties_user_logged'];
	$nombre_points_user = $_SESSION['nombre_points_user_logged'];
	$id_salon_user = $_SESSION['id_salon_user_logged'];
	$cle_salon_user = $_SESSION['cle_salon_user_logged'];
?>