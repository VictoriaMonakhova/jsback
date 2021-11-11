const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const Token = require('../dataBase/models/Token.model');
const User = require('../dataBase/models/User.model');
const { asyncHandler, requireToken } = require('../middlewares/middlewares');

const router = new Router();

function initRoutes() {
    router.get('/me', asyncHandler(requireToken), asyncHandler(getUserInfo));
    router.patch('/me', asyncHandler(requireToken), asyncHandler(updateUserInfo));
    router.post('/logout', asyncHandler(requireToken), asyncHandler(logout));
}

async function getUserInfo(req, res, next) {
    const user = await User.findByPk(req.userId);
    if (!user) throw new ErrorResponse('User not found', 404);
    res.status(200).json(user);
}

async function updateUserInfo(req, res, next) {
    const user = await User.findByPk(req.userId);
    if (!user) throw new ErrorResponse('User not found', 404);

    let updatedInfo = await User.update(req.body, {
        where: {
            id: req.userId,
        },
        returning: true
    })
    res.status(200).json({
        message: 'Updated',
        updatedInfo,
    })
}

async function logout(req, res, next) {
    const user = await User.findByPk(req.userId);
    if (!user) throw new ErrorResponse('User not found', 404);

    await Token.destroy({
        where: {
            id: req.userId,
        }
    });
    res.status(200).json({
        message: 'Deleted'
    });
}

initRoutes();

module.exports = router;