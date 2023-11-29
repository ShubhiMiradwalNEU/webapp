const assignmentService = require('../services/assignment-service');

const postAssignment = (req, res) => {
    assignmentService.createAssignment(req, res);
}   

const getAssignment = (req, res) => {
    assignmentService.getAssignment(req, res);
}

const getAssignmentById = (req, res) => {
    assignmentService.getAssignmentById(req, res);
}

const updateAssignment = (req, res) => {
    assignmentService.updateAssignment(req, res);
}
const deleteAssignment = (req, res) => {
    assignmentService.deleteAssignment(req, res);
}

const submissionDetails=(req, res)=>
{
    assignmentService.submissionDetails(req, res);
}

module.exports = {
    postAssignment,
    getAssignment,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    submissionDetails,
}   


