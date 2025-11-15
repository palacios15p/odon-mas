<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once "./config/db.php";

$db = (new Database())->getConnection();
$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    // Consulta: listar pacientes con su última cita
    $query = "
        SELECT 
            u.id,
            CONCAT(u.nombre, ' ', u.apellido) AS nombre,
            u.correo,
            (SELECT fecha FROM citas WHERE paciente_id = u.id ORDER BY fecha DESC LIMIT 1) AS fecha
        FROM usuarios u
        WHERE u.rol_id = 3
        ORDER BY u.nombre ASC
    ";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $pacientes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($pacientes);
    exit;
}

echo json_encode(["message" => "Método no permitido"]);
