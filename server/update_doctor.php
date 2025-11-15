<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: PUT, POST");

require_once __DIR__ . '/config/db.php';

$data = json_decode(file_get_contents("php://input"), true);
if (empty($data['id'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "id requerido"]);
    exit;
}
$id = intval($data['id']);

$db = (new Database())->getConnection();

try {
    $fields = [];
    $params = [':id' => $id];
    if (isset($data['nombre'])) { $fields[] = "nombre = :nombre"; $params[':nombre'] = $data['nombre']; }
    if (isset($data['apellido'])) { $fields[] = "apellido = :apellido"; $params[':apellido'] = $data['apellido']; }
    if (isset($data['correo'])) { $fields[] = "correo = :correo"; $params[':correo'] = $data['correo']; }
    if (isset($data['foto_url'])) { $fields[] = "foto_url = :foto_url"; $params[':foto_url'] = $data['foto_url']; }
    if (isset($data['password']) && $data['password'] !== '') {
        $fields[] = "password = :password";
        $params[':password'] = password_hash($data['password'], PASSWORD_DEFAULT);
    }

    if (count($fields) === 0) {
        echo json_encode(["success" => false, "error" => "Nada para actualizar"]);
        exit;
    }

    $sql = "UPDATE usuarios SET " . implode(", ", $fields) . " WHERE id = :id";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    echo json_encode(["success" => true, "updated" => $stmt->rowCount()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
