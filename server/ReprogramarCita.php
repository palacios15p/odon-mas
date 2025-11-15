<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

include_once './config/db.php';
$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->cita_id) || !isset($data->nueva_fecha) || !isset($data->nueva_hora)) {
  echo json_encode(["success" => false, "message" => "Datos incompletos"]);
  exit;
}

$query = "UPDATE citas SET fecha = :fecha, hora = :hora, estado='Programada' WHERE id = :id";
$stmt = $db->prepare($query);
$stmt->bindParam(":fecha", $data->nueva_fecha);
$stmt->bindParam(":hora", $data->nueva_hora);
$stmt->bindParam(":id", $data->cita_id);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Cita reprogramada correctamente"]);
} else {
  echo json_encode(["success" => false, "message" => "Error al reprogramar la cita"]);
}
?>
