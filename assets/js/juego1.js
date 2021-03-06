debugger;
window.onload = function() { //Se ejecuta cuando carga la página

    const canvas = document.getElementById("juego");

    if (canvas && canvas.getContext) {
        const lienzo = canvas.getContext("2d");
        if (lienzo) { //si el navegador es compatible se ejecuta esto

            const menuJuego = new Image(); //Carga imagenes y audios necesarios para el juego
            menuJuego.src = "../assets/img/menuJuego.png"
            const inicioJuego = new Image();
            inicioJuego.src = "../assets/img/inicioJuego.png";
            const finalJuegoVirus = new Image();
            finalJuegoVirus.src = "../assets/img/finalJuegoVirus.png";
            const imgVirus = new Image();
            imgVirus.src = "../assets/img/virus.png";
            const inicioMemoria = new Image();
            inicioMemoria.src = "../assets/img/inicioMemoria.png";
            const tresVidas = new Image();
            tresVidas.src = "../assets/img/3lives.png";
            const dosVidas = new Image();
            dosVidas.src = "../assets/img/2lives.png";
            const unaVida = new Image();
            unaVida.src = "../assets/img/live.png";
            const signoPregunta = new Image();
            signoPregunta.src = "../assets/img/question-mark.png";
            const imagenA = new Image();
            imagenA.src = "../assets/img/mask.png";
            const imagenB = new Image();
            imagenB.src = "../assets/img/social-distancing.png";
            const imagenC = new Image();
            imagenC.src = "../assets/img/stay-at-home.png";
            const imagenD = new Image();
            imagenD.src = "../assets/img/washHands.png";
            const finalJuegoMemoria = new Image();
            finalJuegoMemoria.src = "../assets/img/finalJuegoMemoria.png";
            const diapositiva1 = new Image();
            diapositiva1.src = "../assets/img/diapositiva1.png";
            const diapositiva2 = new Image();
            diapositiva2.src = "../assets/img/diapositiva2.png";

            const musiquita = new Audio('../assets/audio/musicaVideojuego.mp3');
            const tick = new Audio('../assets/audio/tick.mp3');
            const win = new Audio('../assets/audio/win.mp3');
            const fail = new Audio('../assets/audio/fail.mp3')

            const margen = canvas.getBoundingClientRect(); //Obtiene la margen que rodea el canvas
            var mouse; //En ella se almacenarán las posiciones de los clicks

            var reproduciendoMusica = false; //Ayuda a describir el estado actual del juego
            var contando = false;
            var primerClick;
            var score = 0;
            var vidas = 3;

            class Virus {
                constructor(x, y) {
                    this.image = imgVirus;
                    this.x = x;
                    this.y = y;
                }
            }

            //SECCION MEMORIA

            var posiciones = [0, 1, 2, 3, 4, 5, 6, 7];
            posiciones = posiciones.sort(() => Math.random() - 0.5);

            var tipos = [0, 0, 1, 1, 2, 2, 3, 3];
            tipos = tipos.sort(() => Math.random() - 0.5);

            class Tarjeta {
                constructor(posicion, tipo) {
                    this.mostrado = false;
                    this.posicion = posicion;
                    switch (tipo) {
                        case 0:
                            this.imagen = imagenA;
                            this.tipo = 0;
                            break;
                        case 1:
                            this.imagen = imagenB;
                            this.tipo = 1;
                            break;
                        case 2:
                            this.imagen = imagenC;
                            this.tipo = 2;
                            break;
                        case 3:
                            this.imagen = imagenD;
                            this.tipo = 3;
                            break;
                    }
                }
            }

            var tarjetas = [
                new Tarjeta(posiciones[0], tipos[0]),
                new Tarjeta(posiciones[1], tipos[1]),
                new Tarjeta(posiciones[2], tipos[2]),
                new Tarjeta(posiciones[3], tipos[3]),
                new Tarjeta(posiciones[4], tipos[4]),
                new Tarjeta(posiciones[5], tipos[5]),
                new Tarjeta(posiciones[6], tipos[6]),
                new Tarjeta(posiciones[7], tipos[7])
            ];

            var mostrado = [];
            var paresHallados = 0;

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
                lienzo.fillStyle = '#A3B113';
                lienzo.fillRect(10, 10, 235, 40);
                lienzo.font = "20px Verdana";
                lienzo.fillStyle = "white";
                lienzo.fillText("Virus Capturados: " + score, 25, 40);
            }

            function imprimirVidas() {
                switch (vidas) {
                    case 1:
                        lienzo.drawImage(unaVida, 855, 10);
                        break;
                    case 2:
                        lienzo.drawImage(dosVidas, 855, 10);
                        break;
                    case 3:
                        lienzo.drawImage(tresVidas, 855, 10);
                        break;
                }
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
                canvas.removeEventListener("click", juegoVirusJugarDeNuevoListener);
                canvas.removeEventListener("click", juegoVirusClickListener);
                canvas.removeEventListener("click", juegoMemoriaJugarDeNuevoListener);
                canvas.removeEventListener("click", aprenderClickListener);
                canvas.addEventListener("click", menuListener);
                musiquita.pause();

            }

            function imprimirBotonesFinales() {
                lienzo.font = "bold 20px Verdana";
                lienzo.fillStyle = "#A3B113";
                lienzo.fillRect(340, 440, 225, 25);
                lienzo.fillStyle = "white";
                lienzo.fillText("Intentar de nuevo", 350, 460);

                lienzo.fillStyle = "#8B3E20";
                lienzo.fillRect(600, 440, 225, 25);
                lienzo.fillStyle = "white";
                lienzo.fillText("Menú de Juegos", 625, 460);
            }

            function menuListener(event) { //Escucha en el menú para saber que desea jugar el usuario
                mouse = {
                    x: event.clientX - margen.left,
                    y: event.clientY - margen.top
                }
                if (Math.abs((mouse.x) - 435) < 70 && Math.abs((mouse.y) - 265) < 75) {
                    atraparVirus();
                } else if (Math.abs((mouse.x) - 610) < 70 && Math.abs((mouse.y) - 265) < 75) {
                    juegoMemoria();
                } else if (Math.abs((mouse.x) - 780) < 70 && Math.abs((mouse.y) - 265) < 75) {
                    aprender();
                }
            }

            function juegoVirusGameOver() {
                win.play();

                canvas.removeEventListener("click", juegoVirusClickListener);
                clearTimeout(contador);
                limpiar();

                if (score < 9) {
                    lienzo.drawImage(finalJuegoVirus, 10, 10);
                    lienzo.font = "bold 45px Verdana";
                    lienzo.fillStyle = "white";
                    lienzo.fillText(score, 585, 110);
                } else {
                    lienzo.drawImage(finalJuegoVirus, 10, 10);
                    lienzo.font = "bold 45px Verdana";
                    lienzo.fillStyle = "white";
                    lienzo.fillText(score, 570, 110);
                }

                imprimirBotonesFinales();

                contando = false;
                canvas.addEventListener("click", juegoVirusJugarDeNuevoListener);
            }

            function atraparVirus() {
                score = 0;
                vidas = 3;
                contando = false;

                canvas.removeEventListener("click", juegoVirusJugarDeNuevoListener);
                canvas.removeEventListener("click", menuListener);
                canvas.addEventListener("click", juegoVirusClickListener);
                limpiar();
                lienzo.drawImage(inicioJuego, 10, 10);

                musiquita.play();

                if (contando == false) {
                    contador = setTimeout(juegoVirusGameOver, 10000);
                    contando = true;
                }
            }

            function juegoVirusClickListener(event) {
                limpiar();
                imprimirScore();
                imprimirVirus();
                imprimirVidas();

                mouse = {
                    x: event.clientX - margen.left,
                    y: event.clientY - margen.top
                }

                if (primerClick == false) {
                    if (Math.abs((mouse.x) - (virus1.x + 16)) < 20 && Math.abs((mouse.y) - (virus1.y + 16)) < 20) {
                        score++;
                        virusRespawn(virus1);
                        imprimirScore();
                        tick.play();
                    } else if (Math.abs((mouse.x) - (virus2.x + 16)) < 20 && Math.abs((mouse.y) - (virus2.y + 16)) < 20) {
                        score++;
                        virusRespawn(virus2);
                        imprimirScore();
                        tick.play();
                    } else if (Math.abs((mouse.x) - (virus3.x + 16)) < 20 && Math.abs((mouse.y) - (virus3.y + 16)) < 20) {
                        score++;
                        virusRespawn(virus3);
                        imprimirScore();
                        tick.play();
                    } else {
                        vidas--;
                        fail.play();
                        imprimirVidas();
                    }
                    if (vidas == 0) {
                        clearTimeout(contador);
                        juegoVirusGameOver();
                    }
                } else {
                    primerClick = false;
                }

            }

            function juegoVirusJugarDeNuevoListener(event) {
                mouse = {
                    x: event.clientX - margen.left,
                    y: event.clientY - margen.top
                }
                if (Math.abs((mouse.x) - 450) < 115 && Math.abs((mouse.y) - 455) < 15) {
                    primerClick = true;
                    atraparVirus();
                } else if (Math.abs((mouse.x) - 710) < 115 && Math.abs((mouse.y) - 455) < 15) {
                    primerClick = true;
                    cargarMenu();
                } else if (Math.abs((mouse.x) - 100) < 100 && Math.abs((mouse.y) - 40) < 30) {
                    puntajesAltos();
                }
            }

            function juegoMemoria() {
                canvas.removeEventListener("click", menuListener);
                canvas.removeEventListener("click", juegoMemoriaJugarDeNuevoListener);
                canvas.addEventListener("click", juegoMemoriaListener);

                posiciones = posiciones.sort(() => Math.random() - 0.5);
                tipos = tipos.sort(() => Math.random() - 0.5);

                lienzo.drawImage(inicioMemoria, 10, 10);
            }

            function juegoMemoriaJugarDeNuevoListener(event) {
                mouse = {
                    x: event.clientX - margen.left,
                    y: event.clientY - margen.top
                }
                if (Math.abs((mouse.x) - 450) < 115 && Math.abs((mouse.y) - 455) < 15) {
                    primerClick = true;
                    juegoMemoria();
                } else if (Math.abs((mouse.x) - 710) < 115 && Math.abs((mouse.y) - 455) < 15) {
                    primerClick = true;
                    cargarMenu();
                }
            }

            function imprimirTarjetas() {
                lienzo.fillStyle = '#B9CC4E';
                if (tarjetas[0].mostrado) {
                    lienzo.drawImage(tarjetas[0].imagen, 50, 35);
                } else {
                    lienzo.fillRect(50, 35, 200, 200);
                    lienzo.drawImage(signoPregunta, 50, 30);
                }

                if (tarjetas[1].mostrado) {
                    lienzo.drawImage(tarjetas[1].imagen, 285, 35);
                } else {
                    lienzo.fillRect(285, 35, 200, 200);
                    lienzo.drawImage(signoPregunta, 285, 30);
                }

                if (tarjetas[2].mostrado) {
                    lienzo.drawImage(tarjetas[2].imagen, 520, 35);
                } else {
                    lienzo.fillRect(520, 35, 200, 200);
                    lienzo.drawImage(signoPregunta, 520, 30);
                }

                if (tarjetas[3].mostrado) {
                    lienzo.drawImage(tarjetas[3].imagen, 755, 35);
                } else {
                    lienzo.fillRect(755, 35, 200, 200);
                    lienzo.drawImage(signoPregunta, 755, 30);
                }

                if (tarjetas[4].mostrado) {
                    lienzo.drawImage(tarjetas[4].imagen, 50, 265);
                } else {
                    lienzo.fillRect(50, 265, 200, 200);
                    lienzo.drawImage(signoPregunta, 50, 260);
                }

                if (tarjetas[5].mostrado) {
                    lienzo.drawImage(tarjetas[5].imagen, 285, 265);
                } else {
                    lienzo.fillRect(285, 265, 200, 200);
                    lienzo.drawImage(signoPregunta, 285, 260);
                }

                if (tarjetas[6].mostrado) {
                    lienzo.drawImage(tarjetas[6].imagen, 520, 265);
                } else {
                    lienzo.fillRect(520, 265, 200, 200);
                    lienzo.drawImage(signoPregunta, 520, 260);
                }

                if (tarjetas[7].mostrado) {
                    lienzo.drawImage(tarjetas[7].imagen, 755, 265);
                } else {
                    lienzo.fillRect(755, 265, 200, 200);
                    lienzo.drawImage(signoPregunta, 755, 260);
                }
            }

            function comprobarParesIguales() {

                if (mostrado[0].tipo == mostrado[1].tipo) {
                    imprimirTarjetas();
                    paresHallados++;
                    tick.play();
                    mostrado = [];
                    if (paresHallados == 4) {
                        win.play();
                        setTimeout(() => {
                            mostrado = [];
                            paresHallados = 0;
                            lienzo.drawImage(finalJuegoMemoria, 10, 10);
                            imprimirBotonesFinales();
                            canvas.removeEventListener("click", juegoMemoriaListener);
                            canvas.addEventListener("click", juegoMemoriaJugarDeNuevoListener);
                        }, 500);
                    }
                } else {
                    imprimirTarjetas();
                    setTimeout(() => {
                        tarjetas.forEach(element => {
                            if (element.posicion == mostrado[0].posicion || element.posicion == mostrado[1].posicion) {
                                element.mostrado = false;
                            }
                        });
                        imprimirTarjetas();
                        mostrado = [];
                    }, 500);

                }

            }

            function juegoMemoriaListener(event) {
                limpiar();
                imprimirTarjetas();
                mouse = {
                    x: event.clientX - margen.left,
                    y: event.clientY - margen.top
                }
                if (primerClick == false) {

                    if (Math.abs((mouse.x) - 150) < 100 && Math.abs((mouse.y) - 135) < 100 && tarjetas[0].mostrado == false) {
                        mostrado.push(tarjetas[0]);
                        tarjetas[0].mostrado = true;
                        if (mostrado.length < 2) {
                            imprimirTarjetas();
                        } else {
                            comprobarParesIguales();
                        }
                    } else if (Math.abs((mouse.x) - 385) < 100 && Math.abs((mouse.y) - 135) < 100 && tarjetas[1].mostrado == false) {
                        mostrado.push(tarjetas[1]);
                        tarjetas[1].mostrado = true;
                        if (mostrado.length < 2) {
                            imprimirTarjetas();
                        } else {
                            comprobarParesIguales();
                        }
                    } else if (Math.abs((mouse.x) - 620) < 100 && Math.abs((mouse.y) - 135) < 100 && tarjetas[2].mostrado == false) {
                        mostrado.push(tarjetas[2]);
                        tarjetas[2].mostrado = true;
                        if (mostrado.length < 2) {
                            imprimirTarjetas();
                        } else {
                            comprobarParesIguales();
                        }
                    } else if (Math.abs((mouse.x) - 855) < 100 && Math.abs((mouse.y) - 135) < 100 && tarjetas[3].mostrado == false) {
                        mostrado.push(tarjetas[3]);
                        tarjetas[3].mostrado = true;
                        if (mostrado.length < 2) {
                            imprimirTarjetas();
                        } else {
                            comprobarParesIguales();
                        }
                    } else if (Math.abs((mouse.x) - 150) < 100 && Math.abs((mouse.y) - 365) < 100 && tarjetas[4].mostrado == false) {
                        mostrado.push(tarjetas[4]);
                        tarjetas[4].mostrado = true;
                        if (mostrado.length < 2) {
                            imprimirTarjetas();
                        } else {
                            comprobarParesIguales();
                        }
                    } else if (Math.abs((mouse.x) - 385) < 100 && Math.abs((mouse.y) - 365) < 100 && tarjetas[5].mostrado == false) {
                        mostrado.push(tarjetas[5]);
                        tarjetas[5].mostrado = true;
                        if (mostrado.length < 2) {
                            imprimirTarjetas();
                        } else {
                            comprobarParesIguales();
                        }
                    } else if (Math.abs((mouse.x) - 620) < 100 && Math.abs((mouse.y) - 365) < 100 && tarjetas[6].mostrado == false) {
                        mostrado.push(tarjetas[6]);
                        tarjetas[6].mostrado = true;
                        if (mostrado.length < 2) {
                            imprimirTarjetas();
                        } else {
                            comprobarParesIguales();
                        }
                    } else if (Math.abs((mouse.x) - 855) < 100 && Math.abs((mouse.y) - 365) < 100 && tarjetas[7].mostrado == false) {
                        mostrado.push(tarjetas[7]);
                        tarjetas[7].mostrado = true;
                        if (mostrado.length < 2) {
                            imprimirTarjetas();
                        } else {
                            comprobarParesIguales();
                        }
                    }

                } else {
                    posiciones = posiciones.sort(() => Math.random() - 0.5);
                    tipos = tipos.sort(() => Math.random() - 0.5);
                    tarjetas.forEach(element => {
                        element.mostrado = false;
                    });
                    imprimirTarjetas();
                    primerClick = false;
                }

            }

            function puntajesAltos() {
                canvas.removeEventListener("click", juegoVirusJugarDeNuevoListener);
                Swal.fire({
                    title: '¿Cual es tu nombre?',
                    icon: 'question',
                    html: '<form method=\"POST\" action=\"puntajesAltos.php\">' +
                        '<input type=\"text\" class=\"form-control\" name=\"nombre\" style=\"text-transform:uppercase;\"/><br>' +
                        '<input type=\"text\" class=\"hidden\" name=\"puntaje\" value=\"' + score + '\"/><br>' +
                        '<input type=\"submit\" class=\"swal2-confirm swal2-styled\" value=\"Continuar\"/>' +
                        '</form>',
                    showConfirmButton: false
                });
            }

            function imprimirDiapositivas() {
                switch (diapositiva) {
                    case -1:
                        cargarMenu();
                        break;

                    case 0:
                        lienzo.drawImage(diapositiva1, 10, 10);

                        lienzo.font = "bold 20px Verdana";
                        lienzo.fillStyle = "#A3B113";
                        lienzo.fillRect(10, 450, 250, 40);
                        lienzo.fillStyle = "white";
                        lienzo.fillText("Menú de juegos", 40, 475);


                        lienzo.fillStyle = "#8B3E20";
                        lienzo.fillRect(740, 450, 250, 40);
                        lienzo.fillStyle = "white";
                        lienzo.fillText("Siguiente Diapositiva", 745, 475);

                        break;

                    case 1:
                        lienzo.drawImage(diapositiva2, 10, 10);

                        lienzo.font = "bold 20px Verdana";
                        lienzo.fillStyle = "#A3B113";
                        lienzo.fillRect(10, 450, 250, 40);
                        lienzo.fillStyle = "white";
                        lienzo.fillText("Anterior diapositiva", 25, 475);


                        lienzo.fillStyle = "#8B3E20";
                        lienzo.fillRect(740, 450, 250, 40);
                        lienzo.fillStyle = "white";
                        lienzo.fillText("Menú de juegos", 775, 475);
                        break;

                    case 2:
                        cargarMenu();
                        break;
                }
            }

            function aprender() {
                canvas.removeEventListener("click", menuListener);
                canvas.addEventListener("click", aprenderClickListener);
                lienzo.font = "bold 20px Verdana";
                diapositiva = 0;
                limpiar();
                imprimirDiapositivas();
            }

            function aprenderClickListener(event) {
                mouse = {
                    x: event.clientX - margen.left,
                    y: event.clientY - margen.top
                }
                if (Math.abs((mouse.x) - 125) < 135 && Math.abs((mouse.y) - 470) < 20) {
                    diapositiva--;
                    imprimirDiapositivas();
                } else if (Math.abs((mouse.x) - 860) < 135 && Math.abs((mouse.y) - 470) < 20) {
                    diapositiva++;
                    imprimirDiapositivas();
                }
            }

        } else {
            alert("Lo sentimos, tu navegador es incompatible");
        }

    }
}