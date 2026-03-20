# Task Manager (MERN)

Simple task manager with REST API and React UI.

## Run
- Server: `cd server && npm start` (PORT 4000)
- Client: `cd client && npm run dev` (http://localhost:5173)
- Env: `MONGODB_URI` optional, defaults to `mongodb://127.0.0.1:27017/taskmanager`

## Data Model
- title: string
- description: string
- status: "pending" | "completed"
- created_at: date

## Validation
- title required, non-empty
- status must be "pending" or "completed"

## Base URL
- http://localhost:4000/api/tasks

## Endpoints

### GET /
- Returns all tasks sorted by created_at desc
- 200
```json
[
  {
    "_id": "663000000000000000000001",
    "title": "Example",
    "description": "Demo",
    "status": "pending",
    "created_at": "2026-03-20T12:00:00.000Z"
  }
]
```

### POST /
- Create a task
- Body
```json
{ "title": "New task", "description": "Optional" }
```
- 201
```json
{
  "_id": "663000000000000000000002",
  "title": "New task",
  "description": "Optional",
  "status": "pending",
  "created_at": "2026-03-20T12:01:00.000Z"
}
```
- 400
```json
{ "error": "Title is required" }
```

### PUT /:id
- Update fields
- Body
```json
{ "title": "Updated", "description": "Text", "status": "completed" }
```
- 200 updated task
- 400 invalid input
- 404 not found

### DELETE /:id
- Delete task
- 204
- 404 not found

### PATCH /:id/toggle
- Toggle status between "pending" and "completed"
- 200 updated task
- 404 not found

## UI
- List tasks with status and date
- Add task with title and description
- Toggle completion via checkbox
