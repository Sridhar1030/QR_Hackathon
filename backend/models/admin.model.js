import { Schema, model } from "mongoose";

const AdminDashboardSchema = new Schema(
    {
        breakfast1Count: {
            type: Number,
            required: true,
            default: 0,
        },
        breakfast2Count: {
            type: Number,
            required: true,
            default: 0,
        },
        lunchCount: {
            type: Number,
            required: true,
            default: 0,
        },
        dinnerCount: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

export default model("AdminDashboard", AdminDashboardSchema);