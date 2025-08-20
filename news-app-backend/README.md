# News App Backend

## Setup
1. Install dependencies
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/newsapp
   JWT_SECRET=supersecret
   NEWS_API_KEY=your_newsapi_key_here
   ```

3. Seed an admin user:
   ```bash
   npm run seed:admin
   ```

4. Start server (development):
   ```bash
   npm run dev
   ```

Backend runs on: **http://localhost:5000**
