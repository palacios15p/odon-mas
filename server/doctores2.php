<?php
// Habilitar CORS para todos los orígenes y métodos
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Manejo del preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once "./config/db.php";

$db = (new Database())->getConnection();
$method = $_SERVER["REQUEST_METHOD"];
$data = json_decode(file_get_contents("php://input"), true);

switch($method) {
    case "GET":
        // Leer doctores
        $stmt = $db->prepare("
            SELECT u.id, CONCAT(u.nombre,' ',u.apellido) AS nombre, u.correo, r.nombre AS rol
            FROM usuarios u
            JOIN roles r ON u.rol_id = r.id
            WHERE u.rol_id = 2
            ORDER BY u.nombre
        ");
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case "POST":
        // Crear nuevo doctor
        $stmt = $db->prepare("
            INSERT INTO usuarios (nombre, apellido, correo, password, rol_id) 
            VALUES (:nombre, :apellido, :correo, :password, 2)
        ");
        $stmt->execute([
            ":nombre" => $data["nombre"],
            ":apellido" => $data["apellido"],
            ":correo" => $data["correo"],
            ":password" => $data["password"]
        ]);
        echo json_encode(["message" => "Doctor creado"]);
        break;

    case "PUT":
        // Actualizar doctor
        $stmt = $db->prepare("
            UPDATE usuarios SET nombre=:nombre, apellido=:apellido, correo=:correo
            WHERE id=:id AND rol_id=2
        ");
        $stmt->execute([
            ":nombre" => $data["nombre"],
            ":apellido" => $data["apellido"],
            ":correo" => $data["correo"],
            ":id" => $data["id"]
        ]);
        echo json_encode(["message" => "Doctor actualizado"]);
        break;

    case "DELETE":
        // Eliminar doctor
        $stmt = $db->prepare("DELETE FROM usuarios WHERE id=:id AND rol_id=2");
        $stmt->execute([":id" => $_GET["id"]]);
        echo json_encode(["message" => "Doctor eliminado"]);
        break;

    default:
        echo json_encode(["message" => "Método no permitido"]);
        break;
}
