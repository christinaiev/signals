# signals project CrossTech engineering test

## Overview
The backend handles simple API requests fetching tracks and signals data based on the original JSON file that is loaded and parsed.
The basic test runs the server at http://localhost:8080 with CORS enabled for frontend sitting at http://localhost:5173/.

The frontend is focused on displaying the tracks data with links for each track and a separate view for all the uniques signals.
The data coming from the original JSON has duplicate signals with the same id but different ELR and mileage, for simplicity I aggregated them as one signal with different mileage entry.

There is an endpoint to fetch all the tracks associated with a signal, it is not used in the frontend due to lack of time.

API Endpoints:

GET /tracks/        Get all tracks data.

GET /track/:id      Get a track specific data, including signals.

GET /track/:track_id/signal/:signal_id      Get a signal specific data from the specified track, not in use.

GET /signals/       Get all signals data.

GET /signaltracks/:id       Get all the tracks associated with a signal, not in use.

## Getting Started

### Backend
cd backend
go run server.go

### Frontend
cd frontend
npm install
npm run dev

