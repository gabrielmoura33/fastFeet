import mongoose from 'mongoose';

const WithdrawSchema = new mongoose.Schema(
  {
    deliveryMan: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: new Date(),
    },
  },
  {
    timestamps: false,
  }
);

export default mongoose.model('Withdraws', WithdrawSchema);
