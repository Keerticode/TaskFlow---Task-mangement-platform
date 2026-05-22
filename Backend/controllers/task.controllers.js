import { task } from "../models/tasks.models.js";
import mongoose from "mongoose";

export const createTasks = async (req, res) => {
    try {
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

    } catch (error) {
        return res
            .status(500)
            .json({
                message: "Server error",
                error: error.message
            });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await task.find();

        return res
            .status(200)
            .json({
                message: "Tasks fetched successfully",
                tasks
            });

    } catch (error) {
        return res
            .status(500)
            .json({
                message: "Server error",
                error: error.message
            });
    }
};

export const getSingleTasks = async (req, res) => {
    try {
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

    } catch (error) {
        return res
            .status(500)
            .json({
                message: "Server error",
                error: error.message
            });
    }
};

export const updateTasks = async (req, res) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({
                    message: "Invalid MongoDB ID"
                });
        }

        const {
            itle,
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

    } catch (error) {
        return res
            .status(500)
            .json({
                message: "Server error",
                error: error.message
            });
    }
};

export const deleteTasks = async (req, res) => {
    try {
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

    } catch (error) {
        return res
            .status(500)
            .json({
                message: "Server error",
                error: error.message
            });
    }
};