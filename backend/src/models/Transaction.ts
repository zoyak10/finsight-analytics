import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  id: number;
  date: Date;
  amount: number;
  category: 'Revenue' | 'Expense';
  status: 'Paid' | 'Pending';
  user_id: string;
  user_profile: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    id: { type: Number, required: true, unique: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true, enum: ['Revenue', 'Expense'] },
    status: { type: String, required: true, enum: ['Paid', 'Pending'] },
    user_id: { type: String, required: true },
    user_profile: { type: String, required: true },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Indexes for common query patterns
transactionSchema.index({ date: 1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ user_id: 1 });
transactionSchema.index({ amount: 1 });
transactionSchema.index({ category: 1, status: 1 });
transactionSchema.index({ date: 1, category: 1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
