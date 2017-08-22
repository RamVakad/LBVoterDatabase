<?php

if ((include 'DBConn.php') != 1) return;

$vid = mysqli_real_escape_string($conn, $_GET["VID"]);
$status = mysqli_real_escape_string($conn, $_GET["STATUS"]);
$date = mysqli_real_escape_string($conn, $_GET["DATE"]);


$showData = "SELECT Status FROM PetitionStatus WHERE VoterID = ".$vid;
$data = array();
$result = mysqli_query($conn, $showData);

if (mysqli_num_rows($result) > 0) {
  	$update = "UPDATE PetitionStatus SET Status = '{$status}', Date = '{$date}' WHERE VoterID = ".$vid;
    mysqli_query($conn, $update);
    echo "SUCCESS";
} else {
    $insert = "INSERT INTO PetitionStatus VALUES ({$vid},'{$status}', '{$date}')";
    mysqli_query($conn, $insert);
    echo "SUCCESS";
}

mysqli_commit();

?>
