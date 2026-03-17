import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        file: {
            type: String,
        },
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        dislikes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        status: {
            type: String,
            enum: ["pending", "resolved"],
            default: "pending",
        },
        hostel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hostel",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;