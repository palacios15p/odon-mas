<?php
require_once __DIR__ . '/../config/db.php';

class Usuario {
    private $conn;
    private $table = "usuarios";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function login($correo, $password) {
        $query = "SELECT u.id, u.nombre, u.apellido, u.correo, u.password, r.nombre AS rol
                  FROM usuarios u
                  INNER JOIN roles r ON u.rol_id = r.id
                  WHERE u.correo = :correo
                  LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":correo", $correo);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && $user['password'] === $password) { // ✅ Simple login
            unset($user['password']); // No enviar la contraseña
            return $user;
        }
        return false;
    }
}
