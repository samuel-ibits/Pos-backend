import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    notes: { type: String, required: true },
    percentage: { type: String, required: true },
});

export const ReportModel = mongoose.model("report", reportSchema);
