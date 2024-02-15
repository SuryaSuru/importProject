import express from 'express';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const adminCollectionSchema = Schema({
  sponserId: { type: String },
  walletAmount: { type: Number, default: 0 },
  type: { type: String, enum: ['Add', 'WithDrawal'], required: true },
}, {
  timestamps: true
});

const AdminModel = mongoose.model("requests", adminCollectionSchema);

export { AdminModel };
