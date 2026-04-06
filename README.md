# Finance Dashboard

A comprehensive MERN stack finance dashboard with role-based access control, financial record management, and summary analytics.

## Features
- User Authentication & Role-based Access Control (Admin, Analyst, Viewer)
- Financial Records CRUD (Amount, Type, Category, Date, Notes)
- Dashboard Summary (Total Income, Expenses, Balance, Trends)
- Input Validation & Error Handling
- Responsive UI with Tailwind CSS

## Roles
- **Admin**: Full access to manage records and users.
- **Analyst**: View records and access dashboard summaries.
- **Viewer**: Read-only access to dashboard data.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JWT (JSON Web Tokens)

## User and Role Management Implementation

This application implements a robust User and Role Management system to ensure secure access and data integrity.

### 1. Role-Based Access Control (RBAC)
The system defines three distinct roles, each with specific permissions:
- **Viewer**: Read-only access to the dashboard summary. Cannot view detailed records or manage users.
- **Analyst**: Can view the dashboard and detailed financial records. Cannot create, update, or delete records.
- **Admin**: Full administrative access. Can manage all financial records (CRUD) and all users.

### 2. Implementation Details
- **Backend Middleware**: A custom `authorize` middleware (`backend/src/middleware/role.middleware.js`) is used to protect routes. It checks the `role` field of the authenticated user against the allowed roles for that specific endpoint.
- **Route Protection**:
  - `GET /api/records`: Accessible by `Viewer`, `Analyst`, and `Admin`.
  - `POST/PUT/DELETE /api/records`: Strictly restricted to `Admin`.
  - `/api/users`: All user management routes are strictly restricted to `Admin`.
- **User Status Management**: Users have a `status` field (`active` or `inactive`). If an admin sets a user to `inactive`, the `auth.service.js` will reject their login attempts, effectively blocking their access.
- **Role Assignment**: During registration, all users are defaulted to the `viewer` role. Only an existing `Admin` can promote a user to `Analyst` or `Admin` via the User Management UI.

### 3. User Management UI
Admins have access to a dedicated **Users** page where they can:
- View a list of all registered users.
- Update a user's role (Admin, Analyst, Viewer).
- Toggle a user's status (Active, Inactive).
- Delete user accounts.

---

## Financial Records Management Implementation

The application provides a comprehensive system for managing financial transactions.

### 1. Data Structure
Each record consists of:
- **Amount**: Numerical value of the transaction.
- **Type**: Categorized as either `income` or `expense`.
- **Category**: Descriptive label (e.g., Salary, Rent, Groceries).
- **Date**: The date the transaction occurred.
- **Notes**: Optional detailed description.

### 2. CRUD Operations
- **Create**: Admins can add new records via a dynamic form.
- **Read**: All users can view records, with access levels determining the level of detail and interaction.
- **Update**: Admins can edit existing records. Clicking the edit icon populates the form with the record's current data for modification.
- **Delete**: Admins can permanently remove records from the system.

### 3. Advanced Filtering and Search
The records table includes a powerful filter bar:
- **Type Filter**: Quickly toggle between Income, Expense, or All records.
- **Date Range Filter**: Filter records between a specific Start Date and End Date.
- **Search**: Full-text search that scans both the `category` and `notes` fields in real-time (debounced for performance).
- **Pagination**: Backend-supported pagination ensures the UI remains fast even with thousands of records.

---

## Dashboard Summary Implementation

The application features a dedicated dashboard that provides high-level financial insights through aggregated data.

### 1. Aggregated Data Points
The `DashboardService` (`backend/src/services/dashboard.service.js`) performs complex calculations to provide:
- **Financial Totals**: Real-time calculation of Total Income, Total Expenses, and Net Balance.
- **Category-wise Distribution**: Aggregates totals for each category, separated by income and expense types.
- **Monthly Trends**: Calculates income vs. expense trends over the last 6 months, providing a historical perspective.
- **Recent Activity**: Retrieves the 5 most recent transactions for quick reference.

