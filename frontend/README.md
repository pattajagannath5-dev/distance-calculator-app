# Distance Calculator - Frontend

React-based user interface for calculating distances between addresses.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- 🗺️ **Distance Calculator** - Calculate distance between two addresses
- 📊 **Query History** - View and browse past calculations
- 🔍 **Address Autocomplete** - Smart suggestions from history
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Input Validation** - Real-time error checking

## Environment Setup

Create `.env` file:

```env
REACT_APP_API_URL=http://127.0.0.1:8000/api/distance
```

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm build`

Builds the app for production to the `build` folder

### `npm test`

Launches the test runner in interactive watch mode

## Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── DistanceForm.js
│   │   ├── QueryHistory.js
│   │   ├── Pagination.js
│   │   └── SuggestionsList.js
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API client
│   ├── styles/          # CSS stylesheets
│   └── pages/           # Page components
├── public/
└── .env
```

## Tech Stack

- **React** - UI framework
- **Axios** - HTTP client
- **CSS3** - Styling

## API Integration

The frontend connects to the FastAPI backend:

```javascript
// Calculate distance
POST /api/distance/calculate
{
  "address1": "San Francisco, CA",
  "address2": "Palo Alto, CA"
}

// Get history
GET /api/distance/history
```

## Deployment

```bash
# Build for production
npm run build

# Deploy the build folder to your hosting service
```

## Troubleshooting

### Backend Connection Issues

1. Ensure backend is running at `http://127.0.0.1:8000`
2. Verify `REACT_APP_API_URL` in `.env` file
3. Check CORS settings in backend

### Port Already in Use

```bash
# Use different port
PORT=3001 npm start
```

## License

MIT
