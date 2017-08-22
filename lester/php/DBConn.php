<?php

$servername = "";
$username = "";
$password = "";
$dbname = "";

$conn = mysqli_connect($servername, $username, $password, $dbname);

if(!$conn) {
    echo "DBCONNFAIL";
    return;
}

$password = mysqli_real_escape_string($conn, $_GET["PASSWORD"]);
if ($password != "") {
    echo "NOAUTH";
    return;
}


?>
