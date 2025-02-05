# Full-Stack Car Rental Website

🎓 **First School Project with Backend**

A comprehensive car rental solution featuring a **microservice-based backend** in **Node.js (Express)**, a **Vue.js + Vuetify frontend**, and **Firebase** for database management and user authentication. The application provides features such as **car search, booking, an admin panel, and real-time notifications**.

**ADMIN ACCOUNT MUST BE CREATED VIA FIREBASE**

## Firebase Setup
Make sure you configure your Firebase credentials by adding them to your .env files or within the appropriate service files.

## Features

**User Features:**
- Search for available cars based on location, date, and car type
- Book a car with a simple and intuitive UI
- Real-time notifications for booking updates
- Secure authentication via Firebase

**Admin Features:**
- Manage car listings and availability
- Manage reservations
- Monitor real-time updates and notifications

**Tech Stack:**
- **Frontend:** Vue.js + Vuetify
- **Backend:** Node.js (Express) with a microservices architecture
- **Database & Auth:** Firebase
- **Real-time Notifications:** Socket.io

## Quick Start with Docker

To run the entire project, simply use:

```sh
docker-compose up --build