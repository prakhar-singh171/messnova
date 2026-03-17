import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
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

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;