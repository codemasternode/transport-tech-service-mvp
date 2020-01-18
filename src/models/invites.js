import mongoose, { Schema } from "mongoose";

const inviteSchema = new Schema({
    code: {
        type: String
    },
    from: {
        type: Schema.Types.ObjectId
    },
    to: {
        type: String
    }
});

export default mongoose.model("invites", inviteSchema);
