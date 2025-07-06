<?php
session_start(); // Start the session at the very beginning of the script
require 'db.php'; // Include the database connection

// Check if email and password were submitted via POST
if (!isset($_POST['email']) || !isset($_POST['password'])) {
    echo json_encode(["status" => "error", "message" => "Missing email or password."]);
    exit(); // Stop execution if required fields are missing
}

$email = $_POST['email']; // Get email from POST data
$password = $_POST['password']; // Get password from POST data

// Prepare a SQL statement to select the user's ID, full name, and hashed password based on their email
// Ensure 'full_name' matches the column in your database table.
$stmt = $conn->prepare("SELECT id, surname, password FROM users WHERE email = ?");

// Check if the statement preparation failed
if ($stmt === false) {
    echo json_encode(["status" => "error", "message" => "Error preparing statement: " . $conn->error]);
    exit();
}

$stmt->bind_param("s", $email); // Bind the email parameter as a string
$stmt->execute(); // Execute the prepared statement
$stmt->store_result(); // Store the result so we can check the number of rows

if ($stmt->num_rows == 1) { // If exactly one user with that email is found
    $stmt->bind_result($id, $full_name, $hashed_password); // Bind the results to variables
    $stmt->fetch(); // Fetch the results

    // Verify the provided password against the hashed password from the database
    if (password_verify($password, $hashed_password)) {
        // Password is correct, set session variables
        $_SESSION['user_id'] = $id; // Store user ID in session
        $_SESSION['user_name'] = $full_name; // Store user's full name in session
        $_SESSION['user_email'] = $email; // Store user's email in session

        echo json_encode(["status" => "success", "name" => $full_name]); // Send success response with user's name
    } else {
        // Password does not match
        echo json_encode(["status" => "error", "message" => "Wrong password"]);
    }
} else {
    // No user found with the provided email
    echo json_encode(["status" => "error", "message" => "No user found with that email"]);
}

$stmt->close(); // Close the prepared statement
$conn->close(); // Close the database connection
?>
