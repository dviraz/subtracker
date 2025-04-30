# Plan to Run the Subtracker Application

This document outlines the steps to run the Subtracker web application locally.

## Steps

1.  **Install Dependencies:** Ensure all necessary project packages are installed.
    ```bash
    npm install
    ```
2.  **Start the Development Server:** Run the script defined in `package.json` to start the Vite development server.
    ```bash
    npm run dev
    ```
3.  **View the Application:** Open the local URL provided by the development server (e.g., `http://localhost:5173`) in your web browser.

## Process Flow

```mermaid
graph TD
    A[Install Dependencies (npm install)] --> B[Start Dev Server (npm run dev)];
    B --> C{Server Running?};
    C -- Yes --> D[Open URL in Browser];
    C -- No --> E[Troubleshoot Error];