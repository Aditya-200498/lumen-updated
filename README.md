
# Sales Analysis Dashboard

## Overview

This project is a backend solution designed to analyze sales data stored in a MongoDB database. It provides APIs to retrieve insights into sales performance, including top-selling products overall and within specific categories.

## Features

- **Data Loading**: A script (`load_data.js`) is provided to import sales data from a CSV file into the MongoDB database.
- **API Endpoints**:
  - `/api/analysis/top-products/overall`: Retrieves the top N selling products across all categories within a specified date range.
  - `/api/analysis/top-products/category/:category`: Retrieves the top N selling products within a specific category within a specified date range.
  - `/api/analysis/top-products/category/:region`: Retrieves the top N selling products within a specific region within a specified date range.
- **Filtering**: Both API endpoints support filtering by start and end dates.
- **Configuration**: The application uses a configuration file (`config/config.js`) to manage environment-specific settings, including the MongoDB connection URI.
- **Logging**: The application logs data refresh information to `logs/refresh.log`.

## Technologies

The project uses the following technologies:
- Node.js
- Express.js
- MongoDB
- Mongoose
- CSV Parser (`csv-parse`)

## Project Structure

The project is organized as follows:
