const swiper = new Swiper(".swiper", {
    breakpoints: {

        320: {
            slidesPerView: 1,

        },

        640: {
            slidesPerView: 2,

        },
        920: {
            slidesPerView: 3,

        },

        1300: {
            slidesPerView: 4,

        },

        1600: {
            slidesPerView: 5,

        },

        1800: {
            slidesPerView: 6,

        },
    },
    scrollbar: {
        el: ".swiper-scrollbar",
        hide: true,
    },
    freeMode: {
        enabled: true,
        sticky: false,
    },
    loop: true,
    autoplay: {
        delay: 10000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: '.button--next',
        prevEl: '.button--prev',
    },
});

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
    glowStrength = 1;
});

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gridSize = 70;
    const radius = 350;
    const radiusSq = radius * radius;


    glowStrength = lerp(glowStrength, 0, 0.02);

 
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

   
    for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
            const dx = x - mouseX;
            const dy = y - mouseY;
            const distSq = dx * dx + dy * dy;

            if (distSq <= radiusSq) {
                const dist = Math.sqrt(distSq);
                let t = 1 - dist / radius;
                t = Math.pow(t, 2); 

                const baseColor = [200, 200, 200]; 
                const glowColor = [87, 132, 230]; 

                const alpha = .7 * t * glowStrength;
                const color = `rgba(87, 132, 230, ${alpha})`;

                ctx.strokeStyle = color;
                ctx.shadowBlur = 30 * t * glowStrength;
                ctx.shadowColor = color;

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

function addError(field, message) {
    const formItem = field.closest('.form__item');
    formItem.classList.add('form__item--not-valid');

    let errorElement = formItem.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formItem.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());

    const invalidItems = document.querySelectorAll('.form__item--not-valid');
    invalidItems.forEach(item => item.classList.remove('form__item--not-valid'));
}

function validateField(field) {
    const value = field.value.trim();
    const name = field.name;

    if (!value) {
        addError(field, "Это поле обязательно для заполнения");
        return false;
    }

    switch (name) {
        case "taxId":
            if (!/^\d{10,12}$/.test(value)) {
                addError(field, "ИНН должен содержать 10 или 12 цифр");
                return false;
            }
            break;
        case "email":
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                addError(field, "Введите корректный email");
                return false;
            }
            break;
        case "phone":
            if (!/^[\d\+][\d\(\)\ -]{4,14}\d$/.test(value)) {
                addError(field, "Введите корректный номер телефона");
                return false;
            }
            break;

    }

    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('main-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        clearErrors();

        let isValid = true;
        const fields = form.querySelectorAll('input, textarea');

        fields.forEach((field) => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            const formData = {
                name: form.elements.name.value.trim(),
                surname: form.elements.surname.value.trim(),
                email: form.elements.email.value.trim(),
                phone: form.elements.phone.value.trim(),
                company: form.elements.company.value.trim(),
                job: form.elements.job.value.trim(),
                taxId: form.elements.taxId.value.trim()
            };

            console.log('Данные формы:', formData);
            alert('Форма успешно отправлена!');

        }
    });

    form.addEventListener('input', function (e) {
        if (e.target.tagName === 'INPUT') {
            const formItem = e.target.closest('.form__item');
            formItem.classList.remove('form__item--not-valid');
            const errorElement = formItem.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
        }
    });
});

const hamburger = document.querySelector(".header__hamburger");
const menu = document.querySelector(".header__menu");
const offerContent = document.querySelector(".offer__content");


menu.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
offerContent.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';

hamburger.addEventListener("click", function () {
    this.classList.toggle("active");
    
    if (menu.classList.contains("active")) {
        
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        
        offerContent.style.opacity = '1';
        offerContent.style.visibility = 'visible';
        
        
        setTimeout(() => {
            menu.classList.remove("active");
            offerContent.classList.remove("active");
        }, 300);
    } else {
       
        offerContent.style.opacity = '0';
        offerContent.style.visibility = 'hidden';
        
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        
       
        menu.classList.add("active");
        offerContent.classList.add("active");
    }

});

const menuLinks = document.querySelectorAll(".header__link");
menuLinks.forEach((link) => {
    link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        
        
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        
        offerContent.style.opacity = '1';
        offerContent.style.visibility = 'visible';
        

        setTimeout(() => {
            menu.classList.remove("active");
            offerContent.classList.remove("active");
        }, 300);
        
        
    });
});
