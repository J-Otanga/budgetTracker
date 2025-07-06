<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = $_POST['action'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    $conn = new mysqli("localhost", "root", "2525", "budget_tracker", 3307);

    if ($conn->connect_error) {
        $_SESSION['error'] = "Database connection failed.";
        header("Location: index.php");
        exit();
    }

    if ($action === "register") {
        $surname = $_POST['surname'];

        // Basic validation
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $_SESSION['error'] = "Invalid email format.";
            header("Location: index.php");
            exit();
        }

        if (strlen($password) < 6) {
            $_SESSION['error'] = "Password must be at least 6 characters.";
            header("Location: index.php");
            exit();
        }

        // Check for existing email
        $check = $conn->prepare("SELECT email FROM users WHERE email = ?");
        $check->bind_param("s", $email);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            $_SESSION['error'] = "Email already exists.";
            $check->close();
            $conn->close();
            header("Location: index.php");
            exit();
        }

        $check->close();

        $hashed = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users(surname, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $surname, $email, $hashed);

        if ($stmt->execute()) {
            $_SESSION['success'] = "Account created! Please log in.";
        } else {
            $_SESSION['error'] = "Registration failed. Try again.";
        }

        $stmt->close();
    } else if ($action === "login") {
        $stmt = $conn->prepare("SELECT surname, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows === 1) {
            $stmt->bind_result($surname, $hashed_password);
            $stmt->fetch();

            if (password_verify($password, $hashed_password)) {
                $_SESSION['logged_in'] = true;
                $_SESSION['user_name'] = $surname;
                header("Location: dashboard.php"); // Or your main app page
                exit();
            } else {
                $_SESSION['error'] = "Incorrect password.";
            }
        } else {
            $_SESSION['error'] = "Account not found.";
        }

        $stmt->close();
    }

    $conn->close();
    header("Location: index.php");
    exit();
}
?>
