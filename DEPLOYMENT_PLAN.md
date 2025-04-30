# Plan for Online Deployment of Subscription Tracker

This document outlines the plan to deploy the Subscription Tracker application online, making it accessible via a public URL and storing data in an online database, using free-tier services.

## 1. Technology Choices

*   **Frontend Hosting:** Vercel (Free tier)
*   **Backend API:** Vercel Serverless Functions (Node.js, Free tier)
*   **Database:** Vercel KV (Key-Value Store, Free tier)

## 2. Development Plan

1.  **Setup Vercel Project:**
    *   Ensure the project code is in a Git repository (e.g., GitHub, GitLab).
    *   Create a new project on Vercel, linking it to the Git repository.
    *   Configure Vercel build settings:
        *   Build Command: `npm run build`
        *   Output Directory: `dist`
        *   Install Command: `npm install`
2.  **Create Vercel KV Store:**
    *   Navigate to the "Storage" tab in the Vercel project dashboard.
    *   Create a new KV store.
    *   Copy the provided environment variables (e.g., `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`).
3.  **Develop Backend API (Vercel Serverless Functions):**
    *   Create an `api` directory in the project root.
    *   Install the Vercel KV SDK: `npm install @vercel/kv`
    *   Inside `api`, create Node.js/TypeScript function files (e.g., `api/subscriptions.ts`).
    *   Implement API endpoints using the Vercel KV SDK to:
        *   `GET /api/subscriptions`: Fetch all subscriptions.
        *   `POST /api/subscriptions`: Add a new subscription.
        *   `DELETE /api/subscriptions?id={subscriptionId}`: Delete a subscription.
    *   Ensure functions read environment variables for KV connection.
4.  **Modify Frontend (`src/components/SubscriptionTracker.tsx`):**
    *   Remove `localStorage` logic for subscriptions and categories.
    *   Use `fetch` or a library like `axios` to interact with the new API endpoints (`/api/subscriptions`).
    *   Load initial data in a `useEffect` hook by calling the `GET` endpoint.
    *   Update `handleSubmit`, `deleteSubscription`, etc., to make `POST` and `DELETE` requests to the API. Update the local React state based on successful API responses.
5.  **Deployment & Configuration:**
    *   Add the copied KV environment variables to the Vercel project settings under "Environment Variables".
    *   Commit and push all code changes to the Git repository.
    *   Vercel will automatically trigger a new build and deployment.
    *   Test the deployed application using the Vercel URL.

## 3. Architecture Diagram

```mermaid
graph LR
    subgraph Vercel Platform
        direction TB
        A[React Frontend (Static Files)]
        B[Serverless API (/api/subscriptions)]
        C[Vercel KV (Database)]
    end

    D[User's Browser] -- Visits Vercel URL --> A;
    A -- HTTP Requests --> B;
    B -- Reads/Writes Data --> C;