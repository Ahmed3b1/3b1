import mongoose, { Schema, model, models } from "mongoose";

const FlowSchema = new Schema({
    flowId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    description: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    nodes: {
        type: [Schema.Types.Mixed],
        default: [],
    },
    edges: {
        type: [Schema.Types.Mixed],
        default: [],
    },
    published: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

const Flow = models.Flow || model("Flow", FlowSchema)

export default Flow