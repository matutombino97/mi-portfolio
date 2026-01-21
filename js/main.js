/* =========================================
   1. SEGUIMIENTO DE OJOS (PUPILAS)
   ========================================= */
const pupilas = document.querySelectorAll('.pupila');

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    pupilas.forEach(pupila => {
        const rect = pupila.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        const angle = Math.atan2(deltaY, deltaX);
        const maxMove = 5; 
        const moveX = Math.cos(angle) * maxMove;
        const moveY = Math.sin(angle) * maxMove;
        pupila.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`;
    });
});

/* =========================================
   2. LÓGICA DE LOS PERGAMINOS Y KUNAI (MODIFICADO)
   ========================================= */
const cabeceras = document.querySelectorAll('.pergamino-cabecera');
const kunai = document.getElementById('kunai'); 

cabeceras.forEach(cabecera => {
    cabecera.addEventListener('click', (e) => {
        
        const contenido = cabecera.nextElementSibling;
        const estaAbierto = contenido.style.maxHeight;

        // Si ya está abierto, lo cerramos y nos vamos
        if (estaAbierto) {
            contenido.style.maxHeight = null;
            cabecera.classList.remove('activo');
            return; 
        }

        // === DETECCIÓN DE MÓVIL (NUEVO) ===
        // Si es pantalla chica, abrimos AL INSTANTE y salimos.
        if (window.innerWidth <= 768) {
            cabecera.classList.add('activo');
            contenido.style.maxHeight = contenido.scrollHeight + "px";
            return; // ¡Aquí termina la función para móviles!
        }

        // === SI ES PC, EJECUTAMOS LA ANIMACIÓN COMPLETA ===
        
        // CÁLCULOS DE PUNTERÍA
        const rect = cabecera.getBoundingClientRect();
        const centroY = rect.top + (rect.height / 2);
        const inicioCorteX = rect.left + 40; 
        const finCorteX = rect.right - 40;
        const destinoInicialX = inicioCorteX - 50;
        const destinoInicialY = centroY - 100;
        const destinoFinalX = finCorteX - 50; 

        // PREPARAR ARMA
        kunai.style.opacity = '1';
        kunai.style.transition = 'none';
        kunai.style.transform = 'rotate(0deg)';
        kunai.style.left = (window.innerWidth - 200) + 'px'; 
        kunai.style.top = (window.innerHeight - 400) + 'px';
        kunai.offsetHeight; // Reflow hack

        // FASE 1: EL VUELO
        setTimeout(() => {
            kunai.style.transition = 'all 0.4s ease-in'; 
            kunai.style.left = destinoInicialX + 'px';
            kunai.style.top = destinoInicialY + 'px';
            kunai.style.transform = 'rotate(360deg)'; 
        }, 10);

        // FASE 2: EL CORTE
        setTimeout(() => {
            kunai.style.transition = 'left 0.5s linear'; 
            kunai.style.left = destinoFinalX + 'px';
            kunai.style.transform = 'rotate(400deg)';
        }, 410); 

        // FASE 3: APERTURA
        setTimeout(() => {
            kunai.style.opacity = '0';
            cabecera.classList.add('activo');
            contenido.style.maxHeight = contenido.scrollHeight + "px";

            // Reset del Kunai
            setTimeout(() => {
                 kunai.style.left = 'auto'; 
                 kunai.style.right = '0';
            }, 500);
        }, 910); 
    });
})

/* =========================================
   3. MODO SHARINGAN (Dark Mode)
   ========================================= */
const btnSharingan = document.getElementById('btn-sharingan');
const body = document.body;

btnSharingan.addEventListener('click', () => {
    body.classList.toggle('modo-sharingan');
    btnSharingan.classList.toggle('activo');
    
    if(body.classList.contains('modo-sharingan')){
        localStorage.setItem('modo', 'noche');
    } else {
        localStorage.setItem('modo', 'dia');
    }
});

if(localStorage.getItem('modo') === 'noche'){
    body.classList.add('modo-sharingan');
}

/* =========================================
   4. EFECTO DE CHAKRA (PARTÍCULAS)
   ========================================= */
const canvas = document.getElementById('lienzo-chakra');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particulasArray = [];

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const mouse = { x: null, y: null }

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 3; i++){
        particulasArray.push(new Particula());
    }
});

class Particula {
    constructor(){
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        
        if(document.body.classList.contains('modo-sharingan')){
            this.color = 'rgba(255, 0, 0, 0.8)';
        } else {
            this.color = 'rgba(0, 150, 255, 0.8)';
        }
    }
    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function manejarParticulas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particulasArray.length; i++){
        particulasArray[i].update();
        particulasArray[i].draw();
        if (particulasArray[i].size <= 0.3){
            particulasArray.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(manejarParticulas);
}
manejarParticulas();

/* =========================================
   5. NAVEGACIÓN INTELIGENTE (Final)
   ========================================= */
const linksMenu = document.querySelectorAll('nav a');

linksMenu.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); 

        const idDestino = link.getAttribute('href');
        const seccionDestino = document.querySelector(idDestino);

        if (seccionDestino) {
            // DETECTAR SI ES CELULAR
            const esCelular = window.innerWidth <= 768;

            // En móvil: Offset 80px y Tiempo 0. 
            // IMPORTANTE: Ponemos 'behavior: auto' en móvil para que el salto sea instantáneo
            const headerOffset = esCelular ? 80 : 120; 
            const tiempoEspera = esCelular ? 0 : 800;
            const comportamientoScroll = esCelular ? "auto" : "smooth";

            const elementPosition = seccionDestino.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            // MOVER CÁMARA
            window.scrollTo({
                top: offsetPosition,
                behavior: comportamientoScroll // "auto" (salto) en móvil, "smooth" (cine) en PC
            });

            setTimeout(() => {
                const cabecera = seccionDestino.querySelector('.pergamino-cabecera');
                const contenido = seccionDestino.querySelector('.pergamino-contenido');

                if (!contenido.style.maxHeight || contenido.style.maxHeight === "0px") {
                    cabecera.click(); 
                }
            }, tiempoEspera); 
        }
    });
});