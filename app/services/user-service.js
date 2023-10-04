const assignment = require('../model/assignment-model');
const User = require('../model/user-model');

const findByEmail =  (email) =>  {
    console.log(User);
    return  User.findOne({ where: { email: email } });
}

const findUserfromassignmentid = (id) => {
    const Assignment= assignment.findOne({where: {id: id}});
    return  Assignment.user_id;

}
module.exports = {findByEmail, findUserfromassignmentid};