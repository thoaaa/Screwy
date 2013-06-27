<?php
	//S'il y a des cookies
    $pseudo_cookie = $_COOKIE['screwy_pseudo'];
    $password_cookie = $_COOKIE['screwy_password'];
    $checked = 'checked';
    //Si pour une raison quelconque nos cookies sont à null, on les met à ''
    if (($pseudo_cookie == 'null') && ($password_cookie == 'null')) {
        $pseudo_cookie = '';
        $password_cookie = '';
        $checked = '';
    }
?>