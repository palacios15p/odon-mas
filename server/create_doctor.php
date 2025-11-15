<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

require_once __DIR__ . '/config/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['nombre']) || empty($data['apellido']) || empty($data['correo']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "faltan campos obligatorios"]);
    exit;
}

$db = (new Database())->getConnection();

try {
    // obtener rol doctor id (crea si no existe)
    $r = $db->prepare("SELECT id FROM roles WHERE nombre = 'Doctor' LIMIT 1");
    $r->execute();
    $rol = $r->fetchColumn();
    if (!$rol) {
        $db->prepare("INSERT INTO roles (nombre) VALUES ('Doctor')")->execute();
        $rol = $db->lastInsertId();
    }

    // password mínimo: hash
    $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios (nombre, apellido, correo, password, foto_url, rol_id)
            VALUES (:nombre, :apellido, :correo, :password, :foto_url, :rol_id)";
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':nombre' => $data['nombre'],
        ':apellido' => $data['apellido'],
        ':correo' => $data['correo'],
        ':password' => $passwordHash,
        ':foto_url' => $data['foto_url'] ?? null,
        ':rol_id' => $rol
    ]);

    echo json_encode(["success" => true, "id" => $db->lastInsertId()]);
} catch (PDOException $e) {
    if ($e->errorInfo[1] == 1062) {
        http_response_code(409);
        echo json_encode(["success" => false, "error" => "correo ya existe"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
