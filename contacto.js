const formulario = document.getElementById('formulario-contacto');
const respuesta = document.getElementById('respuesta');
const boton = formulario.querySelector('button');


function validarFormulario() {
    let valido = true;
    let primerError = null;
    for (const campo of formulario.querySelectorAll('input, textarea')) {
        campo.value = campo.value.trim();
        let aviso = '';
        if (!campo.value) {
            aviso = 'Este campo no puede quedar vacío.';
        } else if (campo.id === 'correo' &&
            (!campo.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value))) {
            aviso = 'Escribe un correo válido, por ejemplo: nombre@ejemplo.com.';
        }
        document.getElementById('error-' + campo.id).textContent = aviso;
        campo.setAttribute('aria-invalid', aviso ? 'true' : 'false');
        if (aviso) {
            valido = false;
            if (!primerError) primerError = campo;
        }
    }
    if (primerError) primerError.focus();
    return valido;
}

// Captura de datos y los envía a la URL de POST.
async function enviarFormulario(evento) {
    evento.preventDefault();
    if (boton.disabled) return;
    respuesta.textContent = '';
    respuesta.className = '';
    if (!validarFormulario()) return;

    const datos = {
        nombre: formulario.elements.nombre.value,
        correo: formulario.elements.correo.value,
        mensaje: formulario.elements.mensaje.value
    };
    boton.disabled = true;
    boton.textContent = 'Enviando...';
    respuesta.textContent = 'Espera un momento, estamos enviando la prueba.';
    const controlador = new AbortController();
    const tiempoLimite = setTimeout(() => controlador.abort(), 15000);
    try {
        const resultado = await fetch(formulario.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify(datos),
            signal: controlador.signal
        });
        if (!resultado.ok) throw new Error('Error del servidor');
        await resultado.json();
        respuesta.className = 'exito';
        respuesta.textContent = '¡Envío de prueba exitoso! El servidor respondió correctamente.';
        formulario.reset();
    } catch (error) {
        respuesta.className = 'fallo';
        respuesta.textContent = 'No se pudo confirmar el envío. Revisa tu conexión e inténtalo nuevamente. Tus datos siguen en el formulario.';
    } finally {
        clearTimeout(tiempoLimite);
        boton.disabled = false;
        boton.textContent = 'Enviar mensaje';
    }
}
formulario.addEventListener('submit', enviarFormulario);
