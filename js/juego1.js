window.onload = function() { //Se ejecuta cuando carga la página

    var canvas = document.getElementById("juego");

    if (canvas && canvas.getContext) {
        var lienzo = canvas.getContext("2d");
        if (lienzo) { //si el navegador es compatible se ejecuta esto

            var menuJuego = new Image(); //Carga imagenes y audios necesarios para el juego
            menuJuego.src = "../img/menuJuego.png"
            var inicioJuego = new Image();
            inicioJuego.src = "../img/inicioJuego.png";
            var finalJuego = new Image();
            finalJuego.src = "../img/finalJuego.png";
            var imgVirus = new Image();
            imgVirus.src = "../img/virus.png";

            var tick = new Audio('../audio/tick.mp3');
            var win = new Audio('../audio/win.wav');

            var margen = canvas.getBoundingClientRect(); //Obtiene la margen que rodea el canvas
            var mouse; //En ella se almacenarán las posiciones de los clicks

            var reproduciendoMusica = false; //Ayuda a describir el estado actual del juego
            var contando = false;
            var score = 0;

            class Virus {
                constructor(x, y) {
                    this.image = imgVirus;
                    this.x = x;
                    this.y = y;
                }
            }

            function random(min, max) { //Devuelve un valor al azar, dentro de min y max
                return Math.floor(Math.random() * (max - min)) + min;
            }

            var virus1 = new Virus(random(40, 900), random(90, 400));
            var virus2 = new Virus(random(40, 900), random(90, 400));
            var virus3 = new Virus(random(40, 900), random(90, 400));

            function limpiar() { //Deja limpio el canvas, con su fondo por defecto
                lienzo.fillStyle = 'white';
                lienzo.fillRect(0, 0, 1000, 500);
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

            function virusRespawn(virus) { //Borra un virus y lo redibuja en una posicion al azar
                lienzo.fillStyle = 'rgb(87,155,204)';
                lienzo.fillRect(virus.x, virus.y, 32, 32);

                virus.x = random(40, 900);
                virus.y = random(90, 400);
                lienzo.drawImage(virus.image, virus.x, virus.y);
            }

            function imprimirVirus() {
                lienzo.drawImage(virus1.image, virus1.x, virus1.y);
                lienzo.drawImage(virus2.image, virus2.x, virus2.y);
                lienzo.drawImage(virus3.image, virus3.x, virus3.y);
            }

            menuJuego.onload = function() { //Al cargar la imagen del menu, se dibuja y se añade un click listener
                cargarMenu();
            }

            function cargarMenu() {
                lienzo.drawImage(menuJuego, 10, 10);
                canvas.addEventListener("click", menuListener);
            }

            function menuListener(event) { //Escucha en el menú para saber que desea jugar el usuario
                mouse = {
                    x: event.clientX - margen.left,
                    y: event.clientY - margen.top
                }
                if (Math.abs((mouse.x) - 435) < 70 && Math.abs((mouse.y) - 265) < 75) {
                    atraparVirus();
                } else if (Math.abs((mouse.x) - 610) < 70 && Math.abs((mouse.y) - 265) < 75) {
                    location.href = '../html/juego2.html';
                }
            }

            function virusGameOver() {
                win.play();

                canvas.removeEventListener("click", virusGameClickListener);
                clearTimeout(contador);
                limpiar();

                lienzo.drawImage(finalJuego, 10, 10);
                lienzo.font = "bold 45px Verdana";
                lienzo.fillStyle = "white";
                lienzo.fillText(score, 570, 110);

                lienzo.font = "bold 20px Verdana";
                lienzo.fillStyle = "#A3B113";
                lienzo.fillRect(340, 440, 225, 25);
                lienzo.fillStyle = "white";
                lienzo.fillText("Intentar de nuevo", 350, 460);

                lienzo.fillStyle = "#8B3E20";
                lienzo.fillRect(600, 440, 225, 25);
                lienzo.fillStyle = "white";
                lienzo.fillText("Menú de Juegos", 625, 460);

                contando = false;
                canvas.addEventListener("click", virusGamePlayAgainListener);
            }

            function atraparVirus() {
                score = 0;
                contando = false;

                canvas.removeEventListener("click", virusGamePlayAgainListener);
                canvas.removeEventListener("click", menuListener);
                canvas.addEventListener("click", virusGameClickListener);
                lienzo.drawImage(inicioJuego, 10, 10);

                limpiar();
                imprimirVirus();
                imprimirScore();

                if (reproduciendoMusica == false) {
                    var musiquita = new Audio('../audio/musicaVideojuego.m4a');
                    musiquita.play();
                    reproduciendoMusica = true;
                }

                if (contando == false) {
                    contador = setTimeout(virusGameOver, 1000);
                    contando = true;
                }
            }

            function virusGameClickListener(event) {
                mouse = {
                    x: event.clientX - margen.left,
                    y: event.clientY - margen.top
                }

                if (Math.abs((mouse.x) - (virus1.x + 16)) < 20 && Math.abs((mouse.y) - (virus1.y + 16)) < 20) {
                    score++;
                    limpiar();
                    imprimirScore();
                    virusRespawn(virus1);
                    imprimirVirus();
                    tick.play();
                } else if (Math.abs((mouse.x) - (virus2.x + 16)) < 20 && Math.abs((mouse.y) - (virus2.y + 16)) < 20) {
                    score++;
                    limpiar();
                    imprimirScore();
                    virusRespawn(virus2);
                    imprimirVirus();
                    tick.play();
                } else if (Math.abs((mouse.x) - (virus3.x + 16)) < 20 && Math.abs((mouse.y) - (virus3.y + 16)) < 20) {
                    score++;
                    limpiar();
                    imprimirScore();
                    virusRespawn(virus3);
                    imprimirVirus();
                    tick.play();
                }
            }

            function virusGamePlayAgainListener(event) {
                console.log("Listening");
                mouse = {
                    x: event.clientX - margen.left,
                    y: event.clientY - margen.top
                }
                console.log(mouse.y);
                if (Math.abs((mouse.x) - 550) < 200 && Math.abs((mouse.y) - 455) < 15) {
                    atraparVirus();
                }

            }
        }
    } else {
        alert("Lo sentimos, tu navegador es incompatible");
    }

}