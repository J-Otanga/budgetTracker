<?php
require 'db.php';


$name = $_POST['name'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo "Email already exists!";
} else {
    $stmt = $conn->prepare("INSERT INTO users (surname, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $password);
    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "Registration failed: " . $stmt->error;
    }
}
$stmt->close();
$conn->close();
?>
