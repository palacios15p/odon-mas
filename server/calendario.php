<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once './config/db.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    // =======================================================
    // 🔹 1. OBTENER TODAS LAS CITAS
    // =======================================================
    case 'GET':
        $stmt = $db->prepare("
            SELECT 
                c.id AS cita_id,
                c.fecha,
                c.hora,
                c.estado,
                s.nombre AS servicio,
                s.descripcion AS descripcion_servicio,
                d.nombre AS doctor_nombre,
                d.apellido AS doctor_apellido,
                p.nombre AS paciente_nombre,
                p.apellido AS paciente_apellido
            FROM citas c
            JOIN usuarios d ON c.doctor_id = d.id
            JOIN usuarios p ON c.paciente_id = p.id
            JOIN servicios s ON c.servicio_id = s.id
            ORDER BY c.fecha, c.hora
        ");
        $stmt->execute();
        $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "data" => $citas]);
        break;

    // =======================================================
    // 🔹 2. AGENDAR UNA NUEVA CITA
    // =======================================================
    case 'POST':
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input['paciente_id'], $input['doctor_id'], $input['servicio_id'], $input['fecha'], $input['hora'])) {
            echo json_encode(["success" => false, "message" => "Datos incompletos."]);
            exit;
        }

        // Evitar duplicados (mismo doctor, misma fecha y hora)
        $check = $db->prepare("SELECT id FROM citas WHERE doctor_id = ? AND fecha = ? AND hora = ?");
        $check->execute([$input['doctor_id'], $input['fecha'], $input['hora']]);
        if ($check->rowCount() > 0) {
            echo json_encode(["success" => false, "message" => "El doctor ya tiene una cita programada en esa hora."]);
            exit;
        }

        $stmt = $db->prepare("
            INSERT INTO citas (paciente_id, doctor_id, servicio_id, fecha, hora, estado)
            VALUES (:paciente_id, :doctor_id, :servicio_id, :fecha, :hora, 'Programada')
        ");
        $success = $stmt->execute([
            ':paciente_id' => $input['paciente_id'],
            ':doctor_id' => $input['doctor_id'],
            ':servicio_id' => $input['servicio_id'],
            ':fecha' => $input['fecha'],
            ':hora' => $input['hora']
        ]);

        if ($success) {
            echo json_encode(["success" => true, "message" => "Cita agendada correctamente."]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al agendar la cita."]);
        }
        break;

    // =======================================================
    // 🔹 3. ELIMINAR / CANCELAR UNA CITA
    // =======================================================
    case 'DELETE':
        parse_str(file_get_contents("php://input"), $_DELETE);
        $id = $_DELETE['id'] ?? null;
        if (!$id) {
            echo json_encode(["success" => false, "message" => "ID de cita no proporcionado."]);
            exit;
        }

        $stmt = $db->prepare("DELETE FROM citas WHERE id = ?");
        $success = $stmt->execute([$id]);

        echo json_encode(["success" => $success, "message" => $success ? "Cita eliminada correctamente." : "Error al eliminar la cita."]);
        break;

    default:
        echo json_encode(["success" => false, "message" => "Método no permitido."]);
        break;
}
?>
