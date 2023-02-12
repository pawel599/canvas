<?php
    $dir = './data/data.json';
    $folder = fopen("semafor.txt","w+");
    flock($folder, LOCK_EX);

    header('Content-Type: application/json');
    $get_data = json_decode(file_get_contents('php://input'), true);

    $www = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $www_parts = parse_url($www);
    parse_str($www_parts['query'], $params);

    $param = $params['id'];
    $proper_id = preg_replace("([[:punct:]]|[[:alpha:]]| )",'',$param);
    echo $proper_id;
    
    $array = json_decode(file_get_contents($dir));

    $array->data[$proper_id]->lines = $get_data['lines'];
    $array->data[$proper_id]->thumbnail = $get_data['thumbnail'];
    $array->data[$proper_id]->name = $get_data['name'];

    $turn_code = "{\"data\":";
    $turn_code .= json_encode($array->data);
    $turn_code .= "}";
    
    file_put_contents($dir, $turn_code);
    
    flock($folder, LOCK_UN);
    fclose($folder);
?>