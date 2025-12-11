<?php
// api/products.php - Products API

require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? sanitize($_GET['action']) : '';

if ($method === 'GET') {
    if ($action === 'all') {
        getProducts();
    } elseif ($action === 'single') {
        getSingleProduct();
    } else {
        echo errorResponse('Invalid action');
    }
} elseif ($method === 'POST') {
    if ($action === 'add') {
        addProduct();
    } else {
        echo errorResponse('Invalid action');
    }
} else {
    echo errorResponse('Method not allowed', 405);
}

function getProducts() {
    $conn = getConnection();
    
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 12;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $category = isset($_GET['category']) ? sanitize($_GET['category']) : '';
    $sort = isset($_GET['sort']) ? sanitize($_GET['sort']) : 'newest';
    
    $query = 'SELECT * FROM products WHERE 1=1';
    
    if ($category && $category !== 'all') {
        $query .= ' AND category = "' . $conn->real_escape_string($category) . '"';
    }
    
    // Apply sorting
    switch ($sort) {
        case 'price_low':
            $query .= ' ORDER BY price ASC';
            break;
        case 'price_high':
            $query .= ' ORDER BY price DESC';
            break;
        case 'best_sellers':
            $query .= ' ORDER BY sales DESC';
            break;
        default:
            $query .= ' ORDER BY created_at DESC';
    }
    
    $query .= ' LIMIT ' . $limit . ' OFFSET ' . $offset;
    
    $result = $conn->query($query);
    
    if (!$result) {
        echo errorResponse('Query failed: ' . $conn->error);
        return;
    }
    
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    
    // Get total count
    $countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    if ($category && $category !== 'all') {
        $countQuery .= ' AND category = "' . $conn->real_escape_string($category) . '"';
    }
    
    $countResult = $conn->query($countQuery);
    $countRow = $countResult->fetch_assoc();
    
    echo successResponse([
        'products' => $products,
        'total' => $countRow['total'],
        'limit' => $limit,
        'offset' => $offset
    ], 'Products retrieved');
    
    $conn->close();
}

function getSingleProduct() {
    if (!isset($_GET['id'])) {
        echo errorResponse('Product ID required');
        return;
    }
    
    $productId = (int)$_GET['id'];
    $conn = getConnection();
    
    $stmt = $conn->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->bind_param('i', $productId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo errorResponse('Product not found', 404);
        return;
    }
    
    $product = $result->fetch_assoc();
    echo successResponse($product, 'Product retrieved');
    
    $stmt->close();
    $conn->close();
}

function addProduct() {
    $token = getBearerToken();
    
    if (!$token || !verifyToken($token)) {
        echo errorResponse('Unauthorized', 401);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $required = ['name', 'price', 'category', 'condition', 'description'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            echo errorResponse("Missing field: $field");
            return;
        }
    }
    
    $name = sanitize($data['name']);
    $price = (float)$data['price'];
    $category = sanitize($data['category']);
    $condition = sanitize($data['condition']);
    $description = sanitize($data['description']);
    $stock = isset($data['stock']) ? (int)$data['stock'] : 0;
    $createdAt = date('Y-m-d H:i:s');
    
    $conn = getConnection();
    
    $stmt = $conn->prepare('INSERT INTO products (name, price, category, condition, description, stock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('sdsssis', $name, $price, $category, $condition, $description, $stock, $createdAt);
    
    if ($stmt->execute()) {
        $productId = $conn->insert_id;
        echo successResponse(['id' => $productId], 'Product added successfully');
    } else {
        echo errorResponse('Failed to add product');
    }
    
    $stmt->close();
    $conn->close();
}
?>