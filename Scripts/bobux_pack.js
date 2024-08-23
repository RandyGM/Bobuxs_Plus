//bobux_pack.js
const packages = [
    {
        imgSrc: "../Img/Icon.png",
        title: "Bobux 1000 Tickets",
        robux: 100,
        price: 1000
    },
    {
        imgSrc: "../Img/Icon.png",
        title: "Bobux 4000 Tickets",
        robux: 500,
        price: 4000
    },
    {
        imgSrc: "../Img/Icon.png",
        title: "Bobux 8000 Tickets",
        robux: 1000,
        price: 8000
    },
    {
        imgSrc: "../Img/Icon.png",
        title: "Bobux 8400 Tickets",
        robux: 1500,
        price: 8400
    },
    {
        imgSrc: "../Img/Icon.png",
        title: "Bobux 9000 Tickets",
        robux: 2000,
        price: 9000
    }
];

// Función para generar los paquetes
function generatePackages() {
    const container = document.getElementById('packages-container');

    packages.forEach(pkg => {
        const packageDiv = document.createElement('div');
        packageDiv.className = 'package';

        packageDiv.innerHTML = `
            <img src="${pkg.imgSrc}" alt="${pkg.title}" class="img-tier">
            <h2>${pkg.title}</h2>
            <p><span> - ${pkg.robux} Get Bobux -</span></p>
            <p>Price ${pkg.price} Tickets</p>
            <a href="#" class="btn" data-price="${pkg.price}" data-title="${pkg.title}" data-robux="${pkg.robux}" data-bs-toggle="modal" data-bs-target="#purchaseModal">Buy Bobux</a>
        `;

        container.appendChild(packageDiv);
    });

    // Añadir el evento click a los botones de compra
    const buyButtons = document.querySelectorAll('.btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            // Obtener datos del paquete
            const title = this.getAttribute('data-title');
            const price = parseInt(this.getAttribute('data-price'));
            const robux = this.getAttribute('data-robux');

            // Verificar si hay suficientes tickets
            let ticketCount = parseInt(localStorage.getItem('ticketCount')) || 0;

            // Actualizar contenido del modal
            document.getElementById('modal-package-title').textContent = `Package: ${title}`;
            document.getElementById('modal-package-price').textContent = `Price: ${price} Tickets`;
            document.getElementById('modal-package-robux').textContent = `You will receive: ${robux} Bobux`;

            const insufficientTicketsElement = document.getElementById('modal-insufficient-tickets');
            const confirmBtn = document.getElementById('confirm-purchase-btn');

            if (ticketCount >= price) {
                insufficientTicketsElement.style.display = 'none';
                confirmBtn.disabled = false; // Habilitar el botón de confirmación si hay suficientes tickets
            } else {
                insufficientTicketsElement.style.display = 'block';
                confirmBtn.disabled = true; // Deshabilitar el botón de confirmación si no hay suficientes tickets
            }

            confirmBtn.setAttribute('data-price', price);
        });
    });

    // Añadir evento de confirmación de compra al botón en el modal
    document.getElementById('confirm-purchase-btn').addEventListener('click', function() {
        const price = parseInt(this.getAttribute('data-price'));
        handlePurchase(price);
        const modalElement = document.getElementById('purchaseModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide(); // Ocultar el modal después de la compra
    });
}

// Función para manejar la compra de paquetes
function handlePurchase(price) {
    const ticketCountElement = document.getElementById('ticket-count');
    let ticketCount = parseInt(localStorage.getItem('ticketCount')) || 0;

    if (ticketCount >= price) {
        // Reducir el conteo de tickets
        ticketCount -= price;
        ticketCountElement.textContent = ticketCount;
        localStorage.setItem('ticketCount', ticketCount);

        // Guardar los tickets actualizados en la base de datos
        saveTicketsToDatabase(ticketCount);
    }
}

// Función para guardar los tickets en la base de datos
async function saveTicketsToDatabase(ticketCount) {
    const username = localStorage.getItem('username');
    try {
        await fetch('http://localhost:3000/api/updateTickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: username, tickets: ticketCount })
        });
    } catch (error) {
        console.error('Error al guardar los tickets en la base de datos:', error);
    }
}

// Llamar a la función para generar los paquetes cuando se cargue la página
document.addEventListener('DOMContentLoaded', generatePackages);
