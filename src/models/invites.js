import mongoose, { Schema } from "mongoose";

const inviteSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    visited: {
        type: Boolean,
        required: true,
        default: false
    },
    registered: {
        type: Boolean,
        required: true,
        default: false
    }
});

export default mongoose.model("invites", inviteSchema);
