import { expect } from 'chai';
import mongoose from 'mongoose';

before(async () => {
  // Global test setup
});

after(async () => {
  // Cleanup after all tests
  await mongoose.disconnect();
});

(global as any).expect = expect;