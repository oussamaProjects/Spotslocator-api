<?php

class rest
{

     
    private $servername = "servername";
    private $username = "username";
    private $password = "password";
    private $dbname = "dbname";

    private $conn;

    public function __construct()
    {

        try {
            $this->conn = new PDO("mysql:host=$this->servername;dbname=$this->dbname", $this->username, $this->password, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
            // set the PDO error mode to exception
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // echo "Connected successfully";
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }

    public function getRecords()
    {

        $sqlQuery = '';

        $sql = "
			SELECT b.id as id_adresse, c.genre, c.nom as nom_ref, c.prenom as prenom_ref, c.telephone as tel_ref, c.email as email_ref, b.denomination, b.adresse1 as adresse, b.cp as cp, b.ville as ville, b.telephone as tel_center,
            b.email as email_center, b.http as website_center, b.description_adresse as description_adresse, b.longitude as longitude, b.latitude as latitude, a.code_centre as code_centre, a.fin_habil
            FROM of_centre a
            INNER JOIN of_adresse b ON a.id=b.idOfCentre_id
            INNER JOIN userPro c ON a.idReferent=c.id
            WHERE a.date_fin_contrat IS NULL
            AND b.adresse_visible_map=1"
            // AND a.fin_habil >= now()
            ;

        $stmt = $this->conn->query($sql);

        $stmt->execute();
        $result = $stmt;

        $itemRecords = [];
        while ($item = $result->fetch(PDO::FETCH_ASSOC)) {
            extract($item);

            $gallery_data = glob('/home/monpciepro/web/img/privee/' . $code_centre . '/adresse_' . $id_adresse . '/medium/*.jpg');
            $logo_data = glob('/home/monpciepro/web/img/privee/' . $code_centre . '/logo/grand/*.jpg');

            $logo = "";
            $gallery = [];

            $logo = str_replace('/home/monpciepro/web', 'https://www.monpciepro.fr', $logo_data);
            foreach ($gallery_data as $key => $gallery_item) {
                $gallery[] = str_replace('/home/monpciepro/web', 'https://www.monpciepro.fr', $gallery_item);
            }

            $itemRecords[$code_centre] = array(
                "logo" => $logo,
                "ref" => array(
                    "nom_ref" => $nom_ref,
                    "email_ref" => $email_ref,
                    "tel_ref" => $tel_ref,
                ),
                "center" => array(
                    "nom_center" => $denomination,
                    "email_center" => $email_center,
                    "tel_center" => $tel_center,
                    "website_center" => $website_center,
                ),
                "address" => array(
                    'adr' => $adresse,
                    'cit' => $ville,
                    'cp' => $cp,
                ),
                "position" => array(
                    "latitude" => $latitude,
                    "longitude" => $longitude,
                ),
                "description" => $description_adresse,
                "gallery_data" => $gallery,
            );

        }

        http_response_code(200);
        echo json_encode($itemRecords);

    }

}
