<?php
    $dir = './data/data.json';
    $folder = fopen("semafor.txt","w+");
    flock($folder, LOCK_EX);

    header('Content-Type: application/json');
    $info = file_get_contents($dir);

    echo $info;

    flock($folder, LOCK_UN);
    fclose($folder);
?>