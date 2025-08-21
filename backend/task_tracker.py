from flask import Flask, request, jsonify, send_from_directory
import json
import os

app = Flask(__name__)
DATA_FILE = "tasks.json"

# -------------------------------
# Rutas para servir frontend
# -------------------------------
# Ajusta esta ruta según tu estructura de carpetas:
# Si task_tracker.py está en backend/ y frontend/ está al mismo nivel que backend/
FRONTEND_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../frontend')

# Servir index.html
@app.route('/')
def index():
    return send_from_directory(FRONTEND_FOLDER, 'index.html')

# Servir archivos estáticos (CSS, JS)
@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(FRONTEND_FOLDER, path)

# -------------------------------
# Funciones para manejar tareas
# -------------------------------
def load_tasks():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return []
    return []

def save_tasks(tasks):
    with open(DATA_FILE, "w") as file:
        json.dump(tasks, file, indent=4)

# -------------------------------
# Rutas de API
# -------------------------------
@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify(load_tasks())

@app.route("/tasks", methods=["POST"])
def add_task():
    tasks = load_tasks()
    data = request.json
    new_task = {
        "id": len(tasks) + 1,
        "title": data.get("title"),
        "done": False
    }
    tasks.append(new_task)
    save_tasks(tasks)
    return jsonify(new_task), 201

@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    tasks = load_tasks()
    for task in tasks:
        if task["id"] == task_id:
            task["done"] = not task["done"]
            save_tasks(tasks)
            return jsonify(task)
    return jsonify({"error": "Task not found"}), 404

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    tasks = load_tasks()
    tasks = [task for task in tasks if task["id"] != task_id]
    save_tasks(tasks)
    return jsonify({"message": "Task deleted"})

# -------------------------------
# Ejecutar Flask
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
