<?php
header("Content-Type: application/json");
date_default_timezone_set("Asia/Taipei");
include('../include/config.php');

$json = array(
    'visa' => array(
        'EUR' => array(
            'TWD' => null
        ),
        'date' => null
    ),
    'mastercard' => array(
        'EUR' => array(
            'TWD' => null
        ),
        'date' => null
    )
);

$link = new PDO(CONNECT_STR, DB_USER, DB_PASS);

// VISA
$sql = "SELECT `TWD`, `settle_date` FROM ? ORDER BY `datetime` DESC LIMIT 1";
$sth = $link->prepare($sql);
$sth->execute(array('visa'));
$result = $sth->fetch(PDO::FETCH_OBJ);

//var_dump($result);
$json['visa']['EUR']['NTD'] = $result->TWD;
$json['visa']['date'] = $result->settle_date;

// MASTER
$sql = "SELECT `TWD`, `settle_date` FROM `mastercard` ORDER BY `datetime` DESC LIMIT 1";
$sth = $link->prepare($sql);
$sth->execute();
$result = $sth->fetch(PDO::FETCH_OBJ);

//var_dump($result);
$json['mastercard']['EUR']['NTD'] = $result->TWD;
$json['mastercard']['date'] = $result->settle_date;

echo $_GET['callback'] . '(' . json_encode($json) . ')';
