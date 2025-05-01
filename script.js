const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

let mouseX = -1000, mouseY = -1000;
let glowStrength = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glowStrength = 1; // активируем при движении
});

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gridSize = 70;
    const radius = 350;
    const radiusSq = radius * radius;

    // Плавное затухание при отсутствии движения
    glowStrength = lerp(glowStrength, 0, 0.02);

    // Базовая сетка (10% непрозрачности)
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.1)';
    ctx.shadowBlur = 0;
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Подсвеченные участки сетки
    for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const distSq = dx * dx + dy * dy;

            if (distSq <= radiusSq) {
                const dist = Math.sqrt(distSq);
                let t = 1 - dist / radius; // от 0 (край) до 1 (центр)
                t = Math.pow(t, 2); // квадратичное затухание

                const baseColor = [200, 200, 200]; // #c8c8c8
                const glowColor = [87, 132, 230];  // #5784E6

             const alpha = .7 * t * glowStrength;
const color = `rgba(87, 132, 230, ${alpha})`;

                ctx.strokeStyle = color;
                ctx.shadowBlur = 30 * t * glowStrength;
                ctx.shadowColor = color;

                // Рисуем только локальные участки
                ctx.beginPath();
                ctx.moveTo(x - gridSize / 2, y);
                ctx.lineTo(x + gridSize / 2, y);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(x, y - gridSize / 2);
                ctx.lineTo(x, y + gridSize / 2);
                ctx.stroke();
            }
        }
    }

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    requestAnimationFrame(draw);
}


draw();