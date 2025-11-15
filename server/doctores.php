<?php
// api/doctores.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . './db.php';
$db = new Database();
$conn = $db->getConnection();

// Leer acción desde query param
$action = isset($_GET['action']) ? $_GET['action'] : 'list';

// Helper para leer JSON body
function getJsonBody() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        // también permitir form-data/post tradicionales
        $data = $_POST;
    }
    return $data;
}

try {
    if ($action === 'list') {
        // Listar doctores: pretendemos que los doctores son usuarios con rol Doctor (roles.nombre = 'Doctor')
        $sql = "SELECT u.id, CONCAT(u.nombre, ' ', u.apellido) AS nombre, u.correo, IFNULL(u.foto_url, '') AS foto_url, 'Doctor' AS especialidad
                FROM usuarios u
                JOIN roles r ON u.rol_id = r.id
                WHERE r.nombre = 'Doctor'
                ORDER BY u.nombre ASC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["ok" => true, "data" => $rows]);
        exit;
    }

    if ($action === 'get' && isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $sql = "SELECT id, nombre, apellido, correo, foto_url FROM usuarios WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(["ok" => true, "data" => $row]);
        exit;
    }

    if ($action === 'create') {
        $data = getJsonBody();
        // mínimos: nombre (puede incluir apellido juntos), especialidad y correo (opcional)
        $nombreCompleto = isset($data['nombre']) ? trim($data['nombre']) : '';
        $especialidad = isset($data['especialidad']) ? trim($data['especialidad']) : '';
        $correo = isset($data['correo']) ? trim($data['correo']) : null;

        if ($nombreCompleto === '' || $especialidad === '') {
            http_response_code(400);
            echo json_encode(["ok" => false, "message" => "nombre y especialidad requeridos"]);
            exit;
        }

        // Dividir nombre y apellido de forma simple (si viene nombre completo)
        $partes = explode(' ', $nombreCompleto);
        $nombre = array_shift($partes);
        $apellido = count($partes) ? implode(' ', $partes) : '-';

        // rol doctor -> buscar id
        $r = $conn->prepare("SELECT id FROM roles WHERE nombre = 'Doctor' LIMIT 1");
        $r->execute();
        $rol = $r->fetch(PDO::FETCH_ASSOC);
        $rol_id = $rol ? (int)$rol['id'] : 2;

        // password por defecto (cambiar en producción)
        $password_plain = 'doctor123';
        $password_hash = password_hash($password_plain, PASSWORD_DEFAULT);

        $sql = "INSERT INTO usuarios (nombre, apellido, correo, password, rol_id) VALUES (:nombre, :apellido, :correo, :password, :rol)";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':nombre', $nombre);
        $stmt->bindValue(':apellido', $apellido);
        $stmt->bindValue(':correo', $correo);
        $stmt->bindValue(':password', $password_hash);
        $stmt->bindValue(':rol', $rol_id, PDO::PARAM_INT);
        $stmt->execute();

        $newId = $conn->lastInsertId();
        echo json_encode(["ok" => true, "id" => (int)$newId]);
        exit;
    }

    if ($action === 'update') {
        $data = getJsonBody();
        $id = isset($data['id']) ? (int)$data['id'] : 0;
        $nombreCompleto = isset($data['nombre']) ? trim($data['nombre']) : '';
        $especialidad = isset($data['especialidad']) ? trim($data['especialidad']) : '';
        $correo = isset($data['correo']) ? trim($data['correo']) : null;

        if (!$id || $nombreCompleto === '') {
            http_response_code(400);
            echo json_encode(["ok" => false, "message" => "id y nombre requeridos"]);
            exit;
        }

        // split
        $partes = explode(' ', $nombreCompleto);
        $nombre = array_shift($partes);
        $apellido = count($partes) ? implode(' ', $partes) : '-';

        $sql = "UPDATE usuarios SET nombre = :nombre, apellido = :apellido, correo = :correo WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':nombre', $nombre);
        $stmt->bindValue(':apellido', $apellido);
        $stmt->bindValue(':correo', $correo);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        echo json_encode(["ok" => true]);
        exit;
    }

    if ($action === 'delete') {
        $data = getJsonBody();
        $id = isset($data['id']) ? (int)$data['id'] : 0;
        if (!$id) {
            http_response_code(400);
            echo json_encode(["ok" => false, "message" => "id requerido"]);
            exit;
        }
        $sql = "DELETE FROM usuarios WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        echo json_encode(["ok" => true]);
        exit;
    }

    // default: acción no encontrada
    http_response_code(400);
    echo json_encode(["ok" => false, "message" => "action no válida"]);

} catch (Exception $ex) {
    http_response_code(500);
    echo json_encode(["ok" => false, "message" => "server error"]);
    exit;
}
