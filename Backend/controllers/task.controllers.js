import { task } from "../models/tasks.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const createTasks = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        status,
        priority,
        dueDate,
        assignedTo,
        createdBy
    } = req.body;

    if (!title || !assignedTo || !createdBy) {
        return res
            .status(400)
            .json({
                message: "Title, assignedTo and createdBy are required"
            });
    }

    const newTask = await task.create({
        title,
        description,
        status,
        priority,
        dueDate,
        assignedTo,
        createdBy
    });

    console.log("Task successfully created...");

    return res
        .status(201)
        .json({
            message: "Task created successfully",
            task: newTask
        });

});

export const getTasks = asyncHandler(async (req, res) => {
    const tasks = await task.find();

    return res.status(200).json({
        message: "Tasks fetched successfully",
        tasks
    });
});

export const getSingleTasks = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(400)
            .json({
                message: "Invalid MongoDB ID"
            });
    }

    const singleTask = await task.findById(id);

    if (!singleTask) {
        return res
            .status(404)
            .json({
                message: "Task not found"
            });
    }

    return res
        .status(200)
        .json({
            message: "Single task fetched successfully",
            task: singleTask
        });


});

export const updateTasks = asyncHandler(async (req, res) => {

    const { id } = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(400)
            .json({
                message: "Invalid MongoDB ID"
            });
    }

    const {
        title,
        description,
        status,
        priority,
        dueDate,
        assignedTo,
        createdBy
    } = req.body;

    if (!title || !assignedTo || !createdBy) {
        return res
            .status(400)
            .json({
                message: "Title, assignedTo and createdBy are required"
            });
    }

    const updatedTask = await task.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    );

    if (!updatedTask) {
        return res
            .status(404)
            .json({
                message: "Task not found"
            });
    }

    return res
        .status(200)
        .json({
            message: "Task updated successfully",
            task: updatedTask
        });


});

export const deleteTasks = asyncHandler(async (req, res) => {

    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(400)
            .json({
                message: "Invalid MongoDB ID"
            });
    }

    const deletedTask = await task.findByIdAndDelete(id);

    if (!deletedTask) {
        return res
            .status(404)
            .json({
                message: "Task not found"
            });
    }

    return res
        .status(200)
        .json({
            message: "Task successfully deleted"
        });
});