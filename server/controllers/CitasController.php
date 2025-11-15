<?php
require_once "./config/db.php";

class CitasController {
    private $conn;

    public function __construct() {
        $db = new Database();
        $this->conn = $db->getConnection();
    }

    // Listar especialistas (doctores)
    public function listarEspecialistas() {
        $stmt = $this->conn->prepare("SELECT id, nombre, apellido, CONCAT_WS(' ', nombre, apellido) as especialidad FROM usuarios WHERE rol_id = 2");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Listar horas disponibles para un doctor en una fecha
    public function listarHorasDisponibles($doctorId, $fecha) {
        $allHoras = [
            "09:00","09:30","10:00","10:30","11:00","11:30",
            "14:00","14:30","15:00","15:30","16:00"
        ];
        // Obtener horas ocupadas
        $stmt = $this->conn->prepare("SELECT hora FROM citas WHERE doctor_id = :doctor AND fecha = :fecha");
        $stmt->bindParam(":doctor", $doctorId);
        $stmt->bindParam(":fecha", $fecha);
        $stmt->execute();
        $ocupadas = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $disponibles = [];
        foreach($allHoras as $hora) {
            $disponibles[] = [
                "hora" => date("h:i A", strtotime($hora)),
                "value" => $hora,
                "disponible" => !in_array($hora, $ocupadas)
            ];
        }
        return $disponibles;
    }

    // Crear una nueva cita
    public function crearCita($pacienteId, $doctorId, $fecha, $hora, $nota = null) {
        $stmt = $this->conn->prepare("
            INSERT INTO citas (paciente_id, doctor_id, servicio_id, fecha, hora, estado)
            VALUES (:paciente, :doctor, 1, :fecha, :hora, 'Programada')
        ");
        $stmt->bindParam(":paciente", $pacienteId);
        $stmt->bindParam(":doctor", $doctorId);
        $stmt->bindParam(":fecha", $fecha);
        $stmt->bindParam(":hora", $hora);
        $stmt->execute();

        $citaId = $this->conn->lastInsertId();

        return [
            "id" => $citaId,
            "paciente_id" => $pacienteId,
            "doctor_id" => $doctorId,
            "fecha" => $fecha,
            "hora" => $hora,
            "nota" => $nota
        ];
    }
}
