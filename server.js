const cluster = require('cluster');
const os = require('os');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDb } = require('./config/db');

dotenv.config();

if (cluster.isMaster) {
    // Fork workers based on the number of CPU cores
    const numCPUs = os.cpus().length;
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    // Worker process
    const productRoute = require('./routes/productRoutes');
    const app = express();
    const port = process.env.PORT || 8000;

    connectDb();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use("/api/v1", productRoute);

    app.get("/", (req, res) => {
        res.send(`Hello from worker ${cluster.worker.id}`);
    });

    app.listen(port, () => {
        console.log(`Worker ${cluster.worker.id} is running on port ${port}`);
    });
}
