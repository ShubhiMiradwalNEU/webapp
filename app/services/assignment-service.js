const { response } = require("../app");
const assignment = require("../model/assignment-model");
const assignmentController = require('../controller/assignment-controller');
const user = require('../model/user-model');
const {findByEmail, findUserFromAssignmentId, findpassword,findassignment, findUserIdbyemail} = require('../services/user-service');
const bcrypt = require('bcrypt');
const userservice = require('../services/user-service');
const logger = require('../../logger');
const StatsD = require('node-statsd');


const client = new StatsD({
    host: 'localhost',
    port: 8125
});


const getAssignment = async (req, res) => {
    client.increment("Get-Request")
    const authorization = req.headers.authorization;
    if(!authorization)
    {
        logger.error("authorization is needed to perform this operation")
        return res.status(401).end(); 
    }  
    const encoded=authorization.substring(6);
    const decoded=Buffer.from(encoded, 'base64').toString('ascii');
    const[email, password]=decoded.split(':');
    const authenticatedUser = await findByEmail(email);
    if(!authenticatedUser){
        logger.error("unauthorized user performing operation")
        return res.status(401).end();
    }
    const match = await bcrypt.compare(password, authenticatedUser.password);

    if(!match)
    {
        return res.status(403).end();
    }

    assignment.findAll({ 
    }).then((response) => {
        const dataWithoutUserId = response.map(item => {
            const { user_id, ...rest } = item.dataValues;
            return rest;
        });
        logger.info("Get Request for Assignment is called");
        res.status(200).json({ data: dataWithoutUserId });
    }).catch((error) => {
        console.log(error);
    });    
}

const getAssignmentById = async(req, res) => {
    client.increment("Assignment-get-Request-by-ID")
    const authorization = req.headers.authorization;
    if(!authorization)
    {
        logger.error("authorization is needed to perform this operation")
        return res.status(401).end(); 
    }  
    const encoded=authorization.substring(6);
    const decoded=Buffer.from(encoded, 'base64').toString('ascii');
    const[email, password]=decoded.split(':');
    const authenticatedUser = await findByEmail(email);
    if(!authenticatedUser){
        logger.error("unauthorized user performing operation")
        return res.status(401).end();
    }
    const match = await bcrypt.compare(password, authenticatedUser.password);

    if(!match)
    {
        return res.status(403).end();
    }
    
    assignment.findByPk(req.params.id).then((response) => {
        if (!response) {
            logger.error("unauthorized user performing operation")
            res.status(404).end();
            return;
        }
        const responseData = { ...response.toJSON() };
        delete responseData.user_id;
        client.increment("Get-Request")
        logger.info("Get Request for Assignment is called");
        res.status(200).json({ data: responseData });
    }
    ).catch((error) => {
        res.json(error);
    });
}

const createAssignment = async (req, res) => {
    client.increment("Assignment-create-Request")
    const authorization = req.headers.authorization;
    if(!authorization)
    {
        logger.error("authorization is needed to perform create request operation")
        return res.status(401).end();   
    }
    const encoded=authorization.substring(6);
    const decoded=Buffer.from(encoded, 'base64').toString('ascii');
    const[email, password]=decoded.split(':');
    const authenticatedUser = await findByEmail(email);
    if(!authenticatedUser){
        logger.error("unauthorized user performing operation")
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
            !req.body.name ||
            !req.body.points ||
            !req.body.num_of_attempts ||
            !req.body.deadline ||
            !Number.isInteger(req.body.points) ||
            !Number.isInteger(req.body.points) ||
            !Number.isInteger(req.body.num_of_attempts)
            )
        {
            logger.error("points cannot accept string or number greater than 10 or less than 0 or float values")
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

            logger.info("Assignemnent created successfully")

            res.status(201).json({ data: responseData });
    }
}
};

const deleteAssignment = async (req, res) =>  {
    client.increment("delete-Request")
    const authorization = req.headers.authorization;
    if(!authorization)
    {
        logger.error("authorization is needed to perform this operation")
        return res.status(401).end();
    }
    const encoded=authorization.substring(6);
    const decoded=Buffer.from(encoded, 'base64').toString('ascii');
    const[email, password]=decoded.split(':');
    const authenticatedUser = await findByEmail(email);
    if(!authenticatedUser){
        logger.info("Not an authorized user");
        
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
        logger.info("Assignment Id does not exist");
        return res.status(404).json("No assignment found");
    }
    if(assignmentID!=assignment_id.id)
    {
        logger.info("Assignment Id does not exist");
        return res.status(404).json("No assignment found");
    }
    const user_idd=await findUserFromAssignmentId(assignmentID);
    const UserId=await findUserIdbyemail(email)
    console.log(UserId)
    console.log("********");
    console.log(user_idd)

    if(UserId!=user_idd)
    {
        logger.info("Unauthorised user performing operation");
        console.log("******")
        return res.status(403).send({message: 'Unauthorized'});
    }
    
    if(UserId==user_idd)
    {
        logger.info("Request for Deleting an Assignment is called");

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
            logger.info("Get Request for Deleting an Assignment failed because of some error");
            console.error('Error deleting assignment:', error);
        });
    }
}



const updateAssignment = async (req, res) => {
    client.increment("Update-Request")
    logger.info("update Request for Assignment is called");
    const authorization = req.headers.authorization;
    if(!authorization)
    {
        logger.info("Not an authorised user");
        return res.status(401).end();
    }
    const encoded=authorization.substring(6);
    const decoded=Buffer.from(encoded, 'base64').toString('ascii');
    const[email, password]=decoded.split(':');
    const authenticatedUser = await findByEmail(email);
    if(!authenticatedUser){

        logger.info("Not an authorised user");


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
        logger.info("Get Request for update assignment failed because assignemnt is not found");

        return res.status(404).json("No assignment found");

    }
    if(assignmentID!=assignment_id.id)
    {
        logger.info("Get Request for update assignment failed because assignemnt is not found");

        return res.status(404).json("No assignment found");
    }

    const user_idd=await findUserFromAssignmentId(assignmentID);
    const UserId=await findUserIdbyemail(email)
    console.log(UserId)
    console.log(user_idd)


    if(UserId!=user_idd)
    {
        logger.info("Unauthorised user performing operation");

        return res.status(403).send({message: 'Unauthorized'});
    }
    else
    {

        if(req.body.points>10||req.body.points<0 ||
            'assignment_created' in req.body || 
            'assignment_updated' in req.body ||

            !req.body.name ||
            !req.body.points ||
            !req.body.num_of_attempts ||
            !req.body.deadline ||
            !Number.isInteger(req.body.points) ||
            !Number.isInteger(req.body.num_of_attempts)

            )
        {
            return res.status(400).end();
        }
        else{
            logger.info("update Request successfull");
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
                    logger.info("update failed");
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