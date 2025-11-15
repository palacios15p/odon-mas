<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once './config/db.php';

$db = new Database();
$conn = $db->getConnection();

try {
    $query = "
        SELECT estado, COUNT(*) AS total
        FROM citas
        GROUP BY estado
    ";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [];
    foreach ($result as $row) {
        $data[] = [
            "name" => $row['estado'],
            "value" => (int)$row['total']
        ];
    }

    echo json_encode(["status" => "success", "data" => $data]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
