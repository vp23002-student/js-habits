// =============================================================================
// VARIABLES GLOBALES (ESTADO DE LA APLICACIÓN)
// =============================================================================

// 'const' define una CONSTANTE: un valor que no se puede reasignar.
// Representa el número máximo de hábitos que el usuario puede registrar a la vez.
const MAX_HABITS = 5;

// 'habits' es un arreglo (Array, denotado por []), que almacenará la lista de hábitos creados.
// Aunque sea 'const', podemos agregar o modificar los elementos dentro del arreglo.
const habits = [];

// 'logs' es otro arreglo donde guardaremos el historial de cada vez que se marca un hábito (check-in).
const logs = [];

// 'let' define una VARIABLE MUTABLE: su valor puede cambiar a lo largo del tiempo.
// Este contador empieza en 0 y sirve para darle un número identificador único (ID) a cada hábito.
let habitIdCounter = 0;

// Arreglo con frases de motivación (cadenas de texto o "strings" entre comillas).
const motivationalQuotes = [
    'La fuerza no viene de la capacidad. Viene de la voluntad.',
    'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
    'No esperes. El momento nunca será perfecto.',
    'El único modo de hacer un gran trabajo es amar lo que haces.',
    'El futuro pertenece a quienes creen en la belleza de sus sueños.',
    'Tu tiempo es limitado, no lo desperdicies viviendo la vida de otros.',
    'El fracaso es la oportunidad de empezar de nuevo con más inteligencia.',
    'No cuentes los días, haz que los días cuenten.',
    'La disciplina es el puente entre metas y logros.',
    'Pequeños pasos diarios llevan a grandes cambios.',
    'La persistencia es el camino del éxito.',
    'Hoy es el primer día del resto de tu vida.',
    'El secreto para avanzar es empezar.',
    'Cada día es una nueva oportunidad para ser mejor.',
    'Los límites solo existen en tu mente.',
    'La acción es la clave fundamental para todo éxito.',
    'Transforma tus hábitos, transforma tu vida.',
    'El progreso es progreso, no importa lo pequeño que sea.',
    'La consistencia vence al talento.',
    'Hoy es el mañana que esperabas ayer.',
];

// Variable que guarda la frase motivacional seleccionada al azar para mostrar hoy.
let dailyQuoteText = getRandomQuote();

// =============================================================================
// MÉTODOS Y FUNCIONES DE LÓGICA DE NEGOCIO
// =============================================================================

/**
 * Función fábrica (Factory Function) que crea un objeto de hábito.
 * En JavaScript, un objeto se define con llaves {} y contiene pares clave-valor (propiedades)
 * y funciones internas (llamadas "métodos").
 *
 * @param {string} name - Nombre del hábito (ej. "Leer 20 minutos").
 * @param {string} frequency - Frecuencia del hábito (ej. "diaria").
 * @returns {Object} El nuevo objeto que representa al hábito.
 */
function createHabitObject(name, frequency) {
    return {
        // '++habitIdCounter' suma 1 al contador antes de asignarlo, asegurando IDs: 1, 2, 3...
        id: ++habitIdCounter,
        name: name,
        frequency: frequency,
        // new Date().toISOString() obtiene la fecha y hora actual en formato estándar (ej: "2026-10-10T...").
        createdAt: new Date().toISOString(),
        // Método para cambiar el nombre del hábito. 'this' hace referencia a este mismo objeto.
        rename: function (newName) {
            this.name = newName;
        },
    };
}

/**
 * Agrega un nuevo hábito a la lista global 'habits'.
 * Realiza validaciones antes de crearlo (límite máximo y que el nombre no esté vacío).
 *
 * @param {string} name - Nombre ingresado por el usuario.
 * @param {string} frequency - Frecuencia seleccionada.
 * @returns {Object|null} Retorna el hábito creado o 'null' si hubo un error de validación.
 */
function addHabit(name, frequency) {
    // Verificamos si ya alcanzamos el límite permitido de hábitos
    if (habits.length >= MAX_HABITS) {
        showMessage('Has alcanzado el límite de 5 hábitos', 'error');
        return null;
    }

    // .trim() elimina espacios en blanco al inicio y al final.
    // Verificamos que se haya escrito un texto válido.
    if (!name || name.trim().length === 0) {
        showMessage('El nombre del hábito es obligatorio', 'error');
        return null;
    }

    // Creamos el objeto del hábito y lo añadimos al final del arreglo con .push()
    const habit = createHabitObject(name.trim(), frequency);
    habits.push(habit);
    return habit;
}

/**
 * Registra el cumplimiento (check-in) de un hábito en una fecha específica.
 *
 * @param {number} habitId - Identificador único del hábito.
 * @param {string} date - Fecha en formato 'YYYY-MM-DD'.
 * @returns {Object|null} El registro creado o 'null' si el hábito no existe.
 */
