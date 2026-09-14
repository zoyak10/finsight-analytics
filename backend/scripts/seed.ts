import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { env } from '../src/config/env';
import { Transaction } from '../src/models/Transaction';
import { User } from '../src/models/User';

interface RawTransaction {
  id: number;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
}

async function seed() {
  console.log('\n  FinSight Database Seeder');
  console.log('  ──────────────────────\n');

  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('  ✓ Connected to MongoDB');

    // Clear existing data
    await Transaction.deleteMany({});
    await User.deleteMany({});
    console.log('  ✓ Cleared existing data');

    // Load transactions from JSON
    const jsonPath = path.resolve(__dirname, '../../transactions.json');
    if (!fs.existsSync(jsonPath)) {
      console.error('  ✗ transactions.json not found at:', jsonPath);
      process.exit(1);
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const transactions: RawTransaction[] = JSON.parse(rawData);

    // Insert transactions
    const docs = transactions.map((t) => ({
      id: t.id,
      date: new Date(t.date),
      amount: t.amount,
      category: t.category,
      status: t.status,
      user_id: t.user_id,
      user_profile: t.user_profile,
    }));

    await Transaction.insertMany(docs);
    console.log(`  ✓ Inserted ${docs.length} transactions`);

    // Create demo user
    const demoUser = new User({
      email: 'admin@finsight.com',
      password: 'admin123',
      name: 'Financial Analyst',
      role: 'analyst',
    });

    await demoUser.save();
    console.log('  ✓ Created demo user (admin@finsight.com / admin123)');

    console.log('\n  Seed completed successfully! ✓\n');
  } catch (error) {
    console.error('\n  ✗ Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
