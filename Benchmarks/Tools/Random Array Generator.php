<?php

/**
 * Create an array that contains every integer from 0 to 4999 (inclusive)
 * then shuffle it.
 */
$a = Array();

for ($i = 0; $i < 5000; $i++) {
    array_push($a, $i);
}

shuffle($a);

echo json_encode($a);
