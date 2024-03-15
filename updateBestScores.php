<?php
   // See https://www.w3schools.com/php/php_form_complete.asp to have the form processed within the page it was called
   
   $fileName = 'scores.json';
    
    // Get data that was provided (/!\ check there is no JS or HTML) 
    $nameToAdd = $_POST["name"];
    $scoreToAdd = $_POST["score"];
    $arrayToAdd = array("name" => $nameToAdd, "score" => intval($scoreToAdd));

    // Get scores.json file
    $jsonString = file_get_contents($fileName); 
    $jsonData = json_decode($jsonString, true); // change it to an array

    // Add data to the array
    array_push($jsonData, $arrayToAdd);

    // Sort the array    
    $score = array_column($jsonData, 'score'); 
    array_multisort($score, SORT_DESC, $jsonData);

    // Get rid of last element
    array_pop($jsonData);

    // Transform back into a string
    $jsonData = json_encode($jsonData);

    // Replace file
    $myFile = fopen($fileName, "w") or die("Cannot open file!");
    fwrite($myFile, $jsonData);
    fclose($myFile);

    // Redirect to previous page -- all this PHP file may actually go into the index 
?>