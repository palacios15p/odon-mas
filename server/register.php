<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once './config/db.php';
// Manejo del preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['nombre'], $data['apellido'], $data['correo'], $data['password'])) {
    echo json_encode(["error" => "Faltan datos."]);
    http_response_code(400);
    exit;
}

$nombre = $data['nombre'];
$apellido = $data['apellido'];
$correo = $data['correo'];
$password = $data['password'];
$rol_id = 3; // Paciente por defecto

try {
    $db = new Database();
    $conn = $db->getConnection();

    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, apellido, correo, password, rol_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$nombre, $apellido, $correo, $password, $rol_id]);

    echo json_encode(["message" => "Usuario registrado correctamente."]);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
    http_response_code(500);
}
