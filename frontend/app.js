const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const newTaskInput = document.getElementById("newTask");

const API_URL = "http://127.0.0.1:5000/tasks";

// Cargar tareas desde backend
async function loadTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    taskList.innerHTML = "";
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item" + (task.done ? " done" : "");
        li.innerHTML = `
            <span>${task.title}</span>
            <div>
                <button onclick="toggleTask(${task.id})">${task.done ? "Reabrir" : "Hecho"}</button>
                <button onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Agregar tarea
async function addTask() {
    const title = newTaskInput.value.trim();
    if (!title) return alert("Escribe una tarea");
    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
    });
    newTaskInput.value = "";
    loadTasks();
}

// Marcar tarea como hecha/reabrir
async function toggleTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "PUT" });
    loadTasks();
}

// Eliminar tarea
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadTasks();
}

addBtn.addEventListener("click", addTask);
loadTasks();
