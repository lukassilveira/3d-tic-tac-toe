module.exports = (io) => {
  let player1;
  let player2;
  io.on("connection", (socket) => {
    if (!player1) {
      console.log("Player 1 connected");
      player1 = socket;
    } else if (!player2) {
      console.log("Player 2 connected");
      player2 = socket;
    }

    if (player1 && player2) {
      io.emit("gameStarting", "Game Started!");
    }

    socket.on("moveMessage", (message) => {
      console.log(message);
      io.emit("moveListener", message);
      socket.broadcast.emit("turnListener", "playAllowed");
    });

    socket.on("disconnect", () => console.log("disconnected"));
  });
};
