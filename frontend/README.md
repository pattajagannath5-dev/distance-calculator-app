# Distance Calculator - Frontend

React-based user interface for the Distance Calculator application.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Components](#components)
- [Custom Hooks](#custom-hooks)
- [Styling](#styling)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser
# http://localhost:3000
```

## ✨ Features

- **Distance Calculator**: Input two addresses and get instant distance calculation
- **Multiple Units**: Display distance in miles, kilometers, or both
- **Address Autocomplete**: Smart suggestions from query history
- **Query History**: View, browse, and manage all past calculations
- **Pagination**: Navigate through history with easy pagination
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Input Validation**: Real-time validation and error messages
- **Modern UI**: Clean, intuitive interface with smooth interactions

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── App.js                  # Root component
│   ├── index.js                # React entry point
│   ├── index.css               # Global styles
│   ├── components/             # React components
│   │   ├── DistanceForm.js     # Main form component
│   │   ├── Pagination.js       # Pagination control
│   │   ├── QueryHistory.js     # History display
│   │   └── SuggestionsList.js  # Suggestions dropdown
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAddressSuggestions.js
│   │   └── useDistanceCalculation.js
│   ├── pages/
│   │   └── Home.js             # Home page
│   ├── services/
│   │   └── api.js              # API client
│   └── styles/                 # CSS stylesheets
│       ├── DistanceForm.css
│       ├── Home.css
│       ├── Pagination.css
│       ├── QueryHistory.css
│       └── SuggestionsList.css
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # NPM configuration
└── README.md                   # This file
```

## 📦 Installation

### Prerequisites

- Node.js 14+ - [Download](https://nodejs.org/)
- npm 6+ (comes with Node.js)

### Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   REACT_APP_API_URL=http://127.0.0.1:8000/api/distance
   ```

## ⚙️ Configuration

### Environment Variables

Create `.env` file in the frontend directory:

```env
# Backend API endpoint
REACT_APP_API_URL=http://127.0.0.1:8000/api/distance
```

**Note:** Environment variables must be prefixed with `REACT_APP_` to be accessible in React.

### Build Configuration

The app is built with Create React App. Configuration can be customized in:

- `package.json` - Scripts and dependencies
- `.env` - Environment variables
- `public/index.html` - HTML template

## 📜 Available Scripts

### `npm start`

Runs the app in development mode.

- Open [http://localhost:3000](http://localhost:3000) to view in browser
- Page reloads on code changes
- Errors and warnings display in console

### `npm build`

Builds the app for production in the `build` folder.

- Correctly bundles React in production mode
- Optimizes build for best performance
- Build is minified and filenames include hashes

### `npm test`

Launches the test runner in interactive watch mode.

### `npm eject`

**Note: this is a one-way operation. Once you eject, you can't go back!**

## 🧩 Components

### DistanceForm

Main form component for distance calculations.

**Props:**

- `onResultUpdate` (Function) - Callback when calculation succeeds
- `onError` (Function) - Callback when error occurs

**Features:**

- Address input fields
- Unit selection (miles/kilometers/both)
- Real-time distance display
- Address autocomplete
- Input validation
- Clear button

**Usage:**

```jsx
<DistanceForm
  onResultUpdate={(result) => console.log(result)}
  onError={(error) => console.error(error)}
/>
```

### QueryHistory

Displays paginated history of past calculations.

**Props:**

- `refreshTrigger` (Number) - Triggers data refresh when changed

**Features:**

- Sortable table
- Pagination with smart page display
- Clear history button
- Statistics display
- Responsive design

**Usage:**

```jsx
<QueryHistory refreshTrigger={refreshCount} />
```

### Pagination

Reusable pagination control component.

**Props:**

- `currentPage` (Number) - Currently active page
- `totalPages` (Number) - Total number of pages
- `onPageChange` (Function) - Callback when page changes

**Features:**

- Previous/Next buttons
- Page number buttons
- Smart ellipsis for large page counts
- Disabled states
- Mobile responsive

**Usage:**

```jsx
<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => setCurrentPage(page)}
/>
```

### SuggestionsList

Dropdown component for address suggestions.

**Props:**

- `items` (Array) - List of suggestions
- `onSelect` (Function) - Callback when item selected

**Usage:**

```jsx
<SuggestionsList
  items={["Address 1", "Address 2"]}
  onSelect={(item) => setAddress(item)}
/>
```

## 🎣 Custom Hooks

### useDistanceCalculation

Manages distance calculation state and API calls.

**Returns:**

```javascript
{
  result, // Calculation result
    loading, // Loading state
    error, // Error message
    calculate, // Function to calculate distance
    reset; // Function to reset state
}
```

**Usage:**

```jsx
const { result, loading, error, calculate } = useDistanceCalculation();

const handleSubmit = async (address1, address2) => {
  const success = await calculate(address1, address2);
  if (success) {
    console.log(result);
  }
};
```

### useAddressSuggestions

Manages address autocomplete suggestions.

**Parameters:**

- `historicAddresses` (Array) - List of previous addresses

**Returns:**

```javascript
{
  suggestions1,
    suggestions2,
    showSuggestions1,
    showSuggestions2,
    setShowSuggestions1,
    setShowSuggestions2,
    handleAddress1Change,
    handleAddress2Change,
    selectSuggestion1,
    selectSuggestion2;
}
```

**Usage:**

```jsx
const suggestions = useAddressSuggestions(historicAddresses);

const handleInputChange = (value) => {
  suggestions.handleAddress1Change(value);
};
```

## 🎨 Styling

### CSS Structure

- **Global**: `index.css` - Base styles and variables
- **Components**: Individual CSS files in `styles/` folder
- **Responsive**: Mobile-first approach with media queries

### Color Scheme

```css
/* Primary Colors */
--primary: #333333
--error: #d32f2f
--success: #4caf50

/* Backgrounds */
--bg-light: #f9f9f9
--bg-white: #ffffff

/* Text Colors */
--text-primary: #333333
--text-secondary: #999999
```

### Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 480px) /* Tablet */ @media (max-width: 768px) /* Desktop */ @media (max-width: 1200px);
```

## 🔌 API Integration

### API Client Setup

The API client is configured in `services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL;
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
```

### Making API Calls

```javascript
import { calculateDistance, getQueryHistory } from "../services/api";

// Calculate distance
const result = await calculateDistance({
  address1: "San Francisco, CA",
  address2: "Palo Alto, CA",
});

// Get history
const history = await getQueryHistory();
```

### Error Handling

All API errors are caught and handled with descriptive messages:

```javascript
try {
  const result = await calculateDistance(data);
} catch (error) {
  console.error("API Error:", error.message);
  setError(error.message);
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Deployment Options

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### GitHub Pages

```bash
# Update package.json
"homepage": "https://username.github.io/distance-calculator",

# Install gh-pages
npm install --save-dev gh-pages

# Add deploy scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

### Environment Variables for Deployment

Set `REACT_APP_API_URL` in your deployment platform:

**Netlify:**

- Settings → Build & deploy → Environment → Add variable

**Vercel:**

- Settings → Environment Variables → Add new

**GitHub Pages:**

- Create `.env.production` file (don't commit)

## 🐛 Troubleshooting

### "Cannot find module" Error

```bash
# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install
```

### API Connection Errors

1. **Check backend is running**

   ```bash
   # In another terminal
   cd backend
   python -m uvicorn app.main:app --reload
   ```

2. **Verify API URL in `.env`**

   ```env
   REACT_APP_API_URL=http://127.0.0.1:8000/api/distance
   ```

3. **Check CORS configuration**

   - Backend should allow `http://localhost:3000`

4. **Check browser console**
   - Open DevTools (F12) → Console for error messages

### Port 3000 Already in Use

```bash
# Use different port
PORT=3001 npm start
```

### Blank Page on Load

1. Check browser console for errors (F12)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check `public/index.html` exists
4. Verify `index.js` imports are correct

### Slow Performance

1. **Build optimization**

   ```bash
   npm run build
   # Check bundle size
   npm install -g source-map-explorer
   source-map-explorer 'build/static/js/*.js'
   ```

2. **Code splitting**

   - Use React.lazy() for route-based splitting

3. **Memoization**
   - Use React.memo() for expensive components
   - Use useMemo() for expensive calculations

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Create React App Docs](https://create-react-app.dev/)
- [Axios Documentation](https://axios-http.com/)
- [CSS Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

---

**Version:** 1.0.0
**Last Updated:** January 2024
