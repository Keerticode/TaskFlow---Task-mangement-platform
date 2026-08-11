import { task } from "../models/tasks.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
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
        throw new ApiError(
            400,
            "Title, assignedTo and createdBy are required"
        );
    }

    const newTask = await task.create(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            newTask,
            "Task created successfully"
        )
    );
});

export const getTasks = asyncHandler(async (req, res) => {
    const tasks = await task.find();

    return res.status(200).json(
        new ApiResponse(
            200,
            tasks,
            "Tasks fetched successfully"
        )
    );
});

export const getSingleTasks = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(
            400,
            "Invalid MongoDB ID"
        );
    }

    const singleTask = await task.findById(id);

    if (!singleTask) {
        throw new ApiError(
            404,
            "Task not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            singleTask,
            "Single task fetched successfully"
        )
    );
});

export const updateTasks = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(
            400,
            "Invalid MongoDB ID"
        );
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
        throw new ApiError(
            400,
            "Title, assignedTo and createdBy are required"
        );
    }

    const updatedTask = await task.findByIdAndUpdate(
        id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedTask) {
        throw new ApiError(
            404,
            "Task not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedTask,
            "Task updated successfully"
        )
    );
});

export const deleteTasks = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(
            400,
            "Invalid MongoDB ID"
        );
    }

    const deletedTask = await task.findByIdAndDelete(id);

    if (!deletedTask) {
        throw new ApiError(
            404,
            "Task not found"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedTask,
            "Task deleted successfully"
        )
    );
});