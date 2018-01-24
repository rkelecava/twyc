function load () {
    require('./Defaultfood.model');
    require('./User.model');
    require('./Userfood.model');
    require('./Profile.model');
    require('./Meal.model');
}

module.exports = { load };