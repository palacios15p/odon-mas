<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once './config/db.php';

$db = new Database();
$conn = $db->getConnection();

$response = [];

try {
    // Total de citas del día
    $stmt = $conn->prepare("SELECT COUNT(*) AS total FROM citas WHERE fecha = CURDATE()");
    $stmt->execute();
    $response['citas_hoy'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Ingresos del mes
    $stmt = $conn->prepare("
        SELECT COALESCE(SUM(s.precio), 0) AS ingresos 
        FROM citas c
        INNER JOIN servicios s ON c.servicio_id = s.id
        WHERE MONTH(c.fecha) = MONTH(CURDATE())
    ");
    $stmt->execute();
    $response['ingresos_mes'] = $stmt->fetch(PDO::FETCH_ASSOC)['ingresos'];

    // Pacientes nuevos del mes
    $stmt = $conn->prepare("
        SELECT COUNT(*) AS total 
        FROM usuarios 
        WHERE rol_id = 3 AND MONTH(created_at) = MONTH(CURDATE())
    ");
    $stmt->execute();
    $response['pacientes_nuevos'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Tasa de confirmación
    $stmt = $conn->prepare("
        SELECT 
            (SUM(CASE WHEN estado = 'Completada' THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS tasa 
        FROM citas
        WHERE MONTH(fecha) = MONTH(CURDATE())
    ");
    $stmt->execute();
    $response['tasa_confirmacion'] = round($stmt->fetch(PDO::FETCH_ASSOC)['tasa'] ?? 0, 2);

    echo json_encode([
        "status" => "success",
        "data" => $response
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
