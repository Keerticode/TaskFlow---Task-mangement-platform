import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
    },

    status: {
        type: String,
        enum: ["todo", "inProgress", "completed"],
        default: "todo"
    },

    priority: {
        type: String,
        enum: ["low", "medium", "high", "critical", "urgent"],
        default: "medium"
    },

    dueDate: {
        type: Date
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

},
    {
        timestamps: true
    }
);

export const task = mongoose.model("task", taskSchema);