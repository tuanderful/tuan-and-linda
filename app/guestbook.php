<?php

//if posting only
if(isset($_POST['submit'])) {

		$to = 'goranefbl@gmail.com'; // Change this line to your email.
		
		$name = isset($_POST['name']) ? trim($_POST['name']) : '';
		$email = isset($_POST['email']) ? trim($_POST['email']) : '';
		$message = isset($_POST['comment']) ? trim($_POST['comment']) : '';
		$subject = 'Guestbook Form Submission';
		
		if($name && $email && filter_var($email, FILTER_VALIDATE_EMAIL)) {
			$headers  = 'MIME-Version: 1.0' . "\r\n";
			$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
			$headers .= "From: My Wedding Website <no-replay@" . $_SERVER['SERVER_NAME'] . ">\r\n";
			
			$message .= 'New Guestbook Form Submission<br />';
			$message .= ' <br /> Name: ' . $name;
			$message .= ' <br /> Email: ' . $email;
			
			@$send = mail($to, $subject, $message, $headers);
			
			if($send) {
				$return['type'] = 'success';
				$return['message'] = 'Email successfully sent.';
			} else {
				$return['message'] = 'Error sending email.';
			}
		} else {
			$return['message'] = 'Error validating email.';
		}
	
	die(json_encode($return));
}

?>