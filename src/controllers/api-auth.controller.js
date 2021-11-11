const { Router } = require('express');
const { nanoid } = require('nanoid');
const ErrorResponse = require('../classes/error-response');
const Token = require('../dataBase/models/Token.model');
const User = require('../dataBase/models/User.model');
const { asyncHandler } = require('../middlewares/middlewares');

const router = new Router();

function initRoutes() {
    router.post('/reqistration', asyncHandler(reqistration));
    router.post('/login', asyncHandler(login));
}

async function reqistration(req, res, next) {
    const email = await User.findOne({
        where: {
            email: req.body.email,
        }
    });
    if (email) throw new ErrorResponse('This email is already exist', 400);

    const user = await User.create({
        email: req.body.email,
        password: req.body.password,
    });

    res.status(200).json({
        message: 'Successful registration'
    });
}

async function login(req, res, next) {
    const user = await User.findOne({
        where: {
            email: req.body.email,
            password: req.bode.password,
        }
    });
    if (!user) throw new ErrorResponse('User isnt exist', 404);

    const token = await Token.create({
        userId: req.body.userId,
        value: nanoid(128), // генирируем ключ с помощью наноайди 
    });
    res.status(200).json({
        accessToken: token.value
    });
}

initRoutes();

module.exports = router;