// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const Task = require('./Task');

// const connectDB = async () => {
//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//   }
// };

// const auth = (event) => {
//   const token = event.headers.authorization?.replace('Bearer ', '');
//   if (!token) throw new Error('No token');
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET);
//   } catch (err) {
//     throw new Error('Invalid token');
//   }
// };

// const calculateStreak = (task) => {
//   const today = new Date();
//   const todayStr = today.toISOString().split('T')[0];
//   const validDays = {
//     'Everyday': [0, 1, 2, 3, 4, 5, 6],
//     'Mon-Fri': [1, 2, 3, 4, 5],
//     'Sat-Sun': [0, 6],
//   }[task.daysToWorkOn];

//   // Sort progress by date ascending
//   task.progress.sort((a, b) => new Date(a.date) - new Date(b.date));
//   // Filter progress up to today
//   const pastProgress = task.progress.filter(p => 
//     new Date(p.date).toISOString().split('T')[0] <= todayStr
//   );

//   let streak = 0;
//   for (let i = pastProgress.length - 1; i >= 0; i--) {
//     const progressDate = new Date(pastProgress[i].date);
//     const dateStr = progressDate.toISOString().split('T')[0];
//     if (validDays.includes(progressDate.getDay())) {
//       if (pastProgress[i].completed) {
//         streak++;
//       } else {
//         break; // Streak breaks on a missed valid day
//       }
//     }
//   }
//   return streak;
// };

// exports.handler = async (event, context) => {
//   try {
//     await connectDB();
//     auth(event);

//     // Extract ID from path (e.g., /.netlify/functions/tasks-complete/123)
//     const pathParts = event.path.split('/');
//     const id = pathParts[pathParts.length - 1];
    
//     const task = await Task.findById(id);
//     if (!task) {
//       return {
//         statusCode: 404,
//         body: JSON.stringify({ msg: 'Task not found' }),
//       };
//     }

//     const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
//     const todayDate = new Date();
//     const dayOfWeek = todayDate.getDay();

//     const validDay = {
//       'Everyday': true,
//       'Mon-Fri': dayOfWeek >= 1 && dayOfWeek <= 5,
//       'Sat-Sun': dayOfWeek === 0 || dayOfWeek === 6,
//     }[task.daysToWorkOn];

//     // if (!validDay) {
//     //   return {
//     //     statusCode: 400,
//     //     body: JSON.stringify({ msg: 'Not a valid day to mark this task as done' }),
//     //   };
//     // }

//     // const existingToday = task.progress.find(p => new Date(p.date).toLocaleDateString('en-CA') === today);
//     // const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
//     // const existingYesterday = task.progress.find(p => new Date(p.date).toLocaleDateString('en-CA') === yesterday);

//     // if (!existingToday) {
//     //   task.progress.push({ date: new Date(), completed: true });

//     //   if (existingYesterday && existingYesterday.completed) {
//     //     task.streak = (task.streak || 0) + 1;
//     //   } else if (!existingYesterday) {
//     //     const startDate = new Date(task.startDate).toLocaleDateString('en-CA');
//     //     if (startDate === today) {
//     //       task.streak = 1;
//     //     } else {
//     //       task.streak = 1;
//     //     }
//     //   } else {
//     //     task.streak = 1;
//     //   }

//     //   await task.save();
//     // }
//     if (!existingToday) {
//       const todayUTC = new Date().toISOString().split('T')[0];
//       const validDays = {
//         'Everyday': [0, 1, 2, 3, 4, 5, 6],
//         'Mon-Fri': [1, 2, 3, 4, 5],
//         'Sat-Sun': [0, 6],
//       }[task.daysToWorkOn];
//       const todayDate = new Date();
//       if (!validDays.includes(todayDate.getDay())) {
//         return {
//           statusCode: 400,
//           body: JSON.stringify({ msg: 'Not a valid day to mark this task as done' }),
//         };
//       }
    
//       // Update existing entry or add new if not present
//       // const progressIndex = task.progress.findIndex(p => 
//       //   new Date(p.date).toLocaleDateString('en-CA') === today
//       // );
//       const progressIndex = task.progress.findIndex(p => 
//         new Date(p.date).toISOString().split('T')[0] === todayUTC
//       );
//       if (progressIndex !== -1) {
//         task.progress[progressIndex].completed = true;
//       } else {
//         task.progress.push({ date: new Date(), completed: true });
//       }

