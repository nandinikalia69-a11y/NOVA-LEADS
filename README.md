# NOVA-LEADS

NOVA-LEADS is a full-stack lead management system built with React, Node.js, Express, MongoDB, and Docker. The project helps manage leads, authentication, and backend APIs in a structured way.

---

## Features

* User authentication
* Lead management system
* Frontend and backend separation
* REST API integration
* Docker support
* MongoDB database connection
* Organized project structure

---

## Tech Stack

### Frontend

* React
* JavaScript
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication

### DevOps

* Docker
* Docker Compose

---

## Project Structure

```text
NOVA-LEADS/
│
├── frontend/
├── backend/
├── docker-compose.yml
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/nandinikalia69-a11y/NOVA-LEADS.git
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Docker Setup

Run complete project using Docker:

```bash
docker-compose up --build
```

---

## Environment Variables

Create `.env` file inside backend folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
```

---

## API Features

* User Registration
* User Login
* Create Lead
* Update Lead
* Delete Lead
* Fetch Leads

---

## Author

NANDINI KALIA

---

## License

This project is developed for learning and internship purposes.
