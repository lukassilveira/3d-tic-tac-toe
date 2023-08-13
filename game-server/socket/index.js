module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("new connection");

    socket.on("disconnect", () => console.log("disconnected"));
    socket.on("moveMessage", (message) => {
        console.log("Received move:" + message);
      });
  });
};
