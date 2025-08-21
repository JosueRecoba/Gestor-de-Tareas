const taskList = document.getElementById('taskList');
const addBtn = document.getElementById('addBtn');
const newTaskInput = document.getElementById('newTask');

const API_URL = 'http://127.0.0.1:5000/tasks';

// Cargar tareas al inicio
window.onload = () => loadTasks();

// Función para cargar tareas
async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  taskList.innerHTML = '';
  tasks.forEach(task => renderTask(task));
}

// Función para agregar tarea
addBtn.addEventListener('click', async () => {
  const title = newTaskInput.value.trim();
  if (!title) return alert('Ingrese una tarea');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  const newTask = await res.json();
  renderTask(newTask);
  newTaskInput.value = '';
});

// Renderizar tarea en la UI
function renderTask(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.done ? ' done' : '');
  li.dataset.id = task.id;
  li.innerHTML = `
    <span class="task-title">${task.title}</span>
    <div>
      <button class="btn done-btn">${task.done ? 'Desmarcar' : 'Hecho'}</button>
      <button class="btn delete-btn">Eliminar</button>
    </div>
  `;

  // Marcar como hecho
  li.querySelector('.done-btn').addEventListener('click', async () => {
    const res = await fetch(`${API_URL}/${task.id}`, { method: 'PUT' });
    const updatedTask = await res.json();
    li.classList.toggle('done', updatedTask.done);
    li.querySelector('.done-btn').textContent = updatedTask.done ? 'Desmarcar' : 'Hecho';
  });

  // Eliminar tarea
  li.querySelector('.delete-btn').addEventListener('click', async () => {
    await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
    li.remove();
  });

  taskList.appendChild(li);
}
