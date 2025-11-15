<?php
require_once __DIR__ . '/../models/Usuario.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Faltan credenciales"]);
    exit;
}

$usuario = new Usuario();
$user = $usuario->login($data->email, $data->password);

if ($user) {
    echo json_encode([
        "token" => uniqid("session_", true), // Token ficticio solo para React localStorage
        "user" => [
            "id" => $user['id'],
            "nombre" => $user['nombre'],
            "apellido" => $user['apellido'],
            "correo" => $user['correo'],
            "rol" => ["nombre" => $user['rol']]
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["message" => "Credenciales inválidas"]);
}
