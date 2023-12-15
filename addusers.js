const userdata = new Set(["Sahil"]);

const addUser = function(user) {
    userdata.add(user);
};

module.exports = {
    userdata,
    addUser
};