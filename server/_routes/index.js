function load(app) {
    app.use('/api/v1/defaultfood', require('./defaultfood.routes'));
    app.use('/api/v1/user', require('./user.routes'));
    app.use('/api/v1/userfood', require('./userfood.routes'));
    app.use('/api/v1/profile', require('./profile.routes'));
    app.use('/api/v1/meal', require('./meal.routes'));
    app.use('/api/v1/entry', require('./entry.routes'));
}

module.exports = { load };