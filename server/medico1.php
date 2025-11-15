<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once './config/db.php';
$db = new Database();
$conn = $db->getConnection();
// Obtener acción de la URL (por ejemplo: backend.php?action=obtener_citas)
$action = $_GET['action'] ?? '';

switch ($action) {

    // ===============================
    // LOGIN DE USUARIO
    // ===============================
    case 'login':
        $data = json_decode(file_get_contents("php://input"), true);
        $correo = $data['correo'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($correo) || empty($password)) {
            echo json_encode(["error" => "Faltan datos"]);
            exit;
        }

        $query = $conn->prepare("SELECT * FROM usuarios WHERE correo = :correo");
        $query->bindParam(":correo", $correo);
        $query->execute();
        $user = $query->fetch(PDO::FETCH_ASSOC);

        if ($user && $user['password'] === $password) {
            // Simula un token sencillo
            $token = bin2hex(random_bytes(16));
            $insert = $conn->prepare("INSERT INTO sesiones (usuario_id, token) VALUES (:id, :token)");
            $insert->bindParam(":id", $user['id']);
            $insert->bindParam(":token", $token);
            $insert->execute();

            unset($user['password']); // No devolver contraseña
            echo json_encode(["success" => true, "token" => $token, "user" => $user]);
        } else {
            echo json_encode(["error" => "Credenciales incorrectas"]);
        }
        break;

    // ===============================
    // OBTENER CITAS (por día o semana)
    // ===============================
    case 'obtener_citas':
        $vista = $_GET['vista'] ?? 'day'; // day | week

        if ($vista === 'week') {
            $query = $conn->query("
                SELECT c.id, u1.nombre AS paciente, u2.nombre AS doctor, s.nombre AS servicio, c.fecha, c.hora, c.estado
                FROM citas c
                JOIN usuarios u1 ON c.paciente_id = u1.id
                JOIN usuarios u2 ON c.doctor_id = u2.id
                JOIN servicios s ON c.servicio_id = s.id
                WHERE YEARWEEK(c.fecha, 1) = YEARWEEK(CURDATE(), 1)
                ORDER BY c.fecha, c.hora
            ");
        } else {
            $query = $conn->query("
                SELECT c.id, u1.nombre AS paciente, u2.nombre AS doctor, s.nombre AS servicio, c.fecha, c.hora, c.estado
                FROM citas c
                JOIN usuarios u1 ON c.paciente_id = u1.id
                JOIN usuarios u2 ON c.doctor_id = u2.id
                JOIN servicios s ON c.servicio_id = s.id
                WHERE c.fecha = CURDATE()
                ORDER BY c.hora
            ");
        }

        $citas = $query->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($citas);
        break;

    // ===============================
    // LOGOUT (desactivar token)
    // ===============================
    case 'logout':
        $data = json_decode(file_get_contents("php://input"), true);
        $token = $data['token'] ?? '';

        if (!$token) {
            echo json_encode(["error" => "Token no proporcionado"]);
            exit;
        }

        $update = $conn->prepare("UPDATE sesiones SET activa = 0, fecha_fin = NOW() WHERE token = :token");
        $update->bindParam(":token", $token);
        $update->execute();

        echo json_encode(["success" => true, "message" => "Sesión cerrada"]);
        break;

    // ===============================
    // CASO POR DEFECTO
    // ===============================
    default:
        echo json_encode(["error" => "Acción no válida"]);
        break;
}
?>
