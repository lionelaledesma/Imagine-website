// 1. LÓGICA DEL MENÚ (Funciona en todas las páginas)
const btnMenu = document.getElementById("icon-menu");
const menuLinks = document.getElementById("menu-links");

if (btnMenu && menuLinks) {
    btnMenu.addEventListener('click', () => {
        menuLinks.classList.toggle('activo');
    });
}

// 2. LÓGICA DE AGREGAR PRODUCTOS (Para catalogo.html)
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const contadorDOM = document.getElementById('contador-carrito');

function actualizarBurbujaContador() {
    if (!contadorDOM) {
        return;
    }

    const totalProductos = carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);

    contadorDOM.textContent = totalProductos;

    if (totalProductos === 0) {
        contadorDOM.style.display = 'none';
    }
    else {
        contadorDOM.style.display = 'flex';
    }
}

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
        
        actualizarBurbujaContador(); 

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
                    <div class="item-carrito">
                        <p><strong>${item.nombre}</strong> - $${item.precio} x ${item.cantidad}</p>
                        <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">Eliminar</button>
                    </div>
                `;
            });
        }
        totalCarrito.innerHTML = `<h3 class="tx-total-carrito">Total: $${total}</h3>`;
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
    btnVaciar.addEventListener('click', function() {
        localStorage.removeItem('carrito');
        carrito = [];
        location.reload(); // Recarga para limpiar la vista
    });
}

// BOTON PARA FINALIZAR COMPRA
// 5. LÓGICA DE CONFIRMACIÓN DE COMPRA EN PANTALLA (Para carrito.html)
const btnFinalizar = document.getElementById('finalizar-compra');
const contenedorCarritoElemento = document.querySelector('.contenedor-carrito'); // Tu caja original del carrito
const contenedorConfirmacion = document.getElementById('confirmacion-compra');
const detalleRecibo = document.getElementById('detalle-recibo');
const btnEnviarWA = document.getElementById('btn-enviar-pedido-wa');

if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
        // Control de UX: Evitar compras vacías
        if (carrito.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        let totalPedido = 0;
        let listaTextoProductos = "";

        // 1. Calculamos el total y armamos la lista de texto
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            totalPedido += subtotal;
            listaTextoProductos += `- ${item.nombre} (x${item.cantidad}) - $${subtotal}\n`;
        });

        // 2. Generamos un número de pedido aleatorio entre 1000 y 9999 para que parezca un sistema real
        const numeroPedido = Math.floor(Math.random() * 9000) + 1000;

        // 3. Inyectamos la información clara en la pantalla del usuario (UX)
        detalleRecibo.innerHTML = `
            <p style="margin: 15px 0;"><strong>Número de pedido:</strong> #${numeroPedido}</p>
            <p>¡Guardalo!</p>
            <p style="margin: 15px 0; font-size: 1.3rem; color: var(--color-acento);">
                <strong>Total a pagar:</strong> $${totalPedido}
            </p>
        `;

        // 1. Creamos un objeto con los datos exactos que querés recibir en tu mail
        const datosParaElMail = {
            pedidoNumero: `#${numeroPedido}`,
            productos: listaTextoProductos,
            totalPagar: `$${totalPedido}`
        };

        // 2. Usamos fetch para mandar estos datos en segundo plano a tu puente de mails
        fetch("https://formspree.io/f/xlgyqdvq", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(datosParaElMail) // Transformamos el objeto a texto para el envío
        })
        .then(respuesta => {
            if (respuesta.ok) {
                console.log("Pedido guardado en tu mail con éxito.");
            }
        })
        .catch(error => {
            console.error("Hubo un error al respaldar el pedido:", error);
        });


        // 6. CAMBIO VISUAL (Ocultamos el carrito vacío y mostramos el recibo)
        contenedorCarritoElemento.style.display = 'none'; // Oculta la lista vieja
        contenedorConfirmacion.className = "sec-descripcion"; // Le quita el 'mensaje-oculto' y aplica tus estilos

        // 7. Vaciamos el localStorage para que el carrito quede limpio para la próxima
        localStorage.removeItem('carrito');
        // Nota de UX: No recargamos la página con location.reload() acá para que el usuario pueda ver sus datos tranquilo en pantalla antes de irse a WhatsApp.
    });
    if (btnEnviarWA) {
        btnEnviarWA.addEventListener('click', () => {
            location.reload()
        });
    }
}


// 4. LÓGICA DE VALIDACIÓN Y CONFIRMACIÓN DE CONTACTO
const formContacto = document.getElementById("formulario-contacto");
const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");
const inputNombre = document.getElementById("nombre")

if (formContacto && mensajeConfirmacion) {
    formContacto.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita que la página se recargue
        const nombre = inputNombre.value;
        // Simulación de envío exitoso
        mensajeConfirmacion.textContent = `¡Gracias ${nombre} por comunicarte! Tu mensaje fue enviado con éxito.`;
        mensajeConfirmacion.className = "mensaje-exito"; // Aplica estilos de éxito
        
        formContacto.reset(); // Limpia los campos del formulario
        
        // Desaparece el mensaje después de 5 segundos
        setTimeout(() => {
            mensajeConfirmacion.textContent = "";
            mensajeConfirmacion.className = "mensaje-oculto";
        }, 5000);
    });
}

actualizarBurbujaContador();

