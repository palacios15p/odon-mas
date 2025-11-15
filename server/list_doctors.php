<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/config/db.php';

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "id requerido"]);
    exit;
}
$id = intval($_GET['id']);
$db = (new Database())->getConnection();

try {
    $sql = "SELECT id, nombre, apellido, correo, foto_url, rol_id FROM usuarios WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->execute([':id' => $id]);
    $doctor = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$doctor) {
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Doctor no encontrado"]);
        exit;
    }
    echo json_encode(["success" => true, "data" => $doctor]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
