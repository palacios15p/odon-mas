<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { exit; }

include_once './config/db.php';

$db = new Database();
$conn = $db->getConnection();

// Leer JSON del frontend
$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? "";
$password = $data["password"] ?? "";

// Validación básica
if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Campos vacíos"]);
    exit;
}

// Buscar al usuario
$stm = $conn->prepare("
    SELECT 
        u.id, u.nombre, u.apellido, u.correo, u.password, u.foto_url,
        r.id AS rol_id, r.nombre AS rol_nombre
    FROM usuarios u
    INNER JOIN roles r ON r.id = u.rol_id
    WHERE u.correo = ? 
    LIMIT 1
");
$stm->execute([$email]);
$user = $stm->fetch(PDO::FETCH_ASSOC);

// Validar usuario
if (!$user || $user["password"] !== $password) {
    http_response_code(401);
    echo json_encode(["error" => "Correo o contraseña incorrectos"]);
    exit;
}

// Crear token
$token = bin2hex(random_bytes(32));

// Guardar token en sesiones
$stm = $conn->prepare("
    INSERT INTO sesiones (usuario_id, token, activa)
    VALUES (?, ?, 1)
");
$stm->execute([$user["id"], $token]);

// Construir respuesta
$responseUser = [
    "id" => $user["id"],
    "nombre" => $user["nombre"],
    "apellido" => $user["apellido"],
    "correo" => $user["correo"],
    "foto_url" => $user["foto_url"],
    "rol" => [
        "id" => $user["rol_id"],
        "nombre" => $user["rol_nombre"]
    ]
];

echo json_encode([
    "token" => $token,
    "user" => $responseUser
]);
