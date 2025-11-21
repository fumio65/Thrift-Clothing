<?php
// api/auth.php - Authentication API

// Enable error logging
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Set JSON header first
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include config
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? sanitize($_GET['action']) : '';

if ($method === 'POST') {
    $input = file_get_contents('php://input');
    
    // Debug: Check if input is empty
    if (empty($input)) {
        echo json_encode([
            'success' => false,
            'message' => 'Empty request body',
            'debug' => 'No data received from client'
        ]);
        exit;
    }
    
    $data = json_decode($input, true);
    
    // Debug: Check if JSON is valid
    if ($data === null) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid JSON format',
            'debug' => 'Could not decode JSON: ' . json_last_error_msg()
        ]);
        exit;
    }
    
    if ($action === 'register') {
        handleRegister($data);
    } elseif ($action === 'login') {
        handleLogin($data);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid action: ' . $action
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}

function handleRegister($data) {
    // Validate input
    if (!isset($data['firstName']) || !isset($data['lastName']) || !isset($data['email']) || !isset($data['password'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields',
            'received' => $data
        ]);
        return;
    }
    
    $firstName = sanitize($data['firstName']);
    $lastName = sanitize($data['lastName']);
    $email = sanitize($data['email']);
    $password = $data['password'];
    
    // Validate email
    if (!isValidEmail($email)) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email address'
        ]);
        return;
    }
    
    // Validate password length
    if (strlen($password) < 8) {
        echo json_encode([
            'success' => false,
            'message' => 'Password must be at least 8 characters'
        ]);
        return;
    }
    
    try {
        $conn = getConnection();
        
        // Check if email already exists
        $stmt = $conn->prepare('SELECT id FROM users WHERE email = ?');
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }
        
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Email already registered'
            ]);
            $stmt->close();
            $conn->close();
            return;
        }
        
        $stmt->close();
        
        // Hash password
        $hashedPassword = hashPassword($password);
        $createdAt = date('Y-m-d H:i:s');
        
        // Insert new user
        $stmt = $conn->prepare('INSERT INTO users (first_name, last_name, email, password, created_at) VALUES (?, ?, ?, ?, ?)');
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }
        
        $stmt->bind_param('sssss', $firstName, $lastName, $email, $hashedPassword, $createdAt);
        
        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }
        
        $userId = $conn->insert_id;
        $token = generateToken($userId, $email);
        
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful',
            'data' => [
                'userId' => $userId,
                'email' => $email,
                'firstName' => $firstName,
                'lastName' => $lastName,
                'token' => $token
            ]
        ]);
        
        $stmt->close();
        $conn->close();
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Registration failed: ' . $e->getMessage()
        ]);
    }
}

function handleLogin($data) {
    // Validate input
    if (!isset($data['email']) || !isset($data['password'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Email and password required'
        ]);
        return;
    }
    
    $email = sanitize($data['email']);
    $password = $data['password'];
    
    try {
        $conn = getConnection();
        
        // Get user
        $stmt = $conn->prepare('SELECT id, first_name, last_name, email, password FROM users WHERE email = ?');
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }
        
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email or password'
            ]);
            $stmt->close();
            $conn->close();
            return;
        }
        
        $user = $result->fetch_assoc();
        $stmt->close();
        
        // Verify password
        if (!verifyPassword($password, $user['password'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email or password'
            ]);
            $conn->close();
            return;
        }
        
        // Generate token
        $token = generateToken($user['id'], $user['email']);
        
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'userId' => $user['id'],
                'email' => $user['email'],
                'firstName' => $user['first_name'],
                'lastName' => $user['last_name'],
                'token' => $token
            ]
        ]);
        
        $conn->close();
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Login failed: ' . $e->getMessage()
        ]);
    }
}

// Ensure output ends with newline (prevents JSON parsing errors)
?>