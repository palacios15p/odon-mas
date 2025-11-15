<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once './config/db.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->cita_id)) {
  echo json_encode(["success" => false, "message" => "Falta el ID de la cita"]);
  exit;
}

$query = "UPDATE citas SET estado='Cancelada' WHERE id = :id";
$stmt = $db->prepare($query);
$stmt->bindParam(":id", $data->cita_id);

if ($stmt->execute()) {
  echo json_encode(["success" => true, "message" => "Cita cancelada exitosamente"]);
} else {
  echo json_encode(["success" => false, "message" => "Error al cancelar la cita"]);
}
?>
