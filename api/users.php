<?php
// api/users.php - User Profile & Settings API

require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? sanitize($_GET['action']) : '';
$token = getBearerToken();

// Verify authentication for all endpoints
if (!$token || !verifyToken($token)) {
    echo errorResponse('Unauthorized', 401);
    exit;
}

// Extract userId from token (simple parsing)
$tokenParts = explode('.', $token);
$payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1])), true);
$userId = $payload['userId'] ?? null;

if (!$userId) {
    echo errorResponse('Invalid token', 401);
    exit;
}

if ($method === 'GET') {
    if ($action === 'profile') {
        getProfile($userId);
    } elseif ($action === 'orders') {
        getOrders($userId);
    } else {
        echo errorResponse('Invalid action');
    }
} elseif ($method === 'POST') {
    if ($action === 'update-profile') {
        updateProfile($userId);
    } elseif ($action === 'change-password') {
        changePassword($userId);
    } else {
        echo errorResponse('Invalid action');
    }
} else {
    echo errorResponse('Method not allowed', 405);
}

function getProfile($userId) {
    $conn = getConnection();
    
    $stmt = $conn->prepare('SELECT id, first_name, last_name, email, phone, city, province, bio, created_at FROM users WHERE id = ?');
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo errorResponse('User not found', 404);
        return;
    }
    
    $user = $result->fetch_assoc();
    echo successResponse($user, 'Profile retrieved');
    
    $stmt->close();
    $conn->close();
}

function updateProfile($userId) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $firstName = sanitize($data['firstName'] ?? '');
    $lastName = sanitize($data['lastName'] ?? '');
    $phone = sanitize($data['phone'] ?? '');
    $city = sanitize($data['city'] ?? '');
    $province = sanitize($data['province'] ?? '');
    $bio = sanitize($data['bio'] ?? '');
    
    $conn = getConnection();
    
    $stmt = $conn->prepare('UPDATE users SET first_name = ?, last_name = ?, phone = ?, city = ?, province = ?, bio = ?, updated_at = NOW() WHERE id = ?');
    $stmt->bind_param('ssssssi', $firstName, $lastName, $phone, $city, $province, $bio, $userId);
    
    if ($stmt->execute()) {
        echo successResponse(['userId' => $userId], 'Profile updated successfully');
    } else {
        echo errorResponse('Failed to update profile');
    }
    
    $stmt->close();
    $conn->close();
}

function changePassword($userId) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
        echo errorResponse('Missing password fields');
        return;
    }
    
    $currentPassword = $data['currentPassword'];
    $newPassword = $data['newPassword'];
    
    if (strlen($newPassword) < 8) {
        echo errorResponse('New password must be at least 8 characters');
        return;
    }
    
    $conn = getConnection();
    
    $stmt = $conn->prepare('SELECT password FROM users WHERE id = ?');
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if (!verifyPassword($currentPassword, $user['password'])) {
        echo errorResponse('Current password is incorrect');
        return;
    }
    
    $hashedPassword = hashPassword($newPassword);
    
    $stmt = $conn->prepare('UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?');
    $stmt->bind_param('si', $hashedPassword, $userId);
    
    if ($stmt->execute()) {
        echo successResponse(['userId' => $userId], 'Password changed successfully');
    } else {
        echo errorResponse('Failed to change password');
    }
    
    $stmt->close();
    $conn->close();
}

function getOrders($userId) {
    $conn = getConnection();
    
    $stmt = $conn->prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC');
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
    
    echo successResponse(['orders' => $orders], 'Orders retrieved');
    
    $stmt->close();
    $conn->close();
}
?>