# Distance Calculator

A full-stack web application for calculating distances between addresses using geolocation services.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Usage](#usage)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Distance Calculation**: Calculate distances between two addresses in miles, kilometers, or both
- **Address Autocomplete**: Smart suggestions based on historical queries
- **Query History**: View, paginate, and manage all past calculations
- **Data Persistence**: Store all queries in SQLite database
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Comprehensive error messages for invalid inputs
- **Input Validation**: Client and server-side validation

## 🛠 Tech Stack

### Backend

- **Framework**: FastAPI (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **Geocoding**: Geopy (Nominatim)
- **API**: RESTful with CORS support

### Frontend

- **Framework**: React 18
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Styling**: CSS3 (Responsive design)
- **Build Tool**: Create React App

## 📁 Project Structure

```
distance-calculator-app/
├── README.md                          # Project documentation
├── backend/                           # Backend application
│   ├── .env                          # Environment variables
│   ├── .gitignore                    # Git ignore rules
│   ├── README.md                     # Backend documentation
│   ├── requirements.txt              # Python dependencies
│   └── app/
│       ├── config.py                 # Configuration settings
│       ├── database.py               # Database setup
│       ├── main.py                   # FastAPI app initialization
│       ├── models.py                 # SQLAlchemy models
│       ├── schemas.py                # Pydantic schemas
│       ├── routes/
│       │   └── distance.py           # Distance calculation routes
│       └── services/
│           ├── geocoding_service.py  # Geocoding logic
│           └── history_service.py    # History management
└── frontend/                          # Frontend application
    ├── .env                          # Environment variables
    ├── .gitignore                    # Git ignore rules
    ├── README.md                     # Frontend documentation
    ├── package.json                  # NPM dependencies
    ├── public/
    │   └── index.html                # HTML template
    └── src/
        ├── App.js                    # Root component
        ├── index.js                  # React entry point
        ├── index.css                 # Global styles
        ├── components/               # React components
        │   ├── DistanceForm.js       # Distance input form
        │   ├── Pagination.js         # Pagination control
        │   ├── QueryHistory.js       # History display
        │   └── SuggestionsList.js    # Address suggestions
        ├── hooks/                    # Custom React hooks
        │   ├── useAddressSuggestions.js
        │   └── useDistanceCalculation.js
        ├── pages/
        │   └── Home.js               # Home page
        ├── services/
        │   └── api.js                # API client
        └── styles/                   # CSS stylesheets
            ├── DistanceForm.css
            ├── Home.css
            ├── Pagination.css
            ├── QueryHistory.css
            └── SuggestionsList.css
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download](https://www.python.org/)
- **Node.js 14+** - [Download](https://nodejs.org/)
- **npm 6+** - (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Create a virtual environment**

   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**

   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=sqlite:///./distance_calculator.db
DEBUG=False
NOMINATIM_TIMEOUT=10
```

**Environment Variables:**

- `DATABASE_URL`: Database connection string (default: SQLite)
- `DEBUG`: Enable debug mode (default: False)
- `NOMINATIM_TIMEOUT`: Geocoding timeout in seconds (default: 10)

### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://127.0.0.1:8000/api/distance
```

**Environment Variables:**

- `REACT_APP_API_URL`: Backend API endpoint

## 🎯 Running the Application

### Start Backend Server

```bash
cd backend
python -m uvicorn app.main:app --reload
```

Backend will run on: `http://127.0.0.1:8000`

### Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm start
```

Frontend will run on: `http://localhost:3000`

### Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

## 📚 API Documentation

### Health Check

**GET** `/`

```
Returns: { "message": "Distance Calculator API is running" }
```

**GET** `/health`

```
Returns: { "status": "healthy" }
```

### Calculate Distance

**POST** `/api/distance/calculate`

**Request Body:**

```json
{
  "address1": "415 Mission St Suite 4800, San Francisco, CA 94105",
  "address2": "3223 Hanover St Suite 110, Palo Alto, CA 94304"
}
```

**Response:**

```json
{
  "address1": "415 Mission St Suite 4800, San Francisco, CA 94105",
  "address2": "3223 Hanover St Suite 110, Palo Alto, CA 94304",
  "distance_km": 47.54,
  "distance_miles": 29.54,
  "location1": {
    "latitude": 37.7899,
    "longitude": -122.3971
  },
  "location2": {
    "latitude": 37.4419,
    "longitude": -122.143
  }
}
```

### Get Query History

**GET** `/api/distance/history`

**Response:**

```json
{
  "queries": [
    {
      "id": 1,
      "address1": "415 Mission St Suite 4800, San Francisco, CA 94105",
      "address2": "3223 Hanover St Suite 110, Palo Alto, CA 94304",
      "distance_km": 47.54,
      "distance_miles": 29.54,
      "created_at": "2024-01-15T10:30:00"
    }
  ]
}
```

### Clear History

**DELETE** `/api/distance/history/clear`

**Response:**

```json
{
  "message": "All queries cleared successfully"
}
```

## 💻 Usage

### Calculating Distance

1. Open the application in your browser
2. Enter the source address in the first field
3. Enter the destination address in the second field
4. Select preferred unit (Miles, Kilometers, or Both)
5. Click "Calculate Distance"
6. View the result in the Distance column

### Using Address Autocomplete

- As you type an address, suggestions from your query history will appear
- Click any suggestion to select it
- This makes frequent calculations faster

### Viewing History

1. Click "View Historical Queries" button in the top-right
2. Browse through your past calculations
3. Use pagination controls to navigate through pages
4. Click "Clear History" to delete all queries (with confirmation)

## 🔧 Development

### Backend Development

**Key Files:**

- `app/config.py` - Configuration management
- `app/database.py` - Database setup and sessions
- `app/models.py` - SQLAlchemy ORM models
- `app/schemas.py` - Pydantic validation schemas
- `app/routes/distance.py` - API endpoints
- `app/services/geocoding_service.py` - Distance calculations
- `app/services/history_service.py` - Database operations

**Adding a New Endpoint:**

1. Create a new route in `app/routes/`
2. Define Pydantic schemas in `app/schemas.py`
3. Implement business logic in `app/services/`
4. Include the router in `app/main.py`

### Frontend Development

**Key Files:**

- `src/App.js` - Root component
- `src/pages/Home.js` - Main page layout
- `src/components/` - Reusable components
- `src/hooks/` - Custom React hooks
- `src/services/api.js` - API client
- `src/styles/` - CSS stylesheets

**Adding a New Component:**

1. Create component in `src/components/`
2. Create corresponding CSS in `src/styles/`
3. Export from component file
4. Import and use in pages

**Custom Hooks:**

- `useDistanceCalculation()` - Handle distance calculations
- `useAddressSuggestions()` - Manage address suggestions

## 🐛 Troubleshooting

### Backend Issues

**Issue: "Module not found" error**

```bash
# Reinstall dependencies
pip install -r requirements.txt
```

**Issue: Port 8000 already in use**

```bash
# Use a different port
python -m uvicorn app.main:app --reload --port 8001
```

**Issue: Database locked error**

```bash
# Delete the database and restart
rm distance_calculator.db
```

### Frontend Issues

**Issue: "Cannot find module" error**

```bash
# Reinstall node modules
rm -rf node_modules package-lock.json
npm install
```

**Issue: API connection errors**

- Check that backend is running on `http://127.0.0.1:8000`
- Verify `REACT_APP_API_URL` in `.env`
- Check browser console for CORS errors

**Issue: Port 3000 already in use**

```bash
# Use a different port
PORT=3001 npm start
```

## 📦 Building for Production

### Backend

```bash
# Create optimized Python environment
pip install gunicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

### Frontend

```bash
# Create production build
npm run build
```

The build folder is ready to be deployed.

## 📝 Git Workflow

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd distance-calculator-app
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit changes**

   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

4. **Push to remote**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support, email support@distancecalculator.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] User authentication and accounts
- [ ] Save favorite routes
- [ ] Route optimization
- [ ] Multiple waypoints
- [ ] Real-time traffic data
- [ ] Export history as CSV/PDF
- [ ] Dark mode theme
- [ ] Mobile app (React Native)

---

**Last Updated:** January 2024
**Version:** 1.0.0
