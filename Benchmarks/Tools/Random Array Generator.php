<?php

$a = Array();

for ($i = 0; $i < 5000; $i++) {
    array_push($a, $i);
}

shuffle($a);

echo json_encode($a);
