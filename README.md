# Products Review Blog

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [ERD Diagram](#erd-diagram)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project implements a "Products Review Blog" using Node.js technology and the Express framework. The blog provides a platform where users can log in, view products with reviews and ratings, submit their own reviews, receive product recommendations, and log out of their accounts.

## Features

- **User Authentication**: Users can log in with their username and password.
- **Product Reviews**: Display products along with reviews and ratings.
- **User Reviews**: Users can submit reviews and ratings for products.
- **Recommendations**: The system suggests recommended products for users.
- **Logout**: Users can log out of their accounts.

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- Other relevant dependencies

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up your MongoDB database.
4. Configure environment variables.
5. Run the application using `npm start`.

## API Endpoints

The API provides the following endpoints:

- **POST /login**: User login with username and password.
- **GET /products**: Fetch all products with reviews and ratings.
- **POST /products/:productId/reviews**: Submit a review for a specific product.
- **GET /recommendations**: Get recommended products for the user.
- **POST /logout**: Log out the user.

For detailed API documentation, refer to the [API Documentation](docs/API.md).

## ERD Diagram

![ERD Diagram](docs/utils/Images/ERD.png)

The Entity-Relationship Diagram (ERD) illustrates the overall structure and relationships in the system.

## Contributing

Contributions are welcome! Fork the repository, create a branch, and submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
