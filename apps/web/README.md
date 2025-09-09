# Tide Information Web Application

A comprehensive tide tracking application that provides real-time tide predictions, weather conditions, and smart alerts for coastal locations worldwide.

## Features

### Core Features
- **Real-time Tide Predictions**: Get accurate high and low tide times for your nearest coast
- **Location-Based Detection**: Automatically finds the nearest coastal tide station to your location
- **Live Countdown Timer**: Visual countdown to the next tide event with urgent notifications
- **Tide Timeline Chart**: Interactive visualization of tide patterns for the next 24-48 hours
- **Weather Integration**: Current weather conditions including:
  - Air and water temperature
  - Wind speed and direction
  - Wave height and period
  - Humidity and precipitation
  - Visibility and cloud cover

### Novel Features
- **Smart Tide Alerts**: Customizable notifications before high/low tides
  - Set alert timing (15 min to 2 hours before)
  - Choose which tide types to track
  - Optional sound notifications
  - Browser push notifications support

- **Favorite Locations**: Save and quickly switch between coastal spots
  - Store up to 5 favorite locations
  - Quick location switching
  - Search for any coastal location globally

- **Interactive Coast Map**: Visual map showing:
  - Your current location
  - Nearest tide station location
  - Distance to tide station
  - Powered by Leaflet.js and OpenStreetMap

### Technical Features
- **Local Storage Caching**: Stores last known location for faster loading
- **Responsive Design**: Mobile-first approach, works on all devices
- **Dark Mode Support**: Automatic theme switching
- **Timezone Handling**: Correct time display based on location
- **Auto-refresh**: Tide data updates every 5 minutes

## Technologies Used

- **Frontend Framework**: React 19 with TypeScript
- **Routing**: TanStack Router
- **State Management**: TanStack Query (React Query)
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Maps**: Leaflet with react-leaflet
- **Date/Time**: date-fns
- **Notifications**: Sonner for toasts, native Notification API for alerts
- **Build Tool**: Vite

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:3001 in your browser

## Environment Variables

Create a `.env` file with:
```
VITE_SERVER_URL=http://localhost:3000
```

## Usage

1. **Allow Location Access**: Grant browser permission to detect your location
2. **View Tide Information**: See current and upcoming tide times
3. **Set Up Alerts**: Configure notifications for tide events
4. **Save Favorites**: Add frequently checked locations for quick access
5. **Explore Weather**: Check current conditions at the coast

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security & Privacy

- Location data is stored locally in browser storage
- No personal data is sent to external servers
- Secure authentication with session management
- All API calls use secure HTTPS connections