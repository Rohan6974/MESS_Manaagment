const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const AuthRoutes  = require("./Routes/AuthRoutes")
const AdminRoutes  = require("./Routes/AdminRoutes")
const connectDatabase = require('./DB');
connectDatabase();
dotenv.config();



const app = express();
const port = process.env.PORT

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


app.use("/api", AuthRoutes)
app.use("/admin" , AdminRoutes)

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    }
);