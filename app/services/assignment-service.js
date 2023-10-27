const { response } = require("../app");
const assignment = require("../model/assignment-model");
const assignmentController = require('../controller/assignment-controller');
const user = require('../model/user-model');
const {findByEmail, findUserFromAssignmentId, findpassword,findassignment, findUserIdbyemail} = require('../services/user-service');
const bcrypt = require('bcrypt');
const userservice = require('../services/user-service');

const getAssignment = (req, res) => {
    assignment.findAll({ 
    }).then((response) => {
        const dataWithoutUserId = response.map(item => {
            const { user_id, ...rest } = item.dataValues;
            return rest;
        });
        res.status(200).json({ data: dataWithoutUserId });
    }).catch((error) => {
        console.log(error);
    });     
}

const getAssignmentById = (req, res) => {
    assignment.findByPk(req.params.id).then((response) => {
        if (!response) {
            res.status(404).end();
            return;
        }
        const responseData = { ...response.toJSON() };
        delete responseData.user_id;

        res.status(200).json({ data: responseData });
    }
    ).catch((error) => {
        res.json(error);
    });
}

const createAssignment = async (req, res) => {
    const authorization = req.headers.authorization;
    if(!authorization)
    {
        return res.status(401).end();   
    }
    const encoded=authorization.substring(6);
    const decoded=Buffer.from(encoded, 'base64').toString('ascii');
    const[email, password]=decoded.split(':');
    const authenticatedUser = await findByEmail(email);
    if(!authenticatedUser){
        return res.status(401).end();
    }
    const match = await bcrypt.compare(password, authenticatedUser.password);

    if(!match)
    {
        return res.status(403).end();
    }
    else{
        if(req.body.points>10||req.body.points<0 ||
            'assignment_created' in req.body || 
            'assignment_updated' in req.body ||
            !Number.isInteger(req.body.points) 
            )
        {
            return res.status(400).end();
        }
        else{
            const assignment1 = await assignment.create({
                name: req.body.name,
                points: req.body.points,
                num_of_attempts: req.body.num_of_attempts, 
                deadline: req.body.deadline,
                user_id: authenticatedUser.id
            });
            const responseData = { ...assignment1.toJSON() };
            delete responseData.user_id;

            res.status(201).json({ data: responseData });
    }
}
};

const deleteAssignment = async (req, res) =>  {
    const authorization = req.headers.authorization;
    if(!authorization)
    {
        return res.status(401).end();
    }
    const encoded=authorization.substring(6);
    const decoded=Buffer.from(encoded, 'base64').toString('ascii');
    const[email, password]=decoded.split(':');
    const authenticatedUser = await findByEmail(email);
    if(!authenticatedUser){
        
        return res.status(403).end();
    }

    const match = await bcrypt.compare(password, authenticatedUser.password);

    if(!match)
    {
        return res.status(401).end();
    }

    const assignmentID=req.params.id;
    const assignment_id=await findassignment(assignmentID);

    if(assignment_id==null)
    {
        return res.status(404).json("No assignment found");
    }
    if(assignmentID!=assignment_id.id)

    {
        return res.status(404).json("No assignment found");
    }
    const user_idd=await findUserFromAssignmentId(assignmentID);
    const UserId=await findUserIdbyemail(email)
    console.log(UserId)
    console.log("********");
    console.log(user_idd)

    if(UserId!=user_idd)
    {
        console.log("******")
        return res.status(403).send({message: 'Unauthorized'});
    }
    
    if(UserId==user_idd)
    {
        console.log(authenticatedUser.user_id);
        console.log(user_idd);
        console.log(assignmentID);
        assignment.destroy({
            where: {
                id: req.params.id
            }
        }).then((response) => {
            if (response === 0) {
                res.status(404).end();
            } else {
                res.status(204).end();
            }
        }).catch((error) => {
            console.error('Error deleting assignment:', error);
        });
    }
}



const updateAssignment = async (req, res) => {
    const authorization = req.headers.authorization;
    if(!authorization)
    {
        return res.status(401).end();
    }
    const encoded=authorization.substring(6);
    const decoded=Buffer.from(encoded, 'base64').toString('ascii');
    const[email, password]=decoded.split(':');
    const authenticatedUser = await findByEmail(email);
    if(!authenticatedUser){
        return res.status(401).end();
    }

    const match = await bcrypt.compare(password, authenticatedUser.password);

    if(!match)
    {
        return res.status(401).end();
    }

    const assignmentID=req.params.id;
    const assignment_id=await findassignment(assignmentID);


    if(assignment_id==null)
    {
        return res.status(404).json("No assignment found");
    }
    if(assignmentID!=assignment_id.id)
    {
        return res.status(404).json("No assignment found");
    }

    // const assignmentID=req.params.id;
    const user_idd=await findUserFromAssignmentId(assignmentID);
    const UserId=await findUserIdbyemail(email)
    console.log(UserId)
    console.log(user_idd)


    if(UserId!=user_idd)
    {
        console.log("******")
        return res.status(403).send({message: 'Unauthorized'});
    }


    else
    {
        if(req.body.points>10||req.body.points<0 ||
            'assignment_created' in req.body || 
            'assignment_updated' in req.body ||
            !Number.isInteger(req.body.points)
            )
        {
            return res.status(400).end();
        }
        else{
            assignment.update({
                name: req.body.name,
                points: req.body.points,
                num_of_attempts: req.body.num_of_attempts, 
                deadline: req.body.deadline,
                user_id: authenticatedUser.id
            }, {
                where: {
                    id: req.params.id
                }
            }).then((response) => {
                if (response[0] === 0) {
                    res.status(404).end();
                } else {
                    res.status(204).end();
                }
            }).catch((error) => {
                console.error('Error updating assignment:', error);
            });
    }
}
}


module.exports =
{    
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentById
}