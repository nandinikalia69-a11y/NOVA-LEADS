
Anshu Chowdhury
11:26 PM (0 minutes ago)
to me

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

# API Documentation

## Base URL

```bash
http://localhost:5000/api

1. Register User
Endpoint
POST /auth/register
Description

Registers a new user in the system.

Request Body
{
  "name": "Nandini Kalia",
  "email": "nandini@gmail.com",
  "password": "123456"
}
Success Response
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token"
}
Error Response
{
  "success": false,
  "message": "User already exists"
}
2. Login User
Endpoint
POST /auth/login
Description

Authenticates the user and returns a JWT token.

Request Body
{
  "email": "nandini@gmail.com",
  "password": "123456"
}
Success Response
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token"
}
Error Response
{
  "success": false,
  "message": "Invalid credentials"
}
Authorization

Protected APIs require JWT token in headers.

Header Format
Authorization: Bearer your_jwt_token
Leads Management APIs

The Leads module supports full CRUD operations with filtering, search, sorting, and pagination.

Lead Model
Fields
Field Type Description
name String Lead name
email String Lead email
status String New / Contacted / Qualified / Lost
source String Website / Instagram / Referral
createdAt Date Lead creation date
1. Create Lead
Endpoint
POST /leads
Description

Creates a new lead.

Request Body
{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "status": "New",
  "source": "Instagram"
}
Success Response
{
  "success": true,
  "message": "Lead created successfully",
  "lead": {
    "_id": "123456",
    "name": "Rahul Sharma",
    "email": "rahul@gmail.com",
    "status": "New",
    "source": "Instagram"
  }
}
2. Get All Leads
Endpoint
GET /leads
Description

Returns all leads with support for:

Pagination
Search
Filtering
Sorting
Query Parameters
Parameter Type Description
page Number Current page number
limit Number Records per page
status String Filter by lead status
source String Filter by lead source
search String Search by name or email
sort String latest / oldest
Example Request
GET /leads?page=1&limit=10&status=Qualified&source=Instagram&search=Rahul&sort=latest
Success Response
{
  "success": true,
  "totalLeads": 25,
  "currentPage": 1,
  "totalPages": 3,
  "leads": []
}
3. Get Single Lead
Endpoint
GET /leads/:id
Description

Returns details of a single lead.

Success Response
{
  "success": true,
  "lead": {
    "_id": "123456",
    "name": "Rahul Sharma",
    "email": "rahul@gmail.com",
    "status": "Qualified",
    "source": "Referral"
  }
}
4. Update Lead
Endpoint
PUT /leads/:id
Description

Updates an existing lead.

Request Body
{
  "status": "Qualified"
}
Success Response
{
  "success": true,
  "message": "Lead updated successfully"
}
5. Delete Lead
Endpoint
DELETE /leads/:id
Description

Deletes a lead from the system.

Success Response
{
  "success": true,
  "message": "Lead deleted successfully"
}
Pagination

Backend pagination is implemented using:

skip()
limit()
Default Configuration
Setting Value
Records Per Page 10
Filtering & Search

The application supports advanced filtering and searching.

Supported Filters
Filter by Status
Filter by Source
Search by Name
Search by Email
Sort by Latest
Sort by Oldest
Example
GET /leads?status=Qualified&source=Instagram&search=Rahul
Role-Based Access Control (RBAC)

Two roles are implemented:

Role Permissions
Admin Full Access
Sales User Limited Access
Permissions Table
Action Admin Sales User
View Leads ✅ ✅
Create Leads ✅ ✅
Update Leads ✅ ✅
Delete Leads ✅ ❌
Error Handling

Centralized error handling is implemented across the application.

Standard Error Response
{
  "success": false,
  "message": "Something went wrong"
}
Additional Features
Implemented Features
JWT Authentication
Password Hashing using bcrypt
Protected Routes
CRUD Operations
Advanced Filtering
Debounced Search
Pagination
CSV Export Functionality
Role-Based Access Control
Docker Support
Responsive Dashboard UI
Form Validation
Loading States
Error Handling UI
RESTful API Design
Docker Support

The project supports Docker and Docker Compose setup.

Run Project using Docker
docker-compose up --build
Environment Variables

Create a .env file inside the backend directory.

Example
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

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
https://github.com/nandinikalia69-a11y/NOVA-LEADS.git
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
