const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function verifyId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).send();
  }

  const index = repositories.findIndex(repo => repo.id === id);

  if(index < 0){
    return response.status(400).send();
  }

  request.index = index;

  return next();
}

app.use('/repositories/:id', verifyId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const index = request.index;
  const { title, url, techs } = request.body;

  const repository = repositories[index];
  
  repository.title = title;
  repository.url = url;
  repository.techs = techs; 

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const index = request.index;
  
  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const index = request.index;

  const repository = repositories[index]
  
  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
