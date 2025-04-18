const mongoose = require('mongoose');
const Task = require('./Task');
require('dotenv').config({ path: '../.env' });

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

(async () => {
  try {
    await connectDB();

    const tasks = await Task.find();
    for (const task of tasks) {
      const validDays = {
        'Everyday': [0, 1, 2, 3, 4, 5, 6],
        'Mon-Fri': [1, 2, 3, 4, 5],
        'Sat-Sun': [0, 6],
      }[task.daysToWorkOn];
      let currentDate = new Date(task.startDate);
      const end = new Date(task.endDate);
      const newProgress = [];

      while (currentDate <= end) {
        if (validDays.includes(currentDate.getDay())) {
          const existing = task.progress.find(p => 
            new Date(p.date).toLocaleDateString('en-CA') === currentDate.toLocaleDateString('en-CA')
          );
          newProgress.push({
            date: new Date(currentDate),
            completed: existing ? existing.completed : false,
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      task.progress = newProgress;

    //   // Recalculate streak
    //   let streak = 0;
    //   let inStreak = false;
    //   for (let i = task.progress.length - 1; i >= 0; i--) {
    //     if (task.progress[i].completed && validDays.includes(new Date(task.progress[i].date).getDay())) {
    //         streak++;
    //         inStreak = true;
    //     } else if (validDays.includes(new Date(task.progress[i].date).getDay()) && inStreak) {
    //         break; // Break on first missed valid day after a streak
    //     }
    //     }
    //   task.streak = streak;
    //   console.log(`Task ${task._id} streak calculated as ${streak}`);

      // Recalculate streak
      let streak = 0;
      let inStreak = false;
      for (let i = task.progress.length - 1; i >= 0; i--) {
        if (task.progress[i].completed && validDays.includes(new Date(task.progress[i].date).getDay())) {
            streak++;
            inStreak = true;
        } else if (validDays.includes(new Date(task.progress[i].date).getDay()) && inStreak) {
            break; // Break on first missed valid day after a streak
        }
        }
      task.streak = streak;
      console.log(`Task ${task._id} streak calculated as ${streak}`);

      await task.save();
    }

    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    mongoose.connection.close();
  }
})();

exports.handler = async (event, context) => {
  try {
    await connectDB();

    const tasks = await Task.find();
    for (const task of tasks) {
      const validDays = {
        'Everyday': [0, 1, 2, 3, 4, 5, 6],
        'Mon-Fri': [1, 2, 3, 4, 5],
        'Sat-Sun': [0, 6],
      }[task.daysToWorkOn];
      let currentDate = new Date(task.startDate);
      const end = new Date(task.endDate);
      const newProgress = [];

      while (currentDate <= end) {
        if (validDays.includes(currentDate.getDay())) {
          const existing = task.progress.find(p => 
            new Date(p.date).toLocaleDateString('en-CA') === currentDate.toLocaleDateString('en-CA')
          );
          newProgress.push({
            date: new Date(currentDate),
            completed: existing ? existing.completed : false,
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      task.progress = newProgress;

      // Recalculate streak
      let streak = 0;
      for (let i = task.progress.length - 1; i >= 0; i--) {
        if (task.progress[i].completed) {
          streak++;
        } else if (validDays.includes(new Date(task.progress[i].date).getDay())) {
          break;
        }
      }
      task.streak = streak;

      await task.save();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: 'Migration completed' }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: 'Migration failed' }),
    };
  }
};