### 2. Implementation Logic
- **Data Aggregation**: Instead of simple CRUD, the dashboard API uses JavaScript's `reduce` and `filter` methods (or MongoDB aggregation pipelines) to transform raw records into meaningful summaries.
- **Service Layer Pattern**: All aggregation logic is encapsulated in the Service layer, keeping the Controller clean and focused on request/response handling.
- **Real-time Updates**: The frontend dashboard automatically refreshes its data whenever a new record is added or an existing one is modified, ensuring the summary is always accurate.

---

## Validation and Error Handling Implementation

The application is built with a "fail-fast" and informative error handling strategy to ensure a smooth and secure user experience.

### 1. Input Validation
- **Express Validator**: We use `express-validator` to define strict schemas for all incoming data.
  - **Auth**: Validates email format, name presence, and minimum password length (6 characters).
  - **Records**: Ensures `amount` is a positive number, `type` is either `income` or `expense`, and `category` is within length limits (50 chars).
- **Middleware Integration**: A custom `validate` middleware (`backend/src/middleware/validate.middleware.js`) intercepts requests, checks for validation errors, and returns a `400 Bad Request` with a detailed list of errors if any are found.

### 2. Standardized Error Responses
All errors follow a consistent JSON structure via the `apiResponse` utility:
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    { "msg": "Amount must be a number", "param": "amount", "location": "body" }
  ]
}
```

### 3. Appropriate Status Codes
The backend uses standard HTTP status codes to communicate the nature of the error:
- **400 (Bad Request)**: Validation failures or malformed requests.
- **401 (Unauthorized)**: Missing or invalid JWT token.
- **403 (Forbidden)**: Authenticated user lacks the required role (e.g., Viewer trying to delete a record).
- **404 (Not Found)**: Resource (user or record) does not exist.
- **500 (Internal Server Error)**: Unexpected server-side exceptions.
- **503 (Service Unavailable)**: Database connection issues (handled by `dbCheck` middleware).

### 4. Protection Against Invalid Operations
- **Global Error Handler**: A centralized error-handling middleware (`backend/src/middleware/error.middleware.js`) catches all unhandled exceptions, logs the stack trace for developers, and returns a clean, non-leaky error message to the client.
- **Database Integrity**: Mongoose schemas enforce data types and required fields at the database level as a second line of defense.
- **Role-Based Protection**: Route-level authorization ensures that even if a user knows an API endpoint, they cannot execute actions (like role promotion or record deletion) without the proper administrative privileges.

---

## Data Persistence Implementation

The application uses a robust document-based persistence approach to store and manage financial data and user accounts.

### 1. Document Database (MongoDB)
We have selected **MongoDB** as the primary data store for this project. MongoDB's flexible schema is ideal for financial records, allowing us to store varied transaction details without the rigidity of a relational database.

### 2. Object Data Modeling (Mongoose)
The backend uses **Mongoose** to interact with MongoDB. This provides:
- **Schema Enforcement**: Even though MongoDB is schema-less, Mongoose allows us to define strict structures for `User` and `Record` entities.
- **Data Validation**: Built-in validation ensures that only correctly formatted data (e.g., valid emails, positive amounts) is persisted.
- **Relationships**: We use Mongoose `ObjectId` references to link financial records to the users who created them.

### 3. Database Schemas
- **User Schema**: Stores authentication details, roles (`admin`, `analyst`, `viewer`), and account status.
- **Record Schema**: Stores transaction details including amount, type (income/expense), category, date, and notes.

### 4. Resilience and Seeding
- **Connection Handling**: The application includes a `dbCheck` middleware that verifies the database connection before processing requests, returning a `503 Service Unavailable` error if the database is offline.
- **Automatic Seeding**: On the first run, the system automatically checks for an existing admin user. If none is found, it seeds a default administrator account (`admin@example.com`) to ensure the system is immediately usable.

---

## Local Setup

### Prerequisites
1. **Node.js**: [Download here](https://nodejs.org/)
2. **MongoDB**: Ensure it is running locally on port `27017`.

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/finance-dashboard
   JWT_SECRET=your_secret_key
   ```

### Running the App
Start both frontend and backend with one command:
```bash
npm run dev
```
Access the app at `http://localhost:3000`.

### Default Credentials
- **Email**: `admin@example.com`
- **Password**: `admin123`
