<?php
    $conection = mysqli_connect("localhost","root","","CORONAVIRUSAPP"); 
    if ($conection->connect_error) {
        die($conection->connect_errno);
    }     
?>