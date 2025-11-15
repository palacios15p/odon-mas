<?php
// appointments.php - endpoints minimalistas para gestionar citas
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "./config/db.php";

$action = $_GET['action'] ?? '';

try {
    switch ($action) {

        // LISTAR CITAS (opcional: ?fecha=YYYY-MM-DD, ?doctor_id=ID)
        case 'list':
            $fecha = $_GET['fecha'] ?? null;
            $doctor_id = $_GET['doctor_id'] ?? null;

            $sql = "
                SELECT c.id, c.paciente_id, p.nombre AS paciente_nombre, p.apellido AS paciente_apellido,
                       c.doctor_id, d.nombre AS doctor_nombre, d.apellido AS doctor_apellido,
                       c.servicio_id, s.nombre AS servicio, c.fecha, TIME_FORMAT(c.hora, '%H:%i') AS hora, c.estado
                FROM citas c
                JOIN usuarios p ON c.paciente_id = p.id
                JOIN usuarios d ON c.doctor_id = d.id
                JOIN servicios s ON c.servicio_id = s.id
            ";

            $conds = [];
            $params = [];

            if ($fecha) {
                $conds[] = "c.fecha = :fecha";
                $params[':fecha'] = $fecha;
            }
            if ($doctor_id) {
                $conds[] = "c.doctor_id = :doctor_id";
                $params[':doctor_id'] = $doctor_id;
            }
            if (count($conds) > 0) {
                $sql .= " WHERE " . implode(" AND ", $conds);
            }

            $sql .= " ORDER BY c.fecha ASC, c.hora ASC";

            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(["success" => true, "citas" => $citas]);
            break;

        // CREAR CITA (POST) - body JSON: paciente_id, doctor_id, servicio_id, fecha(YYYY-MM-DD), hora(HH:MM)
        case 'create':
            $data = json_decode(file_get_contents("php://input"), true);
            $p = $data ?? [];

            if (empty($p['paciente_id']) || empty($p['doctor_id']) || empty($p['servicio_id']) || empty($p['fecha']) || empty($p['hora'])) {
                echo json_encode(["success" => false, "error" => "Datos incompletos"]);
                exit;
            }

            $stmt = $conn->prepare("INSERT INTO citas (paciente_id, doctor_id, servicio_id, fecha, hora, estado) VALUES (:paciente_id, :doctor_id, :servicio_id, :fecha, :hora, 'Programada')");
            $stmt->execute([
                ':paciente_id' => $p['paciente_id'],
                ':doctor_id' => $p['doctor_id'],
                ':servicio_id' => $p['servicio_id'],
                ':fecha' => $p['fecha'],
                ':hora' => $p['hora'] . ":00" // asegurar formato TIME
            ]);
            $id = $conn->lastInsertId();
            echo json_encode(["success" => true, "id" => $id, "message" => "Cita creada"]);
            break;

        // ACTUALIZAR ESTADO (POST) - body JSON: id, estado (Programada|Completada|Cancelada)
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

        // ACTUALIZAR HORA (POST) - body JSON: id, hora (HH:MM)
        case 'update_time':
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'] ?? null;
            $hora = $data['hora'] ?? null;

            if (!$id || !$hora) {
                echo json_encode(["success" => false, "error" => "Faltan parámetros"]);
                exit;
            }

            $stmt = $conn->prepare("UPDATE citas SET hora = :hora WHERE id = :id");
            $stmt->execute([':hora' => $hora . ":00", ':id' => $id]);
            echo json_encode(["success" => true, "message" => "Hora actualizada"]);
            break;

        // ELIMINAR CITA (GET o POST) -> ?action=delete&id=NN
        case 'delete':
            $id = $_GET['id'] ?? null;
            if (!$id) {
                echo json_encode(["success" => false, "error" => "Falta id"]);
                exit;
            }
            $stmt = $conn->prepare("DELETE FROM citas WHERE id = :id");
            $stmt->execute([':id' => $id]);
            echo json_encode(["success" => true, "message" => "Cita eliminada"]);
            break;

        default:
            echo json_encode(["success" => false, "error" => "Acción no válida"]);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
