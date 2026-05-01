// 1. LÓGICA DEL MENÚ (Funciona en todas las páginas)
const btnMenu = document.getElementById('btn-menu');
const menuLinks = document.getElementById('menu-links');

if (btnMenu && menuLinks) {
    btnMenu.addEventListener('click', () => {
        menuLinks.classList.toggle('activo');
    });
}

// 2. LÓGICA DE AGREGAR PRODUCTOS (Para catalogo.html)
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const botonesAgregar = document.querySelectorAll('.btn-agregar');
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const nombre = e.target.getAttribute('data-nombre');
        const precio = parseInt(e.target.getAttribute('data-precio'));

        const existe = carrito.find(item => item.id === id);
        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({ id, nombre, precio, cantidad: 1 });
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        alert(`${nombre} se agregó al carrito`);
    });
});

// 3. LÓGICA DE MOSTRAR PRODUCTOS (Para carrito.html)
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');

// Esta función solo corre si estamos en la página del carrito
if (listaCarrito) {
    const renderizarCarrito = () => {
        listaCarrito.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            carrito.forEach((item, index) => {
                total += item.precio * item.cantidad;
                listaCarrito.innerHTML += `
                    <div class="item-carrito" style="background: #D9D9D9; margin-bottom: 10px; padding: 10px; border-radius: 8px; color: #05374C;">
                        <p><strong>${item.nombre}</strong> - $${item.precio} x ${item.cantidad}</p>
                        <button onclick="eliminarDelCarrito(${index})" style="background: #3A807A; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>
                    </div>
                `;
            });
        }
        totalCarrito.innerHTML = `<h3 style="color: white;">Total: $${total}</h3>`;
    };

    // Función global para que el botón de eliminar funcione
    window.eliminarDelCarrito = (index) => {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    };

    renderizarCarrito();
}

// Botón para vaciar (si existe)
const btnVaciar = document.getElementById('vaciar-carrito');
if (btnVaciar) {
    btnVaciar.addEventListener('click', () => {
        localStorage.removeItem('carrito');
        carrito = [];
        location.reload(); // Recarga para limpiar la vista
    });
}
