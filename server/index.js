import express from "express";
import cors from  "cors";

const app = express();
app.use(cors());

app.use(express.json());

let tasks = [
  {
    "id": "04850",
    "title": "Fix Webhook Auto-delete Bug",
    "status": "todo",
    "priority": "🔴 High",
    "startTime": "8:00 am",
    "endTime": "4:00 pm",
    "repository": "matrix-core",
    "assignee": "Alex",
    "completedSteps": 2,
    "totalSteps": 3,
    "actionText": "Clock In"
  },
  {
    "id": "04851",
    "title": "Members Page Integration",
    "status": "in_progress",
    "priority": "⚡ Active",
    "startTime": "9:00 am",
    "endTime": "5:00 pm",
    "repository": "matrix-ui",
    "assignee": "Sam",
    "completedSteps": 1,
    "totalSteps": 2,
    "actionText": "Clock In"
  },
  {
    "id": "04849",
    "title": "Initial Titan Setup",
    "status": "done",
    "priority": "✓ Done",
    "completedDate": "Yesterday",
    "repository": "matrix-core",
    "assignee": "Alex",
    "completedSteps": 3,
    "totalSteps": 3,
    "actionText": "Closed"
  }
]

app.get("/tasks", (req, res) => {
  try {
    if (!tasks) {
      res.status("404").json({ message: "No tasks found" });
    }
    return res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/tasks/create", (req, res) => {
  const { title, description } = req.body;
  try {
    if (tasks.some((task) => task.title == title)) {
      return res.status(400).json({ message: "task already exists" });
    }
    const newTask = { id: Date.now(), title: title, description: description };
    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/tasks/delete/:title", (req, res) => {
  const { title } = req.params;
  try {
    const exist = tasks.some((task) => task.title == title);
    if (!exist) {
      return res.status(404).json({ message: "Task not found" });
    }

    tasks = tasks.filter((task) => task.title !== title);
    return res
      .status(200)
      .json({ message: `Task "${title}" deleted successfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/tasks/update/:title", (req, res) => {
  const { title } = req.params;
  const { updateTitle, updateDescription } = req.body;
  try {
    const index = tasks.findIndex((task) => (task.title === title));
    
    tasks[index] = {...tasks[index], title: updateTitle, description: updateDescription}
    
    return res.status(200).json(updateTask);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(4000, () => {
  console.log("Node server is running!");
});
