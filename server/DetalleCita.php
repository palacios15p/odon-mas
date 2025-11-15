<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

include_once './config/db.php';

$database = new Database();
$db = $database->getConnection();

$cita_id = $_GET['cita_id'] ?? null;
if (!$cita_id) {
  echo json_encode(["success" => false, "message" => "ID de cita no recibido"]);
  exit;
}

$query = "
SELECT c.id AS cita_id, c.fecha, c.hora, c.estado,
       s.nombre AS servicio, s.descripcion AS descripcion_servicio,
       CONCAT(d.nombre, ' ', d.apellido) AS doctor,
       d.foto_url AS doctor_avatar
FROM citas c
JOIN servicios s ON c.servicio_id = s.id
JOIN usuarios d ON c.doctor_id = d.id
WHERE c.id = :id
";
$stmt = $db->prepare($query);
$stmt->bindParam(":id", $cita_id);
$stmt->execute();
$cita = $stmt->fetch(PDO::FETCH_ASSOC);

if ($cita) {
  echo json_encode(["success" => true, "cita" => $cita]);
} else {
  echo json_encode(["success" => false, "message" => "No se encontró la cita"]);
}
?>
