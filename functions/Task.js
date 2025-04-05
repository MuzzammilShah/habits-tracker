const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  name: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  daysToWorkOn: { type: String, required: true, enum: ['Everyday', 'Mon-Fri', 'Sat-Sun'], default: 'Everyday' },
  about: { type: String },
  progress: [{ date: Date, completed: Boolean }],
  streak: { type: Number, default: 0 },
});

module.exports = mongoose.model('Task', taskSchema);

// Ensure connection is handled once per function invocation
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch(err => console.error('MongoDB connection error:', err));
}