# SubTracker - Subscription Management App

A simple and efficient subscription tracking application built with React, TypeScript, and Tailwind CSS. Keep track of your recurring subscriptions, their costs, and renewal dates all in one place.

## Features

- Track multiple subscriptions
- View monthly total costs
- Manage subscription renewal dates
- Responsive design with Tailwind CSS
- Built with modern React and TypeScript

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd subtracker
```

2. Install dependencies:
```bash
npm install
```

### Development

To run the development server with hot-reload:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### Production Build

1. Build the project:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## Usage

1. Development Mode:
   - Run `npm run dev`
   - Open your browser to `http://localhost:5173`
   - Make changes and see them instantly with hot-reload

2. Production Mode:
   - Run `npm run build` to create an optimized build
   - Use `npm run preview` to test the production build locally
   - Deploy the contents of the `dist` folder to your hosting service

## Project Structure

```
subtracker/
├── src/
│   ├── components/     # React components
│   ├── assets/        # Static assets
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Public static files
└── package.json       # Project dependencies and scripts
```

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- date-fns
- Lucide React Icons
