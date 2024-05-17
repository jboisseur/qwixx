<?php 
// Initial data
$ini = '[{"name":"gégé","score":10},{"name":"Blue dragon","score":9},{"name":"Piwa","score":8},{"name":"SupremTaco","score":7},{"name":"Qween","score":6},{"name":"L","score":5},{"name":"Ada","score":4},{"name":"Samantha","score":3},{"name":"Robin","score":2},{"name":"Yoshi","score":1}]';

// Update file
$myFile = fopen("todayscores.json", "w") or die("Cannot open file! Check permissions on json file");
fwrite($myFile, $ini);
fclose($myFile);
?>