// ======= WhatsApp flotante: mostrar tras scroll + mensaje por horario =======
document.addEventListener('DOMContentLoaded', () => {
  const waBtn = document.querySelector('.whatsapp-float');
  if (!waBtn) return; 

  // 1) Mensaje dinámico según hora local (9 a 18 h "en línea")
  const h = new Date().getHours();
  const enHorario = h >= 9 && h < 18;
  const msg = enHorario ? '¡Respondo ahora!' : 'Fuera de horario, te contesto pronto';
  waBtn.title = `WhatsApp — ${msg}`;
  waBtn.setAttribute('aria-label', `Chatea por WhatsApp — ${msg}`);

  // 🚨 Importante: Reemplaza 527221234567 con tu número real de WhatsApp.
  const telefono = '527221234567'; 
  const texto = encodeURIComponent('Hola, vengo del sitio de Sudaderas. Me interesa una playera.');
  // Esto arma la URL completa con el texto predefinido
  waBtn.href = `https://wa.me/${telefono}?text=${texto}`;

  // 2) Mostrar/ocultar por scroll (aparece al bajar 300px)
  const UMBRAL = 300; // Define a partir de cuántos píxeles de scroll aparece el botón
  const toggleWA = () => {
    if (window.scrollY > UMBRAL) { 
      waBtn.classList.add('show');
    } else {
      waBtn.classList.remove('show');
    }
  };

  // Estado inicial y listener
  toggleWA(); // Llama una vez para verificar si ya hay scroll al cargar
  window.addEventListener('scroll', toggleWA, { passive: true });


  // ====== Lógica para el formulario de pedido (para que el botón funcione) ======
  const formPedido = document.getElementById('formPedido');
  const btnConfirmar = document.getElementById('btnConfirmar');
  const outTotal = document.getElementById('outTotal');
  const outLista = document.getElementById('outLista');
  const outNombre = document.getElementById('outNombre');
  const confirmNombre = document.getElementById('confirmNombre');
  const nombreClienteInput = document.getElementById('nombreCliente');

  // Función para calcular y mostrar el resumen del pedido
  const actualizarResumen = () => {
    const nombre = nombreClienteInput.value.trim() || '—';
    outNombre.textContent = nombre;

    // Obtener datos del formulario
    const modeloSelect = document.getElementById('selModelo');
    const modeloOption = modeloSelect.options[modeloSelect.selectedIndex];
    const modelo = modeloOption ? modeloOption.value : '';
    const precioBase = modeloOption ? parseInt(modeloOption.getAttribute('data-precio')) : 0;
    const talla = document.getElementById('selTalla').value;
    const color = document.getElementById('selColor').value;
    const cantidad = parseInt(document.getElementById('inpCantidad').value) || 0;
    
    const chkNombreNumero = document.getElementById('chkNombreNumero');
    const chkParcheLiga = document.getElementById('chkParcheLiga');
    const envioSelect = document.getElementById('selEnvio');
    const envioPrecio = parseInt(envioSelect.options[envioSelect.selectedIndex].getAttribute('data-precio')) || 0;

    let subtotal = precioBase * cantidad;
    let personalizacion = 0;
    let total = subtotal;

    const listaItems = [];

    if (cantidad > 0 && modelo) {
      listaItems.push(`<li>${cantidad} x ${modelo} (${talla}, ${color}): $${subtotal.toFixed(2)}</li>`);
    } else {
      outLista.innerHTML = `<li class="text-muted">Aún no has generado tu pedido.</li>`;
      outTotal.textContent = '$0';
      btnConfirmar.disabled = true;
      return; // Detener si no hay producto válido
    }

    // Sumar personalizaciones (por prenda)
    if (chkNombreNumero && chkNombreNumero.checked) {
      personalizacion += (parseInt(chkNombreNumero.getAttribute('data-precio')) * cantidad);
    }
    if (chkParcheLiga && chkParcheLiga.checked) {
      personalizacion += (parseInt(chkParcheLiga.getAttribute('data-precio')) * cantidad);
    }

    total += personalizacion;

    if (personalizacion > 0) {
      listaItems.push(`<li>Personalización (Total): $${personalizacion.toFixed(2)}</li>`);
    }

    // Sumar envío (solo una vez)
    total += envioPrecio;
    listaItems.push(`<li>Envío (${envioSelect.value}): $${envioPrecio.toFixed(2)}</li>`);
    
    outLista.innerHTML = listaItems.join('');
    outTotal.textContent = `$${total.toFixed(2)}`;
    btnConfirmar.disabled = false;
  };

  // Ejecutar la actualización cada que cambian los campos del formulario de pedido
  formPedido.addEventListener('input', actualizarResumen);

  // Lógica del botón "Generar pedido"
  formPedido.addEventListener('submit', (e) => {
    e.preventDefault();
    actualizarResumen(); 
  });

  // Lógica del botón "Confirmar pedido" (Modal)
  btnConfirmar.addEventListener('click', () => {
    const nombre = nombreClienteInput.value.trim() || 'Cliente';
    confirmNombre.textContent = nombre;
  });

  // Inicializar el resumen
  actualizarResumen();
});