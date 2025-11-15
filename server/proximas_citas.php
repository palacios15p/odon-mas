<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once './config/db.php';

$db = new Database();
$conn = $db->getConnection();

try {
    $query = "
        SELECT 
            c.id AS cita_id,
            CONCAT(p.nombre, ' ', p.apellido) AS paciente,
            CONCAT(d.nombre, ' ', d.apellido) AS doctor,
            s.nombre AS servicio,
            TIME_FORMAT(c.hora, '%h:%i %p') AS hora
        FROM citas c
        INNER JOIN persona p ON c.paciente_id = p.id
        INNER JOIN persona d ON c.doctor_id = d.id
        INNER JOIN servicios s ON c.servicio_id = s.id
        WHERE DATE(c.fecha) = CURDATE() 
        ORDER BY c.hora ASC
        LIMIT 10
    ";

    $stmt = $conn->prepare($query);
    $stmt->execute();
    $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "data" => $citas]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
