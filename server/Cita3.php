<?php
require_once "./controllers/CitasController.php";

// Cabeceras CORS completas
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Manejar preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$controller = new CitasController();
$method = $_SERVER['REQUEST_METHOD'];

if($method === "GET" && isset($_GET['accion'])) {
    if($_GET['accion'] === "especialistas") {
        echo json_encode($controller->listarEspecialistas());
    } elseif($_GET['accion'] === "horas" && isset($_GET['doctor']) && isset($_GET['fecha'])) {
        echo json_encode($controller->listarHorasDisponibles($_GET['doctor'], $_GET['fecha']));
    } else {
        echo json_encode(["error" => "Parámetros inválidos"]);
    }
} elseif($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    if(isset($data['pacienteId'], $data['doctorId'], $data['fecha'], $data['hora'])) {
        $cita = $controller->crearCita(
            $data['pacienteId'],
            $data['doctorId'],
            $data['fecha'],
            $data['hora'],
            $data['nota'] ?? null
        );
        echo json_encode(["success" => true, "cita" => $cita]);
    } else {
        echo json_encode(["error" => "Datos incompletos"]);
    }
} else {
    echo json_encode(["error" => "Método no soportado"]);
}
