window.onload = function() { //Se ejecuta cuando carga la página

    var canvas = document.getElementById("juego");
    var imgVirus = new Image();


    if (canvas && canvas.getContext) {
        var lienzo = canvas.getContext("2d");
        if (lienzo) { //si el navegador es compatible se ejecuta esto

            var margen = canvas.getBoundingClientRect();
            var score = 0;
            var inicioJuego = new Image();
            inicioJuego.src = "../img/inicioJuego.png";
            var finalJuego = new Image();
            finalJuego.src = "../img/finalJuego.png";

            class Virus {
                constructor(x, y) {
                    this.image = imgVirus;
                    this.x = x;
                    this.y = y;
                }
            }

            var virus1 = new Virus(random(20, 900), random(50, 480));
            var virus2 = new Virus(random(20, 900), random(50, 480));
            var virus3 = new Virus(random(20, 900), random(50, 480));

            function random(min, max) {
                var result;
                result = Math.floor(Math.random() * (max - min + 1)) + 1;

                return result;
            }

            function linea(x1, y1, x2, y2, color) { //funcion que dibuja lineas
                lienzo.strokeStyle = color;
                lienzo.beginPath();
                lienzo.moveTo(x1, y1);
                lienzo.lineTo(x2, y2);
                lienzo.stroke();
                lienzo.closePath();
            }

            function limpiar() {
                lienzo.fillStyle = 'rgb(87,155,204)';
                lienzo.fillRect(10, 10, 980, 480);
            }

            function imprimirScore() {
                lienzo.fillStyle = 'rgb(168,155,91)';
                lienzo.fillRect(10, 10, 235, 40);
                lienzo.font = "20px Verdana";
                lienzo.fillStyle = "white";
                lienzo.fillText("Virus Capturados: " + score, 25, 40);
            }

            function virusRespawn(virus) {
                lienzo.fillStyle = 'rgb(87,155,204)';
                lienzo.fillRect(virus.x, virus.y, 32, 32);

                virus.x = random(20, 900);
                virus.y = random(50, 480);
                lienzo.drawImage(virus.image, virus.x, virus.y);
            }

            function gameOver() {
                limpiar();
                lienzo.drawImage(finalJuego, 10, 10);
                lienzo.font = "bold 45px Verdana";
                lienzo.fillStyle = "white";
                lienzo.fillText(score, 585, 110);
                canvas.removeEventListener("click", atraparVirus);
            }


            function atraparVirus() {
                canvas.addEventListener('click', function(evt) {
                    if (Math.abs((evt.clientX - margen.left) - (virus1.x + 16)) < 20 && Math.abs((evt.clientY - margen.top) - (virus1.y + 16)) < 20) {
                        score++;
                        imprimirScore();
                        virusRespawn(virus1);
                    }
                    if (Math.abs((evt.clientX - margen.left) - (virus2.x + 16)) < 20 && Math.abs((evt.clientY - margen.top) - (virus2.y + 16)) < 20) {
                        score++;
                        imprimirScore();
                        virusRespawn(virus2);
                    }
                    if (Math.abs((evt.clientX - margen.left) - (virus3.x + 16)) < 20 && Math.abs((evt.clientY - margen.top) - (virus3.y + 16)) < 20) {
                        score++;
                        imprimirScore();
                        virusRespawn(virus3);
                    }
                });

                limpiar();
                imprimirScore();
                lienzo.drawImage(virus1.image, virus1.x, virus1.y);
                lienzo.drawImage(virus2.image, virus2.x, virus2.y);
                lienzo.drawImage(virus3.image, virus3.x, virus3.y);
                setTimeout(gameOver, 5000);
            }


            inicioJuego.onload = function() {
                canvas.addEventListener("click", atraparVirus);
                lienzo.drawImage(inicioJuego, 10, 10);
            }
        }
    } else {
        alert("Lo sentimos, tu navegador es incompatible");
    }

}