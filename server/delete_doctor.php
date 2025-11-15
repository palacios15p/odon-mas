<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: DELETE, POST");

require_once __DIR__ . '/config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'DELETE') {
    parse_str(file_get_contents("php://input"), $data);
} else {
    $data = json_decode(file_get_contents("php://input"), true) ?? $_POST;
}

if (empty($data['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "id requerido"]);
    exit;
}
$id = intval($data['id']);

$db = (new Database())->getConnection();

try {
    $stmt = $db->prepare("DELETE FROM usuarios WHERE id = :id");
    $stmt->execute([':id' => $id]);
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Doctor no encontrado"]);
        exit;
    }
    echo json_encode(["success" => true, "deleted" => $id]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
