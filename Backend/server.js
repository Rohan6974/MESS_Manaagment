const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const AuthRoutes  = require("./Routes/AuthRoutes")
const AdminRoutes  = require("./Routes/AdminRoutes")
const wasteRoutes = require('./Routes/WasteRoutes');
// const OrderRoutes = require("./Routes/OrderRoutes")


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
app.use('/api/waste', wasteRoutes);
// app.use("/api/order",OrderRoutes)


  


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    }
);