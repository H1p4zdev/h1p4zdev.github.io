<?php

// Error reporting and display (for debugging)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Email configuration
$to_email = "parvezhimel1@gmail.com";  // Replace with your email address
$subject = "New Message from Contact Form";
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';

// Validate input (optional, but recommended)
if (empty($name) || empty($email) || empty($message)) {
    die("Error: Missing required fields.");
}

// Compose email message
$mail_body = "
Quotes:-
Name: $name
Email: $email
Message: $message
";

// Send email
if (mail($to_email, $subject, $mail_body)) {
    echo "Message sent successfully!";
} else {
    echo "Failed to send message. Please try again later.";
}

?>