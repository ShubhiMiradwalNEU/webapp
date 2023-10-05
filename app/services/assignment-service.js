const { response } = require("../app");
const assignment = require("../model/assignment-model");
const assignmentController = require('../controller/assignment-controller');
const user = require('../model/user-model');
const {findByEmail, findUserfromassignmentid, findpassword} = require('../services/user-service');
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
        // console.log('passwordmismatch')
        // console.log(password);
        // console.log(authenticatedUser.password);
        return res.status(401).end();
    }
    else{
        if(req.body.points>10||req.body.points<0 ||
            'assignment_created' in req.body || 
            'assignment_updated' in req.body 
            )
        {
            return res.status(403).end();
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

            res.status(200).json({ data: responseData });
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
        return res.status(401).end();
    }

    const match = await bcrypt.compare(password, authenticatedUser.password);


    if(!match)
    {
        console.log(password);
        console.log(authenticatedUser.password);
        console.log("**************user**************")
        return res.status(401).end();
    }

    const assignmentID=req.params.id;
    const user_idd=findUserfromassignmentid(assignmentID);
    console.log(user_idd);
    console.log(authenticatedUser.user_id);

    if(authenticatedUser.user_id!=user_idd)
    {
        console.log("**************user**************")
        return res.status(401).send({message: 'Forbidden'});
    }
    else
    {
        assignment.destroy({
            where: {
                id: req.params.id
            }
        }).then((response) => {
            if (response === 0) {
                res.status(404).end();
            } else {
                res.status(200).end();
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
        return res.status(401).send({message: 'Forbidden'});
    }
    const encoded=authorization.substring(6);
    const decoded=Buffer.from(encoded, 'base64').toString('ascii');
    const[email, password]=decoded.split(':');
    const authenticatedUser = await findByEmail(email);
    if(!authenticatedUser){
        return res.status(401).send({message: 'Forbidden'});
    }
    const match = await bcrypt.compare(password, authenticatedUser.password);

    if(!match)
    {
        console.log(password);
        console.log(authenticatedUser.password);
        console.log("**************user**************")
        return res.status(401).send({message: 'Forbidden'});
    }

    const assignmentID=req.params.id;
    const user_idd=findUserfromassignmentid(assignmentID);
    console.log(user_idd);
    console.log(authenticatedUser.user_id);

    if(authenticatedUser.user_id!=user_idd)
    {
        return res.status(401).send({message: 'Forbidden'});
    }
    else
    {
        if(req.body.points>10||req.body.points<0)
        {
            return res.status(403).end();
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
                    res.status(200).end();
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