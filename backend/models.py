from dataclasses import dataclass

# Estado permitido: "todo", "in-progress", "done"
@dataclass
class Task:
    id: int
    description: str
    status: str
    createdAt: str
    updatedAt: str
