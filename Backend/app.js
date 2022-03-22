const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

// const swaggerOptions = {
//   swaggerDefinition: {
//     info: {
//       title: "Library API",
//       version: "1.0.0"
//     }
//   },
//   apis: ['app.js'],
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// console.log(swaggerDocs);
// app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// /**
//  * @swagger
//  * /books:
//  *    get:
//  *      description: Get all books
//  *      responses:
//  *        200:
//  *          desciption: Success
//  */
// app.get('/books',(req, res)=>{
//   res.send([
//     {
//       id: 1,
//       title: "Harry Potter"
//     }
//   ]);
// })
// /**
//  * @swagger
//  * /books:
//  *    post:
//  *      description: Create a new book
//  *      parameters:
//  *      - name: title
//  *        description: title of the book
//  *        in: formData
//  *        require: true
//  *        type: string
//  *      responses:
//  *        201:
//  *          description: Created
//  */
// app.post('/books',(req, res)=>{
//   res.status(201).send();
// })

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

//Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "mean-eshop",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

//Server
app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
