<?php
// src/api/proxima_cita.php
header("Content-Type: application/json");

// Permitir CORS para desarrollo
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

require_once "./controllers/CitaController.php";

// Aquí normalmente obtienes el ID del usuario desde el token o sesión
// Para simplificar, lo tomamos de GET: ?usuario_id=4
$usuario_id = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : 0;

if ($usuario_id <= 0) {
    echo json_encode(["error" => "ID de usuario inválido"]);
    exit;
}

$citaController = new CitaController();
$cita = $citaController->getProximaCita2($usuario_id);

if ($cita) {
    echo json_encode($cita);
} else {
    echo json_encode(["message" => "No hay citas"]);
}
?>
