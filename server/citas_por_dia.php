<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once './config/db.php';
    
$db = new Database();
$conn = $db->getConnection();

try {
    $query = "
        SELECT 
            DAYNAME(fecha) AS dia,
            COUNT(*) AS total
        FROM citas
        WHERE WEEK(fecha) = WEEK(CURDATE())
        GROUP BY dia
        ORDER BY FIELD(dia, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')
    ";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Convertir nombres al español y ordenar
    $diasOrden = [
        "Monday" => "Lun", "Tuesday" => "Mar", "Wednesday" => "Mié",
        "Thursday" => "Jue", "Friday" => "Vie", "Saturday" => "Sáb", "Sunday" => "Dom"
    ];

    $data = [];
    foreach ($diasOrden as $eng => $esp) {
        $count = 0;
        foreach ($rows as $r) {
            if ($r['dia'] === $eng) {
                $count = (int)$r['total'];
                break;
            }
        }
        $data[] = ["name" => $esp, "citas" => $count];
    }

    echo json_encode(["status" => "success", "data" => $data]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