//     //   let streak = 0;
//     //   let foundToday = false;
//     //   for (let i = task.progress.length - 1; i >= 0; i--) {
//     //     const prevDate = new Date(task.progress[i].date);
//     //     if (new Date().toLocaleDateString('en-CA') === prevDate.toLocaleDateString('en-CA')) {
//     //       foundToday = true;
//     //     }
//     //     if (task.progress[i].completed && validDays.includes(prevDate.getDay())) {
//     //       streak++;
//     //     } else if (validDays.includes(prevDate.getDay()) && !foundToday) {
//     //       streak = 0; // Reset streak if a valid day is missed before today
//     //     } else if (validDays.includes(prevDate.getDay())) {
//     //       break; // End streak on first missed valid day after today
//     //     }
//     //   }
//     //   task.streak = streak > 0 ? streak : 1; // Set to 1 if completed today, 0 otherwise until next valid day
    
//     //   const prevDay = new Date(todayDate);
//     //   prevDay.setDate(prevDay.getDate() - 1);
//     //   const prevProgress = task.progress.find(p => 
//     //     new Date(p.date).toLocaleDateString('en-CA') === prevDay.toLocaleDateString('en-CA')
//     //   );
//     //   if (prevProgress && !prevProgress.completed && validDays.includes(prevDay.getDay())) {
//     //     task.streak = 1;
//     //   } else if (lastStreak > 0) {
//     //     task.streak = lastStreak + 1;
//     //   } else {
//     //     task.streak = 1;
//     //   }
    
//     //   await task.save();
//     // }
//     // return {
//     //   statusCode: 200,
//     //   body: JSON.stringify(task),
//     // };

//     task.streak = calculateStreak(task);
//     await task.save();
//   }

//   return {
//     statusCode: 200,
//     body: JSON.stringify(task),
//   };

//   } catch (err) {
//     console.error(err);
//     return {
//       statusCode: err.message === 'No token' || err.message === 'Invalid token' ? 401 : 500,
//       body: JSON.stringify({ msg: 'Server error' }),
//     };
//   }
// };

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Task = require('./Task');

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

const auth = (event) => {
  const token = event.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new Error('No token');
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid token');
  }
};

const calculateStreak = (task) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const validDays = {
    'Everyday': [0, 1, 2, 3, 4, 5, 6],
    'Mon-Fri': [1, 2, 3, 4, 5],
    'Sat-Sun': [0, 6],
  }[task.daysToWorkOn];

  task.progress.sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastProgress = task.progress.filter(p => 
    new Date(p.date).toISOString().split('T')[0] <= todayStr
  );

  let streak = 0;
  for (let i = pastProgress.length - 1; i >= 0; i--) {
    const progressDate = new Date(pastProgress[i].date);
    if (validDays.includes(progressDate.getDay())) {
      if (pastProgress[i].completed) {
        streak++;
      } else {
        break;
      }
    }
  }
  return streak;
};

exports.handler = async (event, context) => {
  try {
    await connectDB();
    auth(event);

    const pathParts = event.path.split('/');
    const id = pathParts[pathParts.length - 1];
    
    const task = await Task.findById(id);
    if (!task) {
      return {
        statusCode: 404,
        body: JSON.stringify({ msg: 'Task not found' }),
      };
    }

    const todayUTC = new Date().toISOString().split('T')[0];
    const validDays = {
      'Everyday': [0, 1, 2, 3, 4, 5, 6],
      'Mon-Fri': [1, 2, 3, 4, 5],
      'Sat-Sun': [0, 6],
    }[task.daysToWorkOn];
    const todayDate = new Date();
    if (!validDays.includes(todayDate.getDay())) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: 'Not a valid day to mark this task as done' }),
      };
    }

    const progressIndex = task.progress.findIndex(p => 
      new Date(p.date).toISOString().split('T')[0] === todayUTC
    );
    if (progressIndex !== -1) {
      task.progress[progressIndex].completed = true;
    } else {
      task.progress.push({ date: new Date(), completed: true });
    }

    task.streak = calculateStreak(task);
    await task.save();

    return {
      statusCode: 200,
      body: JSON.stringify(task),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.message === 'No token' || err.message === 'Invalid token' ? 401 : 500,
      body: JSON.stringify({ msg: 'Server error' }),
    };
  }
};