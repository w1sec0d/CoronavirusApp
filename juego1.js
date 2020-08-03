window.onload = function() { //Se ejecuta cuando carga la página

    var canvas = document.getElementById("juego");

    if (canvas && canvas.getContext) {
        var lienzo = canvas.getContext("2d");
        if (lienzo) { //si el navegador es compatible se ejecuta esto

            function linea(x1, y1, x2, y2, color) { //funcion que dibuja lineas
                lienzo.strokeStyle = color;
                lienzo.beginPath();
                lienzo.moveTo(x1, y1);
                lienzo.lineTo(x2, y2);
                lienzo.stroke();
                lienzo.closePath();
            }

            lienzo.fillStyle = 'rgba(44,167,189,0.4)';
            lienzo.fillRect(10, 10, 980, 480);

            var inicioJuego = new Image();
        }
    } else {
        alert("Lo sentimos, tu navegador es incompatible");
    }

}