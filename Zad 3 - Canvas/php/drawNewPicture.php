<?php
    $dir = './data/data.json';
    $folder = fopen("semafor.txt","w+");
    flock($folder, LOCK_EX);

    header('Content-Type: application/json');
    $get_data = json_decode(file_get_contents('php://input'), true);
    $array = json_decode(file_get_contents($dir));

    $new_paint = new stdClass();

    $new_paint->name = $get_data['name'];
    $new_paint->lines = $get_data['lines'];
    $new_paint->thumbnail = $get_data['thumbnail'];

    array_push($array->data, $new_paint);

    $turn_code = "{\"data\":";
    $turn_code .= json_encode($array->data);
    $turn_code .= "}";

    print_r($turn_code);
    
    file_put_contents($dir, $turn_code);
    
    flock($folder, LOCK_UN);
    fclose($folder);
?>