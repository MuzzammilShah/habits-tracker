## 📂 Project Structure and Setup

### Directories

Frontend codes - `/client`

Backend codes - `/server`

Netlify server codes - `/functions`

-----

&nbsp;

## 🧪 Getting Started Locally

### Prerequisites
- Node.js & npm
- MongoDB (local or Atlas)
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/habits-tracker.git
   cd habits-tracker
   ```

2. Install dependencies for both frontend and backend:
    ```
    cd client
    npm install
    cd ../server
    npm install
    ```

3. Add environment variables (.env) in the server/ directory:
    ```
    MONGO_URI=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret-numchars
    USER_EMAIL=your-email-id
    USER_PASSWORD=your-password-for-the-application
    PORT=5000
    ```
    You should create a hashed password by using the script in `server/hash.js` where you can add the password you desire and convert it into the hashed version. Add the hashed version in the `.env` file. Note that only the hashed version is used by the program, but while using the app you can just add the normal password which wasn't hashed.

4. Start the app:
    ```
    # In server/
    npm start

    # In client/ (in another terminal)
    npm start
    ```

NOTE: If you are running it using the above commands, Make sure you change all the URL paths which currently mention `await axios.post('/.netlify/functions/tasks-post', task, {` to `await axios.post('localhost:5000/functions/tasks-post', task, {` in the components of the `/client` directory.

-----

&nbsp;

## 🌐 Hosting on Netlify

### Testing the environment before hosting in production

1. Create a production build of the frontend inside `client/`:
   ```
   npm run build
   ```

2. Test the app locally using Netlify CLI:
   ```
   netlify dev
   ```

> **Note:** Netlify uses its own serverless functions structure for backend endpoints.  
> That's why the `/functions` directory has been created with serverless-compatible handlers.  
> The `netlify.toml` file also defines all necessary redirects and build instructions.


### Hosting on Netlify (Using UI)

1. **Login** to your [Netlify account](https://app.netlify.com/).
2. Click **"Add new site" → "Import an existing project"**.
3. Connect your **GitHub repository** (or drag and drop your local project if not using GitHub).
4. In **"Build settings"**:
   - **Base directory:** leave it blank (empty)
   - **Build command:** `npm run build`
   - **Publish directory:** `client/build`
   - **Functions directory:** `functions`

5. **Add environment variables** manually under **Site Settings → Environment Variables**:
   - `MONGO_URI=your-mongodb-connection-string`
   - `JWT_SECRET=your-jwt-secret-numchars`
   - `USER_EMAIL=your-email-id`
   - `USER_PASSWORD=your-password-for-the-application`

6. **Advanced settings**:
   - Ensure that the `netlify.toml` file is at the project root.  
     This will automatically configure redirects between frontend and backend APIs.

7. **Deploy** your site!

8. After deployment, you can test everything online. If needed, trigger a **"Redeploy"** from the site dashboard after making any changes or a **"Auto-Redeploy"** triggers once you push the code to the main branch on github.

> 📝 **Tip:** If you modify backend logic or environment variables, always trigger a fresh redeploy for changes to take effect properly.

<p align="center">
  <a href="https://www.netlify.com">
    <img src="https://www.netlify.com/img/global/badges/netlify-light.svg" alt="Deploys by Netlify" />
  </a>
</p>

---

&nbsp;

<p align="center">
  Made with ❤️ for personal habit building.
</p>
