<?php
header('Access-Control-Allow-Origin: *');

$host = "127.0.0.1";
$port = 5433;
$dbname = "gisdb";
$user = "postgres";
$password = "123456";

$connect_string = "host={$host} port={$port} dbname={$dbname} user={$user} password={$password}";
$connection = @pg_connect($connect_string);

//$response = array(
//    "success" => true,
//    "message" => "ok"
//);

if (!$connection) {
    $response = array(
        "success" => false,
        "message" => "Can not connect to db server"
    );
    pg_close($connection);
} else {
    $request = json_decode($_REQUEST["request"]);
    $username = $request->userid;
    $pasw = $request->password;
    $sql1 = "select * from gis_user where username = $1";
    $result1 = pg_query_params($connection, $sql1, array($username));
    $res = pg_num_rows($result1);
    if ($res === 0) {
        $sql2 = "insert into gis_user values($1,$2)";
        $result2 = pg_query_params($connection, $sql2, array($username, $psw));
        if (!$result2) {
            $response = array(
                "success" => false,
                "message" => pg_last_error($connection)
            );
        } else {
            $response = array(
                "success" => true,
                "message" => "注册成功，请登录！"
            );
            @pg_free_result($result2);
        }
        @pg_free_result($res);
    } else {
        $response = array(
            "success" => false,
            "message" => "用户名已存在，请重新输入!"
        );
    }
    pg_close($connection);
}


///

echo json_encode($response);


