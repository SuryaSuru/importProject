import mongoose from "mongoose";

const { Schema } = mongoose;

const companySchema = Schema({
  companyName: { type: String, required: true },
  contactNumber: { type: Number, required: true },
  emailAddress: { type: String, required: true, unique: true },
  userSponser_id: [{ type: String }],
  // item_id:[ { type: mongoose.Schema.Types.ObjectId, ref: "Items" }],
  disabled: { type: Boolean, default: false },
}, {
  timestamps: true
});

export default mongoose.model("Company", companySchema);
