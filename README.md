# Document Management System - Frontend

This is the **frontend** of a Document Management System (DMS) built using **React** and **Bootstrap CSS**. It allows users to log in via **OTP**, upload documents, search for documents, and manage files efficiently.  

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [Folder Structure](#folder-structure)
- [License](#license)

---

## Project Overview

This project provides a **user-friendly interface** for a document management system. Users can:

- Login using **OTP authentication**.
- Upload documents with **categories, tags, remarks, and date**.
- Search and preview documents.
- Download individual or multiple files.
- Responsive layout for desktop and mobile devices.

> Note: Backend APIs are handled by the provided `.NET` endpoints.

---

## Features

1. **OTP Login**  
   - Mobile number input
   - OTP input
   - Validation & token storage in `localStorage`

2. **Responsive UI**  
   - Centered login card  
   - Bootstrap CSS for styling  
   - Smooth focus states and buttons

3. **Error Handling**  
   - Alerts for invalid input or failed API calls

4. **Integration Ready**  
   - Designed to connect with backend endpoints for OTP, upload, and search functionality

---

## Tech Stack

- **Frontend:** React.js  
- **Styling:** Bootstrap CSS  
- **State Management:** React Hooks (`useState`, `useEffect`,  `useContext`)  
- **Routing:** React Router v6  
- **HTTP Requests:** Axios

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm or yarn

### Installation

```bash

# Clone the repository
git clone <your-repo-url>
cd <repo-folder>

# Install dependencies
npm install
# or
yarn install

# Run Your Project

npm start

# Run the app in development mode.\

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
