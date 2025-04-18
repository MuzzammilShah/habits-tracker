import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const TaskModal = ({ isOpen, onClose, onSave }) => {
  const [task, setTask] = useState({ name: '', endDate: '', daysToWorkOn: 'Everyday', about: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(task);
    setTask({ name: '', endDate: '', daysToWorkOn: 'Everyday', about: '' });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Habit</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={task.name}
            onChange={(e) => setTask({ ...task, name: e.target.value })}
            placeholder="What habit would you like to develop?"
            required
          />
          <input
            type="date"
            value={task.endDate}
            onChange={(e) => setTask({ ...task, endDate: e.target.value })}
            required
          />
          <select
            value={task.daysToWorkOn}
            onChange={(e) => setTask({ ...task, daysToWorkOn: e.target.value })}
          >
            <option value="Everyday">Everyday</option>
            <option value="Mon-Fri">Mon-Fri</option>
            <option value="Sat-Sun">Sat-Sun</option>
          </select>
          <textarea
            value={task.about}
            onChange={(e) => setTask({ ...task, about: e.target.value })}
            placeholder="About the Habit (provide details and purpose)"
          />
          <div className="button-group">
            <button type="submit">Save Task</button>
            <button className="close-button" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/.netlify/functions/tasks-get', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const tasksWithDates = data.map(task => ({
        ...task,
        progress: task.progress.map(p => ({ ...p, date: new Date(p.date) })),
      }));
      setTasks(tasksWithDates);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task) => {
    setLoading(true);
    setError('');
    try {
      await axios.post('/.netlify/functions/tasks-post', task, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (id) => {
    setLoading(true);
    setError('');
    try {
      console.log('Completing task, ID:', id);
      const response = await axios.post(`/.netlify/functions/tasks-complete/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('Task updated:', response.data);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Helper function to define days based on "Days to Work On"
  const getDaysToWorkOn = (daysToWorkOn) => {
    switch (daysToWorkOn) {
      case 'Mon-Fri':
        return [1, 2, 3, 4, 5];
      case 'Sat-Sun':
        return [6, 0];
      default:
        return [0, 1, 2, 3, 4, 5, 6];
    }
  };

  // Helper function to check if a day is valid
  const isValidDay = (date, daysToWorkOn) => {
    const day = date.getDay();
    const validDays = getDaysToWorkOn(daysToWorkOn);
    return validDays.includes(day);
  };

  // Calculate "Days Left" based on "Days to Work On"
  const calculateDaysLeft = (task) => {
    const today = new Date();
    const end = new Date(task.endDate);
    if (end < today) return 0;

    const daysToWorkOn = getDaysToWorkOn(task.daysToWorkOn);
    let count = 0;
    let current = new Date(today);

    while (current <= end) {
      if (daysToWorkOn.includes(current.getDay())) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  // Render a GitHub-style heatmap
  const renderGraph = (task) => {
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);

    const firstSunday = new Date(start);
    firstSunday.setDate(firstSunday.getDate() - firstSunday.getDay());

    const lastSaturday = new Date(end);
    lastSaturday.setDate(lastSaturday.getDate() + (6 - lastSaturday.getDay()));

    const weeks = [];
    let current = new Date(firstSunday);
    while (current <= lastSaturday) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        if (current < start || current > end) {
          week.push(null);
        } else {
          week.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }

    return (
      <div className="task-graph-wrapper">
        <div className="task-graph">
          <div className="heatmap-weeks">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="heatmap-week">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return (
                      <div
                        key={dayIndex}
                        className="heatmap-day empty"
                        title=""
                      />
                    );
                  }
                  const progress = task.progress.find(
                    (p) =>
                      new Date(p.date).toLocaleDateString('en-CA') ===
                      day.toLocaleDateString('en-CA')
                  );
                  return (
                    <div
                      key={dayIndex}
                      className="heatmap-day"
                      style={{
                        backgroundColor: progress?.completed ? '#34c759' : '#ebedf0',
                        position: 'relative',
                      }}
                    >
                      <span className="tooltip">
                        {day.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <div className="header-container">
        <div className="header-text">
          <h1>Welcome back!</h1>
          <p className="subheader">Which task did you get done today?</p>
        </div>
        <button className="logout-btn" onClick={logout} disabled={loading}>Logout</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      <button className="add-task-btn" onClick={() => setIsModalOpen(true)} disabled={loading}>
        New Habit +
      </button>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addTask}
      />
      {tasks.map(task => {
        const today = new Date();
        const todayDateStr = today.toISOString().split('T')[0];
        const isTodayValid = isValidDay(today, task.daysToWorkOn);
        const todayProgress = task.progress.find(p => 
          new Date(p.date).toISOString().split('T')[0] === todayDateStr
        );
        const isDoneToday = todayProgress && todayProgress.completed;

        // Add console logs for debugging
        console.log(`Task: ${task.name}`);
        console.log('Today:', todayDateStr);
        console.log('Task Progress:', task.progress);
        console.log('Today Progress:', todayProgress);
        console.log('Is Done Today:', isDoneToday);

        return (
          <div key={task._id} className="task-card">
            <h3>{task.name}</h3>
            {renderGraph(task)}
            <p className="task-legend">
              <span className="legend-item">
                <span className="legend-box done"></span>Done
              </span>
              <span className="legend-item">
                <span className="legend-box missed"></span>Missed
              </span>
            </p>
            <div className="task-actions">
              <button
                onClick={() => completeTask(task._id)}
                disabled={!isTodayValid || isDoneToday || loading}
              >
                {isTodayValid ? (isDoneToday ? 'Task Done ✓' : 'Task Done') : 'Not Today'}
              </button>
              <div>
                <span className="task-streak">Streak: {task.streak} <span className="fire">🔥</span></span>
                <span className="task-days-left"> | Days remaining: {calculateDaysLeft(task)}</span>
              </div>
            </div>
            <button
              className="view-details-btn"
              onClick={() => setExpandedTaskId(expandedTaskId === task._id ? null : task._id)}
            >
              View details 
              <span className={`arrow ${expandedTaskId === task._id ? 'rotated' : ''}`}>
                {expandedTaskId === task._id ? '▲' : '▼'}
              </span>
            </button>
            <div className={`task-details ${expandedTaskId === task._id ? 'expanded' : ''}`}>
              <p><strong>Timeline:</strong> {new Date(task.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}<strong> to </strong> {new Date(task.endDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}</p>
              <p><strong>Days to Work On:</strong> {task.daysToWorkOn}</p>
              <p><strong>About:</strong> {task.about || 'No details provided'}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;