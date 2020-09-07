window.onload = function() { //Se ejecuta cuando carga la página

    var canvas = document.getElementById("juego");


    if (canvas && canvas.getContext) {
        var lienzo = canvas.getContext("2d");
        if (lienzo) { //si el navegador es compatible se ejecuta esto
            var tick = new Audio('../audio/tick.mp3');
            var musica = new Audio("../audio/MusicaVideojuego.m4a");
            var margen = canvas.getBoundingClientRect();
            var inicioMemoria = new Image();
            inicioMemoria.src = "../img/inicioMemoria.png"

            function random(min, max) {
                var result;
                result = Math.floor(Math.random() * (max - min + 1)) + 1;

                return result;
            }

            function limpiar() {
                lienzo.fillStyle = 'white';
                lienzo.fillRect(0, 0, 1000, 500);
                lienzo.fillStyle = 'rgb(87,155,204)';
                lienzo.fillRect(10, 10, 980, 480);
            }

            function jugar() {
                canvas.removeEventListener("click", jugar);
                limpiar();
            }

            inicioMemoria.onload = function() {
                lienzo.drawImage(inicioMemoria, 10, 10);
            }

            canvas.addEventListener("click", jugar);

        }
    } else {
        alert("Lo sentimos, tu navegador es incompatible");
    }

}