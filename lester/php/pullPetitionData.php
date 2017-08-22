<?php

if ((include 'DBConn.php') != 1) return;

$pullQuery= "SELECT * FROM PetitionStatus";
$data = array();
$result = mysqli_query($conn, $pullQuery);

if (mysqli_num_rows($result) > 0) {
  	while ($row = mysqli_fetch_assoc($result)) {
      array_push($data, $row);
    }
    echo json_encode($data);
} else {
    echo "NORES";
}

?>
