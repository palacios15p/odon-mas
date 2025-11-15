<?php
// src/controllers/CitaController.php
require_once "./config/db.php";

class CitaController
{
    private $conn;

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    // Obtener la próxima cita de un paciente por su ID
    public function getProximaCita($usuario_id)
    {
        $sql = "
            SELECT c.id AS cita_id, c.fecha, c.hora, c.estado,
                   s.nombre AS servicio, s.descripcion AS descripcion_servicio,
                   d.nombre AS doctor_nombre, d.apellido AS doctor_apellido, d.foto_url AS doctor_avatar
            FROM citas c
            INNER JOIN usuarios d ON c.doctor_id = d.id
            INNER JOIN servicios s ON c.servicio_id = s.id
            WHERE c.paciente_id = :usuario_id AND c.estado = 'Programada' AND c.fecha >= CURDATE()
            ORDER BY c.fecha ASC, c.hora ASC
            LIMIT 1
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":usuario_id", $usuario_id, PDO::PARAM_INT);
        $stmt->execute();

        $cita = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cita) {
            $cita["fechaHora"] = $cita["fecha"] . "T" . $cita["hora"];
            $cita["doctor"] = "Dr. " . $cita["doctor_nombre"] . " " . $cita["doctor_apellido"];
        }

        return $cita;
    }
    // Obtener la próxima cita de un paciente por su ID
    public function getProximaCita2($usuario_id)
    {
        $sql = "
        SELECT c.id AS cita_id, c.fecha, c.hora, c.estado,
               s.nombre AS servicio, s.descripcion AS descripcion_servicio,
               d.nombre AS doctor_nombre, d.apellido AS doctor_apellido, d.foto_url AS doctor_avatar
        FROM citas c
        INNER JOIN usuarios d ON c.doctor_id = d.id
        INNER JOIN servicios s ON c.servicio_id = s.id
        WHERE c.paciente_id = :usuario_id 
          AND c.estado = 'Programada' 
          AND c.fecha >= CURDATE()
        ORDER BY c.fecha ASC, c.hora ASC
    ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(":usuario_id", $usuario_id, PDO::PARAM_INT);
        $stmt->execute();

        $citas = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Añadir campos calculados a cada cita
        foreach ($citas as &$cita) {
            $cita["fechaHora"] = $cita["fecha"] . "T" . $cita["hora"];
            $cita["doctor"] = "Dr. " . $cita["doctor_nombre"] . " " . $cita["doctor_apellido"];
        }

        return $citas;
    }
}
