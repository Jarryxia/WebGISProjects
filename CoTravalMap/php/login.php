<?php
header('Access-Control-Allow-Origin: *');

$host = "127.0.0.1";
$port = 5433;
$dbname = "gisdb";
$user = "postgres";
$password = "123456";

$connect_string = "host={$host} port={$port} dbname={$dbname} user={$user} password={$password}";
$connection = @pg_connect($connect_string);

if (!$connection) {
    $response = array(
        "success" => false,
        "message" => pg_last_error($connection)
    );
    pg_close($connection);
} else {
    $request = json_decode($_REQUEST["request"]);
    $username = $request->userid;
    $pasw = $request->password;
    $sql = "select * from gis_user where username = $1 and password = $2";
    $result = pg_query_params($connection, $sql, array($username, $pasw));
    $res = pg_num_rows($result);
    if ($res === 0) {
        $response = array(
            "success" => false,
            "message" => "登陆失败！"
        );
    } else {
        $response = array(
            "success" => true,
            "message" => "登陆成功！"
        );
    }
    @pg_free_result($result);
    pg_close($connection);
}

echo json_encode($response);
