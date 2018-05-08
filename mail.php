<?php 
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['subject'];
    
    $email_from = "sliusar@wisc.edu";
        
    $formcontent="From: $name \n Message: $message";
    $subject = "Contact Form";

    $recipient = "sliusar@wisc.edu";
 
    $mailheader = "From: $email \r\n"; 
    mail($recipient, $subject, $formcontent, $mailheader) or die("Error!");
    header("location: contact.html");
    echo "Thank you! Your message was sent.";
?>