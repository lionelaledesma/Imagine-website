// Menu
const btnMenu = document.getElementById("icon-menu");
const menuLinks = document.getElementById("menu-links");

if (btnMenu && menuLinks) {
    btnMenu.addEventListener('click', () => {
        menuLinks.classList.toggle('activo');
    });
}

// Contacto
// Mensaje de exito en form
const formContacto = document.getElementById("formulario-contacto");
const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");
const inputNombre = document.getElementById("nombre")

if (formContacto && mensajeConfirmacion) {
    formContacto.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombre = inputNombre.value;
        // Simulación de envío exitoso
        mensajeConfirmacion.textContent = `¡Gracias ${nombre} por comunicarte! Tu mensaje fue enviado con éxito.`;
        mensajeConfirmacion.className = "mensaje-exito";
        
        formContacto.reset();
        
        // Desaparece el mensaje después de 5 segundos
        setTimeout(() => {
            mensajeConfirmacion.textContent = "";
            mensajeConfirmacion.className = "mensaje-oculto";
        }, 5000);
    });
}

// Carrito
// Burbuja en el boton carrito
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

//Agregar productos al carrito
const botonesAgregar = document.querySelectorAll('.btn-agregar');
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const nombre = e.target.getAttribute('data-nombre');
        const precio = parseInt(e.target.getAttribute('data-precio'));

        const existe = carrito.find(item => item.id === id);
        if (existe) {
            existe.cantidad++;
        } 
        else {
            carrito.push({ id, nombre, precio, cantidad: 1 });
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        actualizarBurbujaContador(); 

        alert(`${nombre} se agregó al carrito`);
    });
});

// Lista del pedido
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const accionesCarrito = document.getElementById('acciones-carrito');
const contenedorCarritoElemento = document.querySelector('.contenedor-carrito'); // Tu caja original del carrito
const contenedorConfirmacion = document.getElementById('confirmacion-compra');
const detalleRecibo = document.getElementById('detalle-recibo');
const btnEnviarWA = document.getElementById('btn-enviar-pedido-wa');

if (listaCarrito) {
    const renderizarCarrito = () => {
        listaCarrito.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            listaCarrito.innerHTML = '<p>Tu carrito está vacío.</p>';
            if (totalCarrito) {
                totalCarrito.innerHTML = '';
            }
            if (accionesCarrito) {
                accionesCarrito.innerHTML = '';
            }
        } 
        else {
            carrito.forEach((item, index) => {
                total += item.precio * item.cantidad;
                listaCarrito.innerHTML += `
                    <div class="item-carrito">
                        <p><strong>${item.nombre}</strong> - $${item.precio} x ${item.cantidad}</p>
                        <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">Eliminar</button>
                    </div>
                `;
            });

            if (totalCarrito) {
                totalCarrito.innerHTML = `<h3 class="tx-total-carrito">Total: $${total}</h3>`;
            }
            //Acciones de vaciar carrito y finalizar la compra -- nota: tambien agregar para cancelar compra
            if (accionesCarrito) {
                accionesCarrito.innerHTML = `
                    <button id="vaciar-carrito" class="boton-nav">Vaciar Carrito</button>
                    <button id="finalizar-compra" class="boton-nav btn-finalizar">Finalizar Compra</button>
                `;
            
                const btnVaciar = document.getElementById('vaciar-carrito');
                const btnFinalizar = document.getElementById('finalizar-compra');

                if (btnVaciar) {
                    btnVaciar.addEventListener('click', function() {
                        localStorage.removeItem('carrito');
                        carrito = [];
                        actualizarBurbujaContador();
                        renderizarCarrito();
                    });
                }

                if (btnFinalizar) {
                    btnFinalizar.addEventListener('click', () => {
                        if (carrito.length === 0) {
                            alert('Tu carrito está vacío.');
                            return;
                        }

                        let totalPedido = 0;
                        let listaTextoProductos = "";

                        carrito.forEach(item => {
                            const subtotal = item.precio * item.cantidad;
                            totalPedido += subtotal;
                            listaTextoProductos += `- ${item.nombre} (x${item.cantidad}) - $${subtotal}\n`;
                        });

                        const numeroPedido = Math.floor(Math.random() * 9000) + 1000;

                        // Mensaje de confirmacion del pedido
                        if (detalleRecibo) {
                            detalleRecibo.innerHTML = `
                                <p style="margin: 15px 0;"><strong>Número de pedido:</strong> #${numeroPedido}</p>
                                <p>¡Guardalo!</p>
                                <p style="margin: 15px 0; font-size: 1.3rem; color: var(--color-acento);">
                                    <strong>Total a pagar:</strong> $${totalPedido}
                                </p>
                            `;
                        }

                        // Se envia la informacion a mi mail
                        const datosParaElMail = {
                            pedidoNumero: `#${numeroPedido}`,
                            productos: listaTextoProductos,
                            totalPagar: `$${totalPedido}`
                        };

                        fetch("https://formspree.io/f/xlgyqdvq", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json"
                            },
                            body: JSON.stringify(datosParaElMail)
                        })
                        .then(respuesta => {
                            if (respuesta.ok) {
                                console.log("Pedido guardado en tu mail con éxito.");
                            }
                        })
                        .catch(error => {
                            console.error("Hubo un error al respaldar el pedido:", error);
                        });

                        if (contenedorCarritoElemento) {
                            contenedorCarritoElemento.style.display = 'none';
                        }
                        if (contenedorConfirmacion) {
                            contenedorConfirmacion.className = "sec-descripcion";
                        }

                        localStorage.removeItem('carrito');
                        carrito = [];
                        actualizarBurbujaContador();
                    });
                }
            }
        }
    };

    // Accion para borrar un solo item del carrito
    window.eliminarDelCarrito = (index) => {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderizarCarrito();
    };

    renderizarCarrito();
}

if (btnEnviarWA) {
    btnEnviarWA.addEventListener('click', (e) => {
        setTimeout(() => {
            location.reload();
        }, 400);
    });
}


actualizarBurbujaContador();