function logHabit(habitId, date) {
    // .find() busca y devuelve el primer elemento del arreglo que cumpla la condición.
    const habit = habits.find((h) => h.id === habitId);

    // Si no se encontró el hábito con ese ID
    if (!habit) {
        showMessage('Hábito no encontrado', 'error');
        return null;
    }

    // Objeto con la información del check-in
    const logEntry = {
        habitId: habitId,
        habitName: habit.name,
        date: date,
        timestamp: new Date().toISOString(),
    };

    // Guardamos el registro en el arreglo global 'logs'
    logs.push(logEntry);
    return logEntry;
}

/**
 * Calcula estadísticas de progreso:
 * - Total de hábitos registrados.
 * - Total de check-ins realizados.
 * - Cuál es el hábito más activo (el que más check-ins tiene).
 *
 * @returns {Object} Un objeto con las estadísticas calculadas.
 */
function getStatistics() {
    // .length devuelve la cantidad de elementos en un arreglo
    const totalHabits = habits.length;
    const totalCheckIns = logs.length;

    let mostActiveHabit = '-';
    if (logs.length > 0) {
        // Creamos un diccionario (objeto) para contar cuántas veces aparece cada hábito: { "Hábito A": 3, "Hábito B": 5 }
        const habitCounts = {};
        logs.forEach((log) => {
            // (habitCounts[log.habitName] || 0) toma el conteo actual o 0 si es la primera vez que aparece
            habitCounts[log.habitName] = (habitCounts[log.habitName] || 0) + 1;
        });

        // Object.entries convierte el objeto en pares [[nombre, total], ...].
        // .sort() los ordena de mayor a menor según el número de check-ins.
        // [0][0] obtiene el nombre del hábito que quedó en primer lugar.
        mostActiveHabit = Object.entries(habitCounts).sort((a, b) => b[1] - a[1])[0][0];
    }

    return {
        totalHabits,
        totalCheckIns,
        mostActiveHabit,
    };
}

/**
 * Muestra un mensaje emergente o notificación en pantalla (tipo éxito o error).
 * Se oculta automáticamente después de 3 segundos usando 'setTimeout'.
 *
 * @param {string} message - Texto del mensaje que verá el usuario.
 * @param {string} type - Tipo de notificación ('success' por defecto, o 'error').
 */
function showMessage(message, type = 'success') {
    // document.getElementById() busca un elemento del HTML por su atributo 'id'
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;

    // setTimeout ejecuta una función después de esperar cierta cantidad de milisegundos (3000ms = 3 segundos)
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000);
}

function renderHabits() {
    // Obtenemos los elementos del DOM donde vamos a insertar el contenido
    const habitsTable = document.getElementById('habitsTable');
    const habitSelect = document.getElementById('habitSelect');
    const createHabitBtn = document.getElementById('openCreateModal');

    // Estado vacío: si todavía no hay ningún hábito creado
    if (habits.length === 0) {
        habitsTable.innerHTML =
            '<p class="empty-state">No hay hábitos. Haz clic en "Crear Hábito" para comenzar.</p>';
        habitSelect.innerHTML = '<option value="">Selecciona un hábito</option>';
        createHabitBtn.style.display = 'block';
        return; // Salimos de la función temprano
    }

    // Ocultar botón de crear hábito si se alcanzó el límite
    if (habits.length >= MAX_HABITS) {
        createHabitBtn.style.display = 'none';
    } else {
        createHabitBtn.style.display = 'block';
    }

    // Obtenemos la lista de fechas del mes actual hasta el día de hoy
    const monthDays = getCurrentMonthDays();

    // Creamos la fila de encabezado de la tabla usando .map() y .join()
    // .map() transforma cada hábito en un fragmento de HTML <span>
    // .join('') une todos los fragmentos en un solo texto continuo
    const headerRow = `
    <div class="habit-row habit-header">
      <span class="habit-day-label">Día</span>
      ${habits.map((habit) => `<span class="habit-name">${habit.name}</span>`).join('')}
    </div>
  `;

    // Generamos las filas de cada día del mes
    const dayRows = monthDays
        .map((date, index) => {
            const dateObj = new Date(date + 'T00:00:00');
            // .padStart(2, '0') asegura que el día tenga 2 dígitos (ej. "01", "02", ..., "10")
            const dayLabel = String(dateObj.getDate()).padStart(2, '0');

            return `
        <div class="habit-row">
          <span class="habit-day">${dayLabel}</span>
          ${habits
                    .map((habit) => {
                        // Filtramos los registros de este hábito y comprobamos si fue completado en esta fecha (.some())
                        const habitLogs = logs.filter((log) => log.habitId === habit.id);
                        const isChecked = habitLogs.some((log) => log.date === date);
                        // Los atributos data-* nos permiten guardar datos personalizados en el HTML
                        return `<div class="habit-checkbox ${isChecked ? 'checked' : ''}" 
                         data-habit-id="${habit.id}" 
                         data-date="${date}"></div>`;
                    })
                    .join('')}
        </div>
      `;
        })
        .join('');

    // Insertamos todo el HTML generado dentro de la tabla
    habitsTable.innerHTML = headerRow + dayRows;

    // Actualizamos las opciones del <select> para que el usuario pueda elegir qué hábito marcar
    habitSelect.innerHTML =
        '<option value="">Selecciona un hábito</option>' +
        habits.map((habit) => `<option value="${habit.id}">${habit.name}</option>`).join('');

    // Conectamos los clics a las nuevas casillas creadas
    attachCheckboxListeners();
}

