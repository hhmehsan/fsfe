const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, function () {
  console.log("start on 3000");
});

const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server: server });

// Broadcast function to send data to all connected clients
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
};

// Keep track of connected clients
let numClients = 0;

wss.on("connection", function connection(ws) {
  numClients++; // Increment the number of clients when one connects
  console.log("client connected", numClients);

  // Broadcast the current number of visitors
  wss.broadcast(`current visitor ${numClients}`);

  // Send a welcome message to the new client
  if (ws.readyState === ws.OPEN) {
    ws.send("welcome to my server");
  }

  // Handle disconnection
  ws.on("close", function close() {
    numClients--; // Decrement the number of clients when one disconnects
    wss.broadcast(`current visitor ${numClients}`);
    console.log("client disconnected", numClients);
  });
});
