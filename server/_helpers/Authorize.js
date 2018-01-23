function isAdmin(req, res, next) {
    //console.log(req.payload.roles);
    if (req.payload.roles.indexOf('admin', 0) === -1) {
        return res.status(401).json({
            msg: 'This route requires admin access and you are not authorized.'
        });
    }

    return next();
}

module.exports = { isAdmin };