<?php
header("Content-Type: application/json");
date_default_timezone_set("Asia/Taipei");
include('config.php');

// Initial JSON array
$json = array(
    'visa' => array(
        'date'   => null,
        'length' => 0
    ),
    'mastercard' => array(
        'date'   => null,
        'length' => 0
    ),
    'jcb' => array(
        'date'   => null,
        'length' => 0
    )
);

// Deal with visa and mastercard first
$link = new PDO(CONNECT_STR, DB_USER, DB_PASS);
$list = array('visa', 'mastercard');

foreach($list as $int_org) {

    $sql = "SELECT * FROM `paywhich` WHERE `int_org` = ? ORDER BY `created_at` DESC LIMIT 12";
    $sth = $link->prepare($sql);
    $sth->execute(array($int_org));


    while( $result = $sth->fetch(PDO::FETCH_OBJ) ) {

        $json[$int_org][$result->base_currency] = array(
            'NTD' => floatval($result->TWD)
        );

        $json[$int_org]['date'] = $result->settle_date;
        $json[$int_org]['length']++;
    }
}

// Then deal with JCB
$sql = "SELECT * FROM `paywhich` WHERE `int_org` = 'jcb' ORDER BY `created_at` DESC LIMIT 1";
$sth = $link->prepare($sql);
$sth->execute(array());
$result = $sth->fetch(PDO::FETCH_OBJ);
$data = json_decode($result->json);

foreach( $data as $cur => $val ) {

    // Skip TWD
    if( $cur == 'TWD' )
        continue;

    $json['jcb'][$cur] = array(
        'USD' => floatval($val),
        'NTD' => floatval($data->TWD) / floatval($val) // Using NTD
    );

    $json['jcb']['length']++;
}

$json['jcb']['USD'] = array(
    'NTD' => floatval($data->TWD)
);

$json['jcb']['length']++;
$json['jcb']['date'] = $result->settle_date;

echo $_GET['callback'] . '(' . json_encode($json) . ')';
