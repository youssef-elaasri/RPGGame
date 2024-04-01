<?php
    $code = $_POST['code'];
    $random = substr(md5(mt_rand()),0,7);
    $filePath = "temp/" . $random . ".py";
    $programFile = fopen($filePath,"w");
    fwrite($programFile, $code);
    fclose($programFile);