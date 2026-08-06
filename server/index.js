import express from "express";

const app = express();

app.use(express.json());

let tasks = [
  {
    id: 0,
    title: "home page",
    description:
      "design and implement a great and modern landing page with modern tools and advanced techniques.",
  },
  {
    id: 1,
    title: "signup",
    description:
      "design and implement a great and modern landing page with modern tools and advanced techniques.",
  },
  {
    id: 2,
    title: "login",
    description:
      "design and implement a great and modern landing page with modern tools and advanced techniques.",
  },
];

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
    if (tasks.some(task => task.title==title)) {
        return res.status(400).json({message: "task already exists"});
    }
    const newTask = {id: Date.now(), title: title, description: description}
    tasks.push(newTask);
    res.status(201).json(newTask);

  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Internal server error"});
  }
});

app.delete("/tasks/delete/:title", (req, res)=>{
    const {title} = req.params;
    try{
        const exist = tasks.some(task => task.title == title);
        if(!exist){
            return res.status(404).json({message: "Task not found"});
        }

        tasks = tasks.filter(task => task.title !== title);
        return res.status(200).json({message: `Task "${title}" deleted successfully`});
    } catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
});

app.listen(4000, () => {
  console.log("Node server is running!");
});
