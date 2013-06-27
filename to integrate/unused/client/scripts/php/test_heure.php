<?php
	$time = time();
	echo $time;
	$currentDateReadable = date('\l\e j m Y \à H:i:s', $time);
	echo $currentDateReadable;
	//1360086991
	$diff = GetTimeDiff(1360086991);
	
	function GetTimeDiff($timestamp) {
	    $how_log_ago = '';
	    $seconds = time() - $timestamp; 
	    $minutes = (int)($seconds / 60);
	    $hours = (int)($minutes / 60);
	    $days = (int)($hours / 24);
	    if ($days >= 1) {
	      $how_log_ago = $days . ' day' . ($days != 1 ? 's' : '');
	    } else if ($hours >= 1) {
	      $how_log_ago = $hours . ' hour' . ($hours != 1 ? 's' : '');
	    } else if ($minutes >= 1) {
	      $how_log_ago = $minutes . ' minute' . ($minutes != 1 ? 's' : '');
	    } else {
	      $how_log_ago = $seconds . ' second' . ($seconds != 1 ? 's' : '');
	    }
	    return $how_log_ago;
	}

	//$enmin = date('i \m\i\n', $soustraction);
	print("<br />EN min : $diff");
?>