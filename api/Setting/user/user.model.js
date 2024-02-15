import express from 'express';
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: [true, "Please enter company_id"] },
  sponserId: { type: String },
  wallet: { type: Number, default: 0 },
  userName: { type: String, required: true },
  position: { type: String, enum: ['Left', 'Right'] },
  type: { type: String, enum: ['Admin', 'User'], required: true },
  contactNumber: { type: Number },
  location: { type: String },
  emailAddress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  disabled: { type: Boolean, default: false },
}, {
  timestamps: true
});

export default model("User", userSchema)
