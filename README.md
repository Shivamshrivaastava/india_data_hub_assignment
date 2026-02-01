# India Data Hub

A React application built with Vite and Tailwind CSS for managing and displaying economic data.

## Features

- **Authentication**: Login/Signup functionality using localStorage
- **Product Catalogue**: Browse economic indicators with categories sidebar
- **Pagination**: Display 10 records per page for optimal performance
- **Search**: Real-time search functionality across all data
- **Responsive Design**: Built with Tailwind CSS for modern UI

## Getting Started

## Live URL -> https://indiadatahub-assignement.netlify.app/

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
india-data-hub/
├── src/
│   ├── data/
│   │   ├── response1.json    # Categories and navigation data
│   │   └── response2.json    # Economic indicators dataset
│   ├── pages/
│   │   ├── Login.jsx         # Login/Signup page
│   │   └── Catalogue.jsx     # Product catalogue page
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles with Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Technology Stack

- **React 18.3.1**: UI library
- **Vite 6.0.3**: Build tool and dev server
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **React Router DOM 6.22.0**: Client-side routing
- **localStorage**: Authentication and data persistence

## Features Details

### Authentication
- Sign up with email and password
- Sign in with existing credentials
- Logout functionality
- Protected routes (catalogue requires authentication)

### Data Management
- Static data from JSON files (response1.json and response2.json)
- Client-side filtering and pagination
- Search across all fields
- Category-based filtering

### Performance Optimizations
- React useMemo for expensive computations
- Pagination to limit rendered items (10 per page)
- Lazy loading of data
- Optimized re-renders with proper state management

## Default Test Credentials

Since this uses localStorage, you'll need to sign up first. Use any email/password combination to create an account.

## Data Structure

### response1.json
Contains categories and navigation structure for the sidebar.

### response2.json
Contains economic indicators with fields:
- name: Indicator name
- category: Related category
- range: Date range
- unit: Measurement unit
- coverage: Frequency (Daily, Monthly, Quarterly, Annually)
- indicators: Visual indicators
- status: Active status

## Browser Support

Modern browsers that support ES6+ features.
