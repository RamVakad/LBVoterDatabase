<?php

if ((include 'DBConn.php') != 1) return;

$vid = mysqli_real_escape_string($conn, $_GET["VID"]);

$showData = "SELECT Status, Date FROM PetitionStatus WHERE VoterID = ".$vid;
$data = array();
$result = mysqli_query($conn, $showData);

if (mysqli_num_rows($result) > 0) {
  	while ($row = mysqli_fetch_assoc($result)) $data[] = $row;
    echo json_encode($data);
} else {
    echo "NORES";
}

?>
