<?php
include("connexion.php");

function genere() {
    $cle = md5(uniqid(rand(0, 9999)));
    insereCle($pseudo, $cle);
}

function insereCle($pseudo, $cle) {
    $sql = mysql_query("INSERT INTO table VALUES(".$pseudo.", ".$cle."");
    return $cle;   
}
?>