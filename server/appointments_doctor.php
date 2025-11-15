<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once './config/db.php';
$db = new Database();
$conn = $db->getConnection();

$action = $_GET['action'] ?? '';

try {
    switch ($action) {

        // LISTAR CITAS DEL DOCTOR (opcional: ?fecha=YYYY-MM-DD)
        case 'list':
            $doctor_id = $_GET['doctor_id'] ?? null;
            $fecha = $_GET['fecha'] ?? null;

            if (!$doctor_id) {
                echo json_encode(["success" => false, "error" => "Falta doctor_id"]);
                exit;
            }

            $sql = "
                SELECT c.id, c.fecha, TIME_FORMAT(c.hora, '%H:%i') AS hora,
                       c.estado,
                       p.nombre AS paciente_nombre, p.apellido AS paciente_apellido,
                       s.nombre AS servicio
                FROM citas c
                JOIN usuarios p ON c.paciente_id = p.id
                JOIN servicios s ON c.servicio_id = s.id
                WHERE c.doctor_id = :doctor_id
            ";

            $params = [':doctor_id' => $doctor_id];

            if ($fecha) {
                $sql .= " AND c.fecha = :fecha";
                $params[':fecha'] = $fecha;
            }

            $sql .= " ORDER BY c.fecha ASC, c.hora ASC";

            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(["success" => true, "citas" => $citas]);
            break;

        // ACTUALIZAR ESTADO DE CITA
        case 'update_status':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? null;
            $estado = $data['estado'] ?? null;

            if (!$id || !$estado) {
                echo json_encode(["success" => false, "error" => "Faltan parámetros"]);
                exit;
            }

            $stmt = $conn->prepare("UPDATE citas SET estado = :estado WHERE id = :id");
            $stmt->execute([':estado' => $estado, ':id' => $id]);

            echo json_encode(["success" => true, "message" => "Estado actualizado"]);
            break;

        default:
            echo json_encode(["success" => false, "error" => "Acción no válida"]);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
