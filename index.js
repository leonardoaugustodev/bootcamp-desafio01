const express = require("express");

const server = express();
server.use(express.json());

const projects = [];
let count = 0;

server.use((req, res, next) => {
  count += 1;
  console.log(`Count of requests: ${count}`);

  next();
});

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;

  if (projects.findIndex(p => p.id == id) < 0) {
    return res.status(400).json({ error: "Project does not exists!" });
  }

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id: `${id}`, title: `${title}`, tasks: [] });

  return res.json(projects);
});

server.put("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(p => p.id == id);
  projects[index].title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id == id);
  projects.splice(index, 1);

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
