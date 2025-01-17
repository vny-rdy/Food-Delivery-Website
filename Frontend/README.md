# Food Delivery Website

This is a food delivery website built with **React.js**, **Node.js**, and **MongoDB**. The project integrates a variety of services and technologies to provide a seamless user experience. It includes features such as OTP generation using Twilio, Google login with Google Auth, and payment integration via Razorpay.

## Features

- **Frontend**: Built with React.js for a dynamic and responsive user interface.
- **Backend**: Node.js backend that handles business logic, user authentication, and database interactions.
- **Database**: MongoDB to store and manage user data, order history, and other application data.
- **Styling**: Tailwind CSS used for modern and responsive design.
- **OTP Generation**: Twilio service used for one-time password (OTP) generation during user authentication.
- **Authentication**: Google login integrated using Google Auth for easy sign-in.
- **Payment Integration**: Razorpay used for secure payment gateway integration for processing orders.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js
- **Database**: MongoDB
- **CSS Framework**: Tailwind CSS
- **OTP Service**: Twilio
- **Authentication**: Google Auth
- **Payment Gateway**: Razorpay

## Setup Instructions

### 1. Clone the repository:

```bash
git clone https://github.com/vny-rdy/Food-Delivery-Website.git
```

### 2. Install dependencies for both frontend and backend:

**Frontend:**

Navigate to the `frontend` directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

**Backend:**

Navigate to the `backend` directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
nodemon install
```

### 3. Configuration:

You will need to set up some environment variables for various services like Twilio, Google Auth, and Razorpay.

Create a `.env` file in the root of both `frontend` and `backend` directories and add the required keys and secrets for these services.

- Twilio credentials (Account SID and Auth Token)
- Google OAuth client ID and secret
- Razorpay API keys

### 4. Run the Application:

To run the application in development mode:

- For **frontend**:

```bash
cd frontend
npm run dev
```

- For **backend**:

```bash
cd backend
nodemon index.js
```

The frontend should be accessible at `http://localhost:5176` and the backend at `http://localhost:5001`.

## Contributing

If you wish to contribute to this project, feel free to fork the repository and submit a pull request. Ensure that all contributions are well-documented and thoroughly tested.

## License

This project is open-source and available under the [MIT License](LICENSE).