/**
 * Obtiene todas las fechas desde el día 1 del mes actual hasta el día de hoy.
 *
 * @returns {string[]} Arreglo de fechas en formato ISO 'YYYY-MM-DD' (ej. ["2026-10-01", ...]).
 */
function getCurrentMonthDays() {
    const dates = [];
    const today = new Date(); // Objeto fecha con el momento actual
    const year = today.getFullYear(); // Año actual (ej. 2026)
    const month = today.getMonth(); // Mes actual (en JS va de 0 para Enero a 11 para Diciembre)
    const currentDay = today.getDate(); // Día del mes actual (1 a 31)

    // Ciclo 'for': se repite desde el día 1 hasta el día actual
    for (let day = 1; day <= currentDay; day++) {
        const date = new Date(year, month, day);
        // .toISOString().split('T')[0] convierte la fecha al formato simple 'YYYY-MM-DD'
        dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
}

/**
 * Asigna eventos de clic a cada casilla (checkbox) de la tabla.
 * Permite marcar o desmarcar un hábito directamente haciendo clic en el día.
 */
function attachCheckboxListeners() {
    // document.querySelectorAll() selecciona todos los elementos que tengan la clase CSS '.habit-checkbox'
    document.querySelectorAll('.habit-checkbox').forEach((checkbox) => {
        // addEventListener escucha cuando el usuario hace clic sobre la casilla
        checkbox.addEventListener('click', function () {
            // this.dataset permite leer los valores de 'data-habit-id' y 'data-date' que pusimos en el HTML
            const habitId = parseInt(this.dataset.habitId); // parseInt convierte un texto a número entero
            const date = this.dataset.date;

            // Si la casilla ya estaba marcada, la desmarcamos y borramos el registro
            if (this.classList.contains('checked')) {
                removeLog(habitId, date);
                this.classList.remove('checked');
                showMessage('Check-in removido', 'success');
            } else {
                // Si no estaba marcada, registramos el check-in y agregamos la clase 'checked'
                const log = logHabit(habitId, date);
                if (log) {
                    this.classList.add('checked');
                    showMessage('Check-in registrado', 'success');
                }
            }
        });
    });
}

/**
 * Elimina un registro de check-in específico del arreglo 'logs'.
 *
 * @param {number} habitId - Identificador del hábito.
 * @param {string} date - Fecha del registro a eliminar.
 */
function removeLog(habitId, date) {
    // .findIndex() busca la posición (índice) en el arreglo del registro que coincide.
    // Retorna -1 si no lo encuentra.
    const index = logs.findIndex((log) => log.habitId === habitId && log.date === date);
    if (index !== -1) {
        // .splice(indice, cantidad) elimina 1 elemento en la posición encontrada
        logs.splice(index, 1);
    }
}

/**
 * Actualiza la tarjeta de fecha y hora en el encabezado de la página:
 * Muestra el número de día, el nombre del mes y el nombre del día en español.
 */
function updateDateTime() {
    const now = new Date();
    // Arreglos auxiliares para traducir los números de día y mes a nombres en español
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ];

    // .getDay() retorna 0 para Domingo, 1 para Lunes, etc.
    // .getMonth() retorna 0 para Enero, 1 para Febrero, etc.
    // .getDate() retorna el número del día (1 - 31)
    document.getElementById('dayNumber').textContent = now.getDate();
    document.getElementById('monthName').textContent = months[now.getMonth()];
    document.getElementById('dayName').textContent = days[now.getDay()];
}

/**
 * Selecciona una frase motivacional aleatoria de la lista 'motivationalQuotes'.
 *
 * @returns {string} Frase motivacional aleatoria.
 */
function getRandomQuote() {
    // Math.random() genera un decimal entre 0 y 1.
    // Multiplicado por el total de frases y redondeado hacia abajo con Math.floor(),
    // obtenemos un índice válido al azar entre 0 y el tamaño del arreglo - 1.
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
}

/**
 * Muestra la frase del día en el elemento HTML correspondiente.
 */
