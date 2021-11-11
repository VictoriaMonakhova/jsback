const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const ToDo = require('../dataBase/models/ToDo.model.');
const { asyncHandler, requireToken, notFound, } = require('../middlewares/middlewares');

const router = new Router();

function initRoutes() {
    router.get('/', asyncHandler(requireToken), asyncHandler(getToDos));
    router.get('/:id', asyncHandler(requireToken), asyncHandler(getToDoById));
    router.post('/', asyncHandler(requireToken), asyncHandler(postToDo));
    router.patch('/:id', asyncHandler(requireToken), asyncHandler(patchTodoById));
    router.delete('/', asyncHandler(requireToken), asyncHandler(deleteToDo));
    router.delete('/:id', asyncHandler(requireToken), asyncHandler(deleteToDoById));
}

async function postToDo(req, res, next) {
    const data = await ToDo.create({
        title: req.body.title,
        userId: req.userId,
        description: req.body.description,
        isDone: req.body.isDone,
        isFavourite: req.body.isFavourite,
        priority: req.body.priority,
    });
    res.status(200).json(data);
}

async function patchTodoById(req, res, next) {
    const data = await ToDo.findOne({
        where: {
            userId: req.userId,
            id: req.params.id,
        },
    });
    if (!data) throw new ErrorResponse('Data not found', 404);

    let updated = await ToDo.update(req.body, {
        where: {
            id: req.params.id,
            userId: req.userId,
        },
        returning: true,
    });
    res.status(200).json({
        message: 'Updated',
        updated: updated
    }
    );
}

async function deleteToDo(req, res, next) {
    await ToDo.destroy({
        where: {
            userId: req.userId,
        }
    });
    res.status(200).json({
        message: 'All todos was deleted'
    });
}

async function deleteToDoById(req, res, next) {
    let data = await ToDo.findByPk(req.params.id);
    if (!data) throw new ErrorResponse('No todo found', 404);

    await ToDo.destroy({
        where: {
            id: req.params.id,
            userId: req.userId,
        },
    });
    res.status(200).json({
        message: 'Deleted'
    });
}

async function getToDos(req, res, next) {
    const todos = await ToDo.findAll({
        where: {
            userId: req.userId
        }
    });
    res.status(200).json({ todos });
}

async function getToDoById(req, res, next) {
    const todo = await ToDo.findOne({
        where: {
            userId: req.userId,
            id: req.params.id,
        },
    });

    if (!todo) {
        throw new ErrorResponse('No todo found', 404);
    }

    res.status(200).json(todo);
}

initRoutes();

module.exports = router;