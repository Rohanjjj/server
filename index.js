const express = require("express");
const http = require("http");
const WebSocket = require("ws");

// Server configuration
const PORT = 8080;

// Create an Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

// Global variables to store connected clients
let esp32Client = null;
let pythonClient = null;

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    const msg = message.toString().trim();

    // Identify the client type
    if (msg === "ESP32") {
      esp32Client = ws;
      console.log("ESP32 connected");
    } else if (msg === "PYTHON") {
      pythonClient = ws;
      console.log("Python application connected");
    } else {
      // Relay messages between clients
      if (ws === esp32Client && pythonClient) {
        pythonClient.send(msg);
      } else if (ws === pythonClient && esp32Client) {
        esp32Client.send(msg);
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (ws === esp32Client) {
      esp32Client = null;
      console.log("ESP32 disconnected");
    } else if (ws === pythonClient) {
      pythonClient = null;
      console.log("Python application disconnected");
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
