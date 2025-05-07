Sales Analysis DashboardOverviewThis project is a backend solution designed to analyze sales data stored in a MongoDB database. It provides APIs to retrieve insights into sales performance, including top-selling products overall and within specific categories. This document provides information on setting up, configuring, and using the application.FeaturesData Loading: A script (load_data.js) is provided to import sales data from a CSV file into the MongoDB database.API Endpoints:/api/analysis/top-products/overall: Retrieves the top N selling products across all categories within a specified date range./api/analysis/top-products/category/:category: Retrieves the top N selling products within a specific category within a specified date range.Filtering: Both API endpoints support filtering by start and end dates.Configuration: The application uses a configuration file (config/config.js) to manage environment-specific settings, including the MongoDB connection URI.Logging: The application logs data refresh information to logs/refresh.log.TechnologiesThe project uses the following technologies:Node.jsExpress.jsMongoDBMongooseCSV Parser (csv-parse)Project StructureThe project is organized as follows:config/: Contains the configuration file (config.js) for settings like the MongoDB URI.data/: Contains the sample sales data in a CSV file (sales_data.csv).database/: Contains the MongoDB connection setup (db.js).models/: Contains the data models for orders (order.js), products (product.js), and customers (customer.js).scripts/: Contains the script to load data from the CSV file into MongoDB (load_data.js).services/: (Optional) Contains services like dataRefreshService.js for refreshing data.routes/: Contains the API routes for sales analysis (analysisRoutes.js).logs/: Contains log files, such as refresh.log for data refresh information.app.js: The main application file.package.json: The project's dependencies and metadata.README.md: This documentation file.SetupPrerequisitesBefore setting up the project, ensure you have the following installed:Node.js: You can download it from https://nodejs.org/.MongoDB: You can install it locally or use a cloud-based service like MongoDB Atlas.MongoDB URI: If using MongoDB Atlas, create a cluster and obtain the connection URI. If running locally, ensure your MongoDB server is running.InstallationFollow these steps to install and set up the project:Clone the repository:git clone <repository_url>
cd sales-analysis-mongodb
Install dependencies:npm install
Configure the database connection:Copy config/config.example.js to config/config.js.Edit config/config.js and replace the mongoUri with your MongoDB connection string.  For example:module.exports = {
development: {
mongoUri: 'your_mongodb_connection_string',
},
production: {
mongoUri: 'your_mongodb_connection_string',
},
};
Load the data:Place the sales_data.csv file in the data/ directory.Run the load_data.js script to import the data into MongoDB:node scripts/load_data.js
Running the ApplicationStart the server:npm start
The server will start at http://localhost:4000.API EndpointsThe application provides the following API endpoints:Top Products OverallEndpoint: GET /api/analysis/top-products/overallDescription: Retrieves the top N selling products across all categories.Query Parameters:n (optional): The number of top products to retrieve. Default is 10.startDate (optional): Filter sales on or after this date (YYYY-MM-DD).endDate (optional): Filter sales on or before this date (YYYY-MM-DD).Example:curl http://localhost:4000/api/analysis/top-products/overall?n=5&startDate=2024-01-01&endDate=2024-03-31
Top Products by CategoryEndpoint: GET /api/analysis/top-products/category/:categoryDescription: Retrieves the top N selling products within a specific category.Path Parameter:category: The category of products to retrieve (e.g., "Shoes", "Electronics").  This is case-sensitive.Query Parameters:n (optional): The number of top products to retrieve. Default is 10.startDate (optional): Filter sales on or after this date (YYYY-MM-DD).endDate (optional): Filter sales on or before this date (YYYY-MM-DD).Example:curl http://localhost:4000/api/analysis/top-products/category/Shoes?n=3&startDate=2024-02-01&endDate=2024-04-30
Data StructureThe application uses the following data structures:Product{
"productId": "P123", // Unique product identifier
"productName": "Example Product",
"category": "Example Category",
"createdAt": "2024-07-24T12:00:00Z",
"updatedAt": "2024-07-24T12:00:00Z"
}
Order{
"orderId": 1001, // Unique order identifier
"productId": "P123", // ID of the ordered product
"customerId": "C101",
"dateOfSale": "2024-07-24T10:00:00Z",
"quantitySold": 2,
"unitPrice": 25.00,
"discount": 0.10,
"shippingCost": 5.00,
"paymentMethod": "Credit Card",
"createdAt": "2024-07-24T10:00:00Z",
"updatedAt": "2024-07-24T10:00:00Z"
}
Customer{
"customerId": "C101",
"customerName": "John Doe",
"customerEmail": "john.doe@example.com",
"customerAddress": "123 Main St",
"region": "North America",
"createdAt": "2024-07-24T10:00:00Z",
"updatedAt": "2024-07-24T12:00:00Z"
}
Error HandlingThe API returns JSON responses with appropriate HTTP status codes. Errors are logged to the console.200 OK: Successful response.500 Internal Server Error: Error occurred while processing the request. The response will include an error message.TroubleshootingIf you encounter issues with the API, please follow these steps:Verify Database Connection:Check MongoDB URI: Double-check the config/config.js file. Ensure the mongoUri is correct and points to your running MongoDB instance. A common mistake is having an incorrect port, username, password, or database name.MongoDB Server: Make sure your MongoDB server is running. If it's a local installation, ensure the mongod process is active. If you're using MongoDB Atlas, verify that your cluster is running.Network Connectivity: If using a remote MongoDB server (like Atlas), ensure your server can connect to it. Check firewall rules, network settings, and any IP whitelisting.Database Name: Confirm that the database name in your connection string matches the database where your data is stored.Confirm Data Loading:Run load_data.js: Run the data loading script again to be absolutely sure the data is in your MongoDB database:node scripts/load_data.js
Check MongoDB Collections: Use a MongoDB client (like the mongo shell or MongoDB Compass) to verify that the products, orders, and customers collections exist and contain data. For example, in the mongo shell:use your_database_name # Replace with your actual database name
show collections
db.products.find().limit(5).pretty() # Show the first 5 products
db.orders.find().limit(5).pretty() # Show the first 5 orders
db.customers.find().limit(5).pretty()
* Replace your_database_name with the name of your database.* The find().limit(5).pretty() commands will display a few documents from each collection in a readable format. This will confirm that the data has been loaded.API Endpoint Testing:Server Status: Make sure your Node.js server is running. If you haven't already, start it with:npm start
Correct Port: Verify that the server is running on the port you're using in your curl commands (as per the README, the default is 4000).Endpoint URL: Double-check the endpoint URLs in your curl commands. Ensure they match the routes defined in analysisRoutes.js (see "API Endpoints" in the README). Pay close attention to the category in the /api/analysis/top-products/category/:category endpoint, as it is case-sensitive.cURL Examples: Use the exact curl examples provided in the README to test the API:curl http://localhost:4000/api/analysis/top-products/overall?n=5&startDate=2024-01-01&endDate=2024-03-31
curl http://localhost:4000/api/analysis/top-products/category/Shoes?n=3&startDate=2024-02-01&endDate=2024-04-30
* If these examples work, then the problem might be with how you're constructing your curl commands. If they don't work, the issue is likely with the server or the database connection.Check for Typos:Carefully review your code, configuration files, and commands for any typos. A small mistake can prevent the application from working correctly. Pay special attention to:Database namesCollection namesField names (e.g., productId, dateOfSale, category)API endpoint URLsDate formats (YYYY-MM-DD)Simplified Testing:Try hitting the API with the bare minimum:curl http://localhost:4000/api/analysis/top-products/overall
curl http://localhost:4000/api/analysis/top-products/category/Shoes
If you get data, then add the query parameters one by one to see which one is causing the issue.
