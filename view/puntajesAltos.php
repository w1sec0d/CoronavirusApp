<?php
require_once '../model/database.php';
if (isset($_REQUEST["nombre"]) && isset($_REQUEST["puntaje"])) {
    $nombre = $_REQUEST["nombre"];
    $puntaje = $_REQUEST["puntaje"];

    $query1 = "INSERT INTO USUARIO(nombre) VALUES ('$nombre')";
    $query2 = "INSERT INTO PUNTAJE(valor,nombreFK) VALUES ($puntaje, '$nombre')";

    $result = mysqli_query($conection, $query1);
    $result2 = mysqli_query($conection, $query2);
    header("Location: puntajesAltos.php?nombre=$nombre");
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&family=Sora:wght@500&display=swap" rel="stylesheet">
    <link rel="shortcut icon" href="../assets/img/virus.ico" type="image/x-icon">
    <link rel="stylesheet" href="../assets/css/style.css">

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.21/css/jquery.dataTables.css">
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.21/js/jquery.dataTables.js"></script>

    <title>Puntajes Altos</title>
</head>

<body>
    <div class="row justify-content-center align-items-center" style="margin: 0; width: 100vw; height: 100vh">
        <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light" style="font-family: 'Sora', sans-serif">
            <a class="navbar-brand" href="../index.php ">
                <img src="../assets/img/virus.png" style="margin-right: 1%" alt="" srcset=""> Tu guía en cuarentena
            </a>
        </nav>
        <h1 class="title">🏆 Puntajes Altos 🏆</h1>
        <div class="table-responsive">
            <table class="table table-striped table-hover table-condensed dt-responsive" id="puntaje" class="display">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Puntaje Más Alto</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $query = "SELECT * FROM PUNTAJES_MAXIMOS ORDER BY PUNTAJEMAXIMO DESC";
                    $result = mysqli_query($conection, $query);

                    while ($mostrar = mysqli_fetch_array($result)) {
                    ?>
                        <tr <?php
                            if (isset($_REQUEST["nombre"])) {
                                if ($_REQUEST["nombre"] == $mostrar["NOMBRE"]) {
                                    echo " style='background: rgba(237, 219, 53,0.6)'";
                                }
                            }
                            ?>>
                            <td><?php echo $mostrar["NOMBRE"] ?></td>
                            <td><?php echo $mostrar["PUNTAJEMAXIMO"] ?></td>
                        </tr>
                    <?php
                    }
                    ?>
                </tbody>
            </table>
        </div>
        <a href="./juego.php" class="fixed-bottom btn btn-primary" style="background: #A3B113; border: none; font-weight: bold">Volver a Menú de juegos 🎮</a>
    </div>
    <footer class="fixed-bottom">

    </footer>

    <script>
        $(document).ready(function() {
            $('#puntaje').DataTable({
                "language": spanishTable,
                "paging": false,
                "order": [1, 'desc']
            });
        });
        var spanishTable = {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Registros del _START_ al _END_ de un total de _TOTAL_ ",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            },
            "buttons": {
                "copy": "Copiar",
                "colvis": "Visibilidad"
            }
        }
    </script>
</body>

</html>