const assignment = require('../model/assignment-model');
const User = require('../model/user-model');
const submission = require('../model/submission');
const user = require('../model/user-model');

const findByEmail =  (email) =>  {
    console.log(User);
    return User.findOne({ where: { email: email } });
}

const findUserIdbyemail= async (email)=>   
{
    const user_email= await User.findOne({where: {email: email}});
    return user_email.id
}

const findpassword=(email)=>
{
    return User.password= User.findOne({where: {email: email}});
}

const findassignment= async (id) =>
{
    const user_assignment= await assignment.findOne({where: {id: id}});
    return user_assignment
}

const findUserFromAssignmentId =  async (id) => {

    const assignmentRecord =  await assignment.findOne({ where: { id: id}})
    if (assignmentRecord) {
        return assignmentRecord.user_id;
    } else {
        throw new Error(`Assignment with ID ${id} not found.`);
    }
}

 const getSubmissionById = async (user_id, assignment_id) => {
        const submissions = await submission.findAll({
            where: { user_id: user_id, assignment_id: assignment_id },
        });
        return submissions;
        }

module.exports = {findByEmail, findUserFromAssignmentId, findpassword,findUserIdbyemail, findassignment, getSubmissionById};