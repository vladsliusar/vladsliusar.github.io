<?php $name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['subject'];
$formcontent="From: $name \n Message: $message";
$recipient = "sliusar@wisc.edu";
$subject = "Contact Form";
$mailheader = "From: $email \r\n";
mail($recipient, $subject, $formcontent, $mailheader) or die("Error!");
echo "Thank you! Your message was sent.";
?>