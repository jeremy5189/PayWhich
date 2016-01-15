<?php
header("Content-Type: application/json");
date_default_timezone_set("Asia/Taipei");
include('../include/config.php');

$json = array(
    'visa' => array(
        'date' => null
    ),
    'mastercard' => array(
        'date' => null
    )
);

$link = new PDO(CONNECT_STR, DB_USER, DB_PASS);

$list = array('visa', 'mastercard');

foreach($list as $int_org) {

    $sql = "SELECT * FROM `paywhich` WHERE `int_org` = ? ORDER BY `created_at` DESC LIMIT 12";
    $sth = $link->prepare($sql);
    $sth->execute(array($int_org));

    while( $result = $sth->fetch(PDO::FETCH_OBJ) ) {
        $json[$int_org][$result->base_currency] = array(
            'NTD' => $result->TWD
        );
    }

    $json[$int_org]['date'] = $result->settle_date;
}

echo $_GET['callback'] . '(' . json_encode($json) . ')';
