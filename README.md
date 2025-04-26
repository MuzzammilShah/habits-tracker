# 🧠 Habits Tracker

> _"We are what we repeatedly do. Excellence, then, is not an act, but a habit."_

## ℹ️ About

**Habits Tracker** is a web application designed to help build and maintain habits over time — not just complete simple daily tasks.

Unlike traditional task management apps, this project focuses on consistent, repeated actions essential for forming lasting habits. I developed this app for my personal use (and still actively use it), with an emphasis on habit-building rather than simple checklist management.

## 🎯 Concept

When you create a habit:
- You immediately begin tracking it from the day it is created.
- You set an **end date** and select a **frequency**:  
  - **Work Week** (Monday–Friday)  
  - **Weekends** (Saturday–Sunday)  
  - **Entire Week** (Monday–Sunday)

The app ensures you are aligned with your commitment by counting only the days you intend to work on the habit, ignoring break days automatically.

## ✨ Features

- **📈 Dynamic Heatmap Graph**  
  A visual progress tracker modeled after GitHub’s contribution graph to motivate consistency — particularly appealing to developers!

- **🔥 Streak and Days Remaining Counters**  
  Stay motivated with a dynamic streak count and a countdown of the number of habit days remaining (based on your selected frequency).

- **🛡️ Realistic Habit Enforcement**  
  - Habits cannot be deleted from the UI once created.
  - Tasks cannot be marked as completed for past missed days.
  > _(Of course, if you're a developer, you could modify the database manually — but the design encourages honesty!)_

- **💤 Breaks Built In**  
  If you've selected to work only during the work week, the app disables the habit tracking over the weekends — your streak won't be affected during your planned break periods.

- **🗄️ Fully Dynamic Content**  
  All habit data is stored and managed through a **MongoDB** database. No static content — everything is dynamic and database-driven.

## 🛠️ Tech Stack

**Frontend:** <img src ="https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black">

**Backend:** <img src ="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white">
<img src ="https://img.shields.io/badge/Express-000000.svg?style=for-the-badge&logo=Express&logoColor=white">

**Database:** <img src ="https://img.shields.io/badge/MongoDB-47A248.svg?style=for-the-badge&logo=MongoDB&logoColor=white">

**Hosting:** <img src ="https://img.shields.io/badge/Netlify-00C7B7.svg?style=for-the-badge&logo=Netlify&logoColor=white">

The project has been structured and optimized for deployment on Netlify, including adjustments to the directory structure and URL routing.

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td><img src="assets/Screenshot%20(47).png" alt="Login page" width="400"/></td>
      <td><img src="assets/Screenshot%20(49).png" alt="Add new task" width="400"/></td>
    </tr>
    <tr>
      <td><img src="assets/Screenshot%20(58).png" alt="Task marked done" width="400"/></td>
      <td><img src="assets/Screenshot%20(57).png" alt="Task not yet done" width="400"/></td>
    </tr>
    <tr>
      <td colspan="2" align="center">
        <img src="assets/Screenshot%20(45).png" alt="Task details" width="400"/>
      </td>
    </tr>
  </table>
  
  <p><i>Preview of different pages and habit tracking views ✨</i></p>

  <br/>
</div>

## 📂 Project Structure and Setup

For details on setting up and running the project locally, please refer to [`instructions.md`](instructions.md).
