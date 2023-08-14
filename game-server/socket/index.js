module.exports = (io) => {
  let player1;
  let player2;
  io.on("connection", (socket) => {
    if (!player1) {
      player1 = socket;
    } else if (!player2) {
      player2 = socket;
    } else if (player1 && player2){
      io.emit("gameStarting", "Game Started!");
    } else {
      socket.disconnect(true);
    }

    socket.on("moveMessage", (message) => {
      console.log("Received move:" + message);
    });
    
    socket.on("disconnect", () => console.log("disconnected"));
  });
};
