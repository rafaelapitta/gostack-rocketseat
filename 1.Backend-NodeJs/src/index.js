const express = require('express');
const {uuid, isUuid} = require('uuidv4');

const app = express();

app.use(express.json());

/**
 * MÉTODOS HTTP
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 */

 /**
  * Tipos de parâmetros: formas do front-end enviar algum tipo de informação
  * 
  * Query params => filtros e paginação
  * Route params => identificar recursos na hora de deletar ou atualizar
  * Request body => conteúdo na hora de criar ou editar um recurso (JSON)
  */

  /**
   * MIDDLEWARE
   * Interceptador de requisições: interromper totalmente a requisição 
   * OU alterar dados da requisição
   */

  const projects = [];

  function logRequest(request, response, next) {
    const { method, url} = request;
    const logLabel = `[${method.toUpperCase()}] ${url}`
    
    console.time(logLabel);

    next();
    //dispara o próximo middleware
    console.timeEnd(logLabel);

  }

  function validateProjectId (request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
      return response.status(400).json({error: 'Invalid project ID'})
    }

    return next();
  }

  app.use(logRequest);
  app.use('/project/:id', validateProjectId)

app.get('/projects', (request, response) => {
  const {title} = request.query;

  const results = title
  ? projects.filter(project => project.title.includes(title))
  : projects;

  return response.json(results);
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };
  projects.push(project);


  return response.json(project);
});

app.put('/projects/:id', validateProjectId, (request, response) => {
  const {id} = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id == id);
  if (projectIndex < 0) {
    return response.status(400).json({error: 'project not found'})
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete('/projects/:id', validateProjectId, (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id == id);
  if (projectIndex < 0) {
    return response.status(400).json({error: 'project not found'})
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log('👊 server is running');
});