function renderQuote() {
    const savedQuote = document.getElementById('savedQuote');
    savedQuote.textContent = dailyQuoteText || 'Escribe tu frase del día...';
}

/**
 * Abre una ventana modal (ventana emergente/formulario) agregando la clase CSS 'active'.
 *
 * @param {string} modalId - El ID del elemento modal en el HTML.
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * Cierra una ventana modal quitando la clase CSS 'active'.
 *
 * @param {string} modalId - El ID del elemento modal en el HTML.
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Configura los "escuchadores de eventos" (event listeners) para abrir y cerrar
 * los modales al hacer clic en los diferentes botones o en el fondo del modal.
 */
function setupModalListeners() {
    // Botón para abrir modal de creación de hábito
    document.getElementById('openCreateModal').addEventListener('click', () => {
        openModal('createHabitModal');
    });

    // Botón para abrir modal de registro de check-in
    document.getElementById('openRegisterModal').addEventListener('click', () => {
        if (habits.length === 0) {
            showMessage('Primero crea un hábito', 'error');
            return;
        }
        openModal('registerModal');
    });

    // Botones con clase '.close-modal' (íconos de X para cerrar)
    document.querySelectorAll('.close-modal').forEach((btn) => {
        btn.addEventListener('click', function () {
            closeModal(this.dataset.modal);
        });
    });

    // Botones de cancelar / cerrar secundarios
    document.querySelectorAll('.btn-secondary').forEach((btn) => {
        btn.addEventListener('click', function () {
            const modalId = this.dataset.modal;
            if (modalId) {
                closeModal(modalId);
            }
        });
    });

    // Cerrar modal al hacer clic en el fondo oscuro exterior (fuera de la ventanita)
    document.querySelectorAll('.modal').forEach((modal) => {
        modal.addEventListener('click', function (e) {
            // 'e.target' es el elemento exacto donde se hizo clic; si es el fondo mismo, cerramos el modal
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

// =============================================================================
// FUNCIÓN PRINCIPAL DE ARRANQUE (INICIALIZACIÓN)
// =============================================================================

/**
 * Inicializa toda la aplicación:
 * - Configura la fecha por defecto en el formulario de check-in.
 * - Muestra la fecha actual.
 * - Activa los eventos de los modales y formularios.
 * - Renderiza los hábitos y la frase del día.
 */
function initApp() {
    // Obtenemos la fecha de hoy en formato 'YYYY-MM-DD' para pre-llenar el campo de fecha
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkInDate').value = today;

    // Actualizamos la fecha del encabezado y preparamos los eventos de los modales
    updateDateTime();
    setupModalListeners();

    // Evento de clic en el botón "Crear Hábito" dentro del modal
    document.getElementById('createHabitBtn').addEventListener('click', () => {
        // Leemos el valor escrito en el campo de texto y el menú de frecuencia
        const name = document.getElementById('habitName').value;
        const frequency = document.getElementById('habitFrequency').value;

        // Intentamos agregar el hábito
        const habit = addHabit(name, frequency);
        if (habit) {
            showMessage(`Hábito "${habit.name}" creado exitosamente`, 'success');
            document.getElementById('habitName').value = ''; // Limpiamos el campo de texto
            renderHabits(); // Redibujamos la tabla
            closeModal('createHabitModal'); // Cerramos la ventana modal

            // Si se alcanzó el límite, mostrar mensaje
            if (habits.length >= MAX_HABITS) {
                showMessage('Has alcanzado el límite máximo de 5 hábitos', 'success');
            }
        }
    });

    // Evento de clic en el botón "Registrar" del modal de check-in
    document.getElementById('checkInBtn').addEventListener('click', () => {
        const habitId = parseInt(document.getElementById('habitSelect').value);
        const date = document.getElementById('checkInDate').value;

        // Validamos que se haya seleccionado un hábito y una fecha
        if (!habitId || !date) {
            showMessage('Selecciona un hábito y una fecha', 'error');
            return;
        }

        // Registramos el check-in
        const log = logHabit(habitId, date);
        if (log) {
            showMessage(`Check-in registrado para ${log.habitName}`, 'success');
            renderHabits(); // Redibujamos la tabla para que aparezca la casilla marcada
            closeModal('registerModal'); // Cerramos el modal
        }
    });

    // Dibujamos la tabla de hábitos inicial y la frase del día
    renderHabits();
    renderQuote();

    console.log('Habit Tracker inicializado');
    console.log('Clase 1: Fundamentos de POO - Objetos literales y modelado básico');
}

// 'DOMContentLoaded' es un evento del navegador que avisa cuando el archivo HTML
// ha terminado de cargarse por completo en memoria. En ese momento, ejecutamos 'initApp'.
document.addEventListener('DOMContentLoaded', initApp);