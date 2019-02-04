import express from "express";
import SocketIO from "socket.io";
import Hardware from "./hardware";

const app = express();
const port = 3000;

app.use(express.static("public"));

const httpServer = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Example app listening on port ${port}!`);
});

// Socket.io
const io = SocketIO(httpServer);

// Hio specific
const hio = Hardware();
hio.use(io);
hio.bootstrap();
