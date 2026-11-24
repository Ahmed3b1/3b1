import mongoose, { Schema, model, models } from "mongoose";

const TemplateSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        difficulty: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner",
        },
        triggerNode: {
            type: String,
            required: true,
        },
        version: {
            type: Number,
            default: 1,
        },
        nodes: {
            type: [Schema.Types.Mixed],
            default: [],
        },
        edges: {
            type: [Schema.Types.Mixed],
            default: [],
        },
        viewport: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
            zoom: { type: Number, default: 1 }
        },
        isPopular: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Template = models.Template || model("Template", TemplateSchema);

export default Template;