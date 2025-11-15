<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once './config/db.php';
$db = (new Database())->getConnection();

try {
    $query = "
        SELECT 
            c.id,
            DATE_FORMAT(c.hora, '%h:%i %p') AS hora,
            CONCAT(p.nombre, ' ', p.apellido) AS nombre,
            s.nombre AS tipo,
            c.estado
        FROM citas c
        JOIN usuarios p ON c.paciente_id = p.id
        JOIN servicios s ON c.servicio_id = s.id
        WHERE c.fecha = CURDATE()
        ORDER BY c.hora ASC
    ";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($citas);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
