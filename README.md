# Student Grade Tracker

Student Grade Tracker is a beginner-friendly full-stack CRUD web application for adding, viewing, updating, and deleting subject grades. It uses:

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose

The application also calculates and displays:

- Total number of subjects
- Average marks
- GPA on a 4.0 scale

## Project Folder Structure

```text
student-grade-tracker/
|
|-- backend/
|   |-- config/
|   |   |-- db.js
|   |
|   |-- controllers/
|   |   |-- gradeController.js
|   |
|   |-- models/
|   |   |-- Grade.js
|   |
|   |-- routes/
|   |   |-- gradeRoutes.js
|   |
|   |-- .env
|   |-- .env.example
|   |-- server.js
|
|-- frontend/
|   |-- index.html
|   |-- style.css
|   |-- script.js
|
|-- .gitignore
|-- package.json
|-- README.md
```

## Features

- Add a subject and marks
- View all saved subjects and marks
- Edit existing marks
- Delete a subject entry
- Automatic average marks calculation
- Automatic GPA calculation
- Responsive and clean user interface
- Proper error handling on both frontend and backend

## Backend Files Explanation

### `backend/server.js`

- Starts the Express server
- Connects to MongoDB Atlas
- Serves the frontend files
- Registers API routes
- Handles 404 and server errors

### `backend/config/db.js`

- Contains MongoDB connection logic using Mongoose

### `backend/models/Grade.js`

- Mongoose model for subject name and marks

### `backend/controllers/gradeController.js`

- Contains all CRUD logic
- Calculates summary data like average and GPA

### `backend/routes/gradeRoutes.js`

- Defines API routes for grades

## Frontend Files Explanation

### `frontend/index.html`

- Main page structure
- Form for adding and editing grades
- Dashboard and table for displaying data

### `frontend/style.css`

- Responsive styling for the full application

### `frontend/script.js`

- Uses Fetch API to connect frontend and backend
- Handles add, edit, delete, and display actions

## MongoDB Atlas Connection Setup

1. Create a free account on MongoDB Atlas.
2. Create a new cluster.
3. Create a database user with username and password.
4. Go to `Database` > `Connect` > `Drivers`.
5. Copy your connection string.
6. Open [backend/.env](backend/.env) and replace:

```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
```

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/studentGradeTracker?retryWrites=true&w=majority&appName=Cluster0
```

## Package Installation Commands

Run these commands in the project root:

```bash
npm install
```

For development mode with auto restart:

```bash
npm run dev
```

## How to Run the Project Locally

1. Open terminal in the project folder.
2. Install dependencies:

```bash
npm install
```

3. Update the MongoDB connection string inside [backend/.env](backend/.env).
4. Start the application:

```bash
npm start
```

5. Open your browser and visit:

```text
http://localhost:5000
```

## API Endpoints

### Get all grades

```http
GET /api/grades
```

### Add a new grade

```http
POST /api/grades
Content-Type: application/json
```

Request body:

```json
{
  "subject": "Physics",
  "marks": 88
}
```

### Update a grade

```http
PUT /api/grades/:id
Content-Type: application/json
```

### Delete a grade

```http
DELETE /api/grades/:id
```

## Railway Deployment Setup

1. Push this project to GitHub.
2. Create a new Railway project.
3. Choose `Deploy from GitHub repo`.
4. Select your repository.
5. In Railway variables, add:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
```

6. Railway will run:

```bash
npm install
npm start
```

Because the frontend is served by Express, you only need one Railway service.

## GitHub Upload Commands

```bash
git init
git add .
git commit -m "Create Student Grade Tracker full-stack CRUD app"
git branch -M main
git remote add origin https://github.com/your-username/student-grade-tracker.git
git push -u origin main
```

## Notes for College Submission

- The code uses simple file structure and naming.
- All CRUD operations are included.
- Frontend and backend are properly connected.
- MongoDB stores all subject grade data.
- Fetch API is used for communication.
- Express routes and Mongoose models are used.
- The UI is beginner-friendly and responsive.
## Live demo
https://student-grade-tracer-production.up.railway.app/
