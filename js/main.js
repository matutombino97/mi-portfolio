// Seleccionamos todas las cosas que tengan la clase .pupila
const pupilas = document.querySelectorAll('.pupila');

document.addEventListener('mousemove', (e) => {
    // 1. Obtenemos dónde está el mouse
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // 2. Por cada pupila, calculamos su movimiento
    pupilas.forEach(pupila => {
        // Obtenemos la información de la posición de la pupila en la pantalla
        // "rect" nos da: top, left, width, height del elemento
        const rect = pupila.getBoundingClientRect();

        // Calculamos el centro de la pupila (El poste del perro)
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculamos la distancia entre el mouse y el centro del ojo
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;

        // MATEMÁTICA NINJA: Calculamos el ángulo
        const angle = Math.atan2(deltaY, deltaX);

        // Definimos la "Correa". Cuántos píxeles se puede mover la pupila como máximo.
        // Prueba cambiando este número (ej: 5, 10, 15) para ver qué pasa.
        const maxMove = 5; 

        // Calculamos la nueva posición usando el ángulo y la distancia máxima
        // (Trigonometría: Cos for X, Sin for Y)
        const moveX = Math.cos(angle) * maxMove;
        const moveY = Math.sin(angle) * maxMove;

        // Aplicamos el movimiento
        // IMPORTANTE: Mantenemos el translate(-50%, -50%) para que siga centrada
        pupila.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`;
    });
});

/* =========================================
   LÓGICA DE LOS PERGAMINOS  Y KUNAI (ACORDEÓN)
   ========================================= */

const cabeceras = document.querySelectorAll('.pergamino-cabecera');
const kunai = document.getElementById('kunai'); 

/* =========================================
                LÓGICA MAESTRA
   ========================================= */
cabeceras.forEach(cabecera => {
    cabecera.addEventListener('click', (e) => {
        
        // Bloqueo si ya está abierto (igual que antes)
        const contenido = cabecera.nextElementSibling;
        const estaAbierto = contenido.style.maxHeight;

        if (estaAbierto) {
            contenido.style.maxHeight = null;
            cabecera.classList.remove('activo');
            return; 
        }

        // === CÁLCULOS DE PUNTERÍA (NUEVO) ===
        const rect = cabecera.getBoundingClientRect();
        
        // Calculamos la altura central (Y)
        const centroY = rect.top + (rect.height / 2);
        
        // Definimos DONDE EMPIEZA y DONDE TERMINA el corte
        // Inicio: Borde izquierdo + un poquito (20px)
        const inicioCorteX = rect.left + 40; 
        // Fin: Borde derecho - un poquito
        const finCorteX = rect.right - 40;

        // Ajustamos para el centro del Kunai (-50px)
        const destinoInicialX = inicioCorteX - 50;
        const destinoInicialY = centroY - 100;
        const destinoFinalX = finCorteX - 50; // A donde llegará después de cortar

        // === PREPARAR ARMA ===
        kunai.style.opacity = '1';
        kunai.style.transition = 'none';
        kunai.style.transform = 'rotate(0deg)'; // Reseteamos giro
        
        // Posición inicial: Mano de Naruto
        kunai.style.left = (window.innerWidth - 200) + 'px'; 
        kunai.style.top = (window.innerHeight - 400) + 'px';
        
        kunai.offsetHeight; // Reflow hack (necesario)

        // === FASE 1: EL VUELO (Hacia el inicio de la cinta) ===
        setTimeout(() => {
            // Tiempo de vuelo: 0.4s (Asegúrate que coincida con tu CSS transition)
            kunai.style.transition = 'all 0.4s ease-in'; 
            
            kunai.style.left = destinoInicialX + 'px';
            kunai.style.top = destinoInicialY + 'px';
            
            // Aquí decides si rota en el aire o va recto
            kunai.style.transform = 'rotate(360deg)'; 

        }, 10);

        // === FASE 2: EL CORTE (Una vez que llega) ===
        setTimeout(() => {
            // Cambiamos el estilo de movimiento para el corte
            // 'linear' es mejor para cortes, '0.5s' es la duración del corte
            kunai.style.transition = 'left 0.5s linear'; 
            
            // Movemos el kunai hasta el final de la cinta a la derecha
            kunai.style.left = destinoFinalX + 'px';
            
            // Opcional: Que rote un poquito más mientras corta para simular rasgado
             kunai.style.transform = 'rotate(400deg)';

        }, 410); // Esperamos 410ms (los 400 del vuelo + un margen pequeñito)

        // === FASE 3: APERTURA (Al terminar el corte) ===
        setTimeout(() => {
            
            // 1. Desaparece el kunai
            kunai.style.opacity = '0';
            
            // 2. Abre el pergamino
            cabecera.classList.add('activo'); // Esto borra la cinta roja (por CSS)
            contenido.style.maxHeight = contenido.scrollHeight + "px";

            // 3. Reset del Kunai a casa (silencioso)
            setTimeout(() => {
                 kunai.style.left = 'auto'; 
                 kunai.style.right = '0';
                 // ... resto del reset ...
            }, 500);

        }, 910); // 410ms (vuelo) + 500ms (corte) = 910ms total de espera

    });
})

/* =========================================
   MODO SHARINGAN (Dark Mode)
   ========================================= */
const btnSharingan = document.getElementById('btn-sharingan');
const body = document.body;

btnSharingan.addEventListener('click', () => {
    // 1. Alternar la clase en el body
    body.classList.toggle('modo-sharingan');

    // 2. Efecto visual opcional (rotar el botón)
    btnSharingan.classList.toggle('activo');
    
    // 3. Guardar preferencia (Para que recuerde si recargas la página)
    if(body.classList.contains('modo-sharingan')){
        localStorage.setItem('modo', 'noche');
    } else {
        localStorage.setItem('modo', 'dia');
    }
});

// 4. Al cargar la página, revisar si ya había elegido modo noche
if(localStorage.getItem('modo') === 'noche'){
    body.classList.add('modo-sharingan');
}


/* =========================================
   EFECTO DE CHAKRA (PARTÍCULAS)
   ========================================= */
const canvas = document.getElementById('lienzo-chakra');
const ctx = canvas.getContext('2d');

// Ajustamos el canvas al tamaño de la pantalla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particulasArray = [];

// Manejamos el redimensionamiento de ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// El objeto Mouse para saber dónde dibujar
const mouse = {
    x: null,
    y: null
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    // Creamos 2 o 3 partículas por cada movimiento
    for (let i = 0; i < 3; i++){
        particulasArray.push(new Particula());
    }
});

// CLASE PARTÍCULA (El molde de cada bolita de chakra)
class Particula {
    constructor(){
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 5 + 1; // Tamaño aleatorio entre 1 y 6
        this.speedX = Math.random() * 3 - 1.5; // Velocidad aleatoria X
        this.speedY = Math.random() * 3 - 1.5; // Velocidad aleatoria Y
        
        // COLOR DINÁMICO: Preguntamos si el Sharingan está activo
        if(document.body.classList.contains('modo-sharingan')){
            this.color = 'rgba(255, 0, 0, 0.8)'; // Rojo Sangre
        } else {
            this.color = 'rgba(0, 150, 255, 0.8)'; // Azul Chakra
        }
    }

    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        // Hacemos que se achique
        if (this.size > 0.2) this.size -= 0.1;
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// BUCLE DE ANIMACIÓN (Se repite 60 veces por segundo)
function manejarParticulas(){
    // Limpiamos el lienzo para dibujar el siguiente cuadro (con rastro suave)
    // Usamos 'clearRect' para borrar todo o un rectángulo semitransparente para estela
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particulasArray.length; i++){
        particulasArray[i].update();
        particulasArray[i].draw();

        // Si la partícula es muy chica, la borramos del array para que la PC no explote
        if (particulasArray[i].size <= 0.3){
            particulasArray.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(manejarParticulas);
}

// INICIAMOS LA ANIMACIÓN
manejarParticulas();

/* =========================================
   NAVEGACIÓN CINEMÁTICA (Scroll -> Espera -> Acción)
   ========================================= */

const linksMenu = document.querySelectorAll('nav a');

linksMenu.forEach(link => {
    link.addEventListener('click', (e) => {
        // 1. FRENA EL SALTO BRUSCO
        e.preventDefault(); 

        const idDestino = link.getAttribute('href');
        const seccionDestino = document.querySelector(idDestino);

        if (seccionDestino) {
            // A. CALCULA DONDE ATERRIZAR
            // Ajusta el 120 según el tamaño de tu header fijo
            const headerOffset = 120; 
            const elementPosition = seccionDestino.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            // B. MUEVE LA CÁMARA (SCROLL)
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            // C. LA MAGIA DEL "TIMEOUT" (ESPERA)
            // Esperamos 800 milisegundos (0.8 segundos) a que termine de bajar la pantalla.
            // Recién ahí, preguntamos si hay que abrir el pergamino.
            setTimeout(() => {
                const cabecera = seccionDestino.querySelector('.pergamino-cabecera');
                const contenido = seccionDestino.querySelector('.pergamino-contenido');

                // Si está cerrado... ¡ÁBRELO!
                if (!contenido.style.maxHeight || contenido.style.maxHeight === "0px") {
                    cabecera.click(); 
                }
            }, 800); // <--- Juega con este número. 800ms suele ser el tiempo que tarda el scroll.
        }
    });
});