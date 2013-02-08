<?php
//Il est où, le fichier de connexion ??? MERDE ROCCO!!!!!!!!!
include("connexion.php");

$key = generateKey();
insertKey($key);

function generateKey() {
	//TODO creer une vraie clé !!!!! MERDE ROCCO!!!!!!!!!
    $key = md5(uniqid(rand(0, 9999)));
    return $key;
}

function insertKey($pseudo, $key) {
	//TODO faire une vraie fonction qui vérifie qu'il n'y a pas d'erreur !!!!! ROCCO, on t'a répété à plusieurs reprises d'utiliser PDO !!!! MERDE !!!!!!!!
    $key = mysql_query("INSERT INTO table VALUES(".$pseudo.", ".$cle.""); 
}
?>
