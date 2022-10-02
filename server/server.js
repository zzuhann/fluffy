const express = require("express");
const SocketServer = require("ws").Server;

const PORT = 4000;

const server = express().listen(PORT, () =>
  console.log(`Listening on ${PORT}`)
);

const wss = new SocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("message", (data) => {
    // @ts-ignore
    data = data.toString();
    console.log(data);

    wss.clients.forEach(function (client) {
      client.send(data);
    });
  });

  ws.on("close", () => {
    console.log("Close connected");
  });
});
