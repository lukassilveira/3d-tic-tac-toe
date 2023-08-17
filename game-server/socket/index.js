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
      io.emit("moveListener", message);
      socket.broadcast.emit("turnListener", "playAllowed");
    });

    socket.on("giveUp", () => {
      socket.emit("giveUpListener", "You gave up!");
      socket.broadcast.emit("giveUpListener", "Your opponent gave up!");
    });

    socket.on("sendMessage", (message) => {
      socket.emit("messageListener", "You: " + message);
      socket.broadcast.emit("messageListener", "Opponent: " + message);
    });

    socket.on("disconnect", () => console.log(socket.id + " disconnected"));
  });
};
