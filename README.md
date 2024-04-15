# microservices-hello
Learning about microservices

This is essentially a reimplementation of the code from [this article](https://scanairobi.hashnode.dev/microservices-101-with-nodejs-and-rabbitmq) using ESM modules and TypeScript. You can make it work by running `docker-compose up` on the root folder.

# Architecture

The project is composed of two services, both in Node.js:

## Product
Handles product creation and user interaction. Runs on port 3001. Has the following endpoints:

### `GET host/products`
Lists registered products

### `POST host/products`
Create a new product. Its body needs to be a JSON formatted like the example:

```json
{
  "name": "Product Name",
  "price": 123.45,
  "description": "A brief product description"
}
```

An example request is stored on `testProd.json`, so if you're running on localhost, you can use `curl -d @testProd.json -H "Content-Type: application/json" -X POST http://localhost:3001/products` to test the endpoint.

### `POST host/products/buy`
Creates an order to buy a product. The IDs are assigned by MongoDB on product creation. The format follows the example:

```json
{
  "productIds": [
    "661d59b21249eebac5749a66",
    "661d5ee54dfd4382d4105d9a"
  ]
}
```

An example request is stored on `testOrder.json`, so if you're running on localhost, you can use `curl -d @testOrder.json -H "Content-Type: application/json" -X POST http://localhost:3001/products/buy` to test the endpoint.

## Order
Handles order creation. Runs on port 3002. This service has no endpoints.

---
Communication happens via a RabbitMQ queue, and storage is handled using MongoDB.
