module.exports = (io) => {
  let users = [];
  io.on("connection", (socket) => {
    socket.on("register", (userData) => {
      users.push({
        name: userData.name,
        status: userData.status,
        friends: [],
        messages: userData.messages,
      });
      console.log(users);
    });

    socket.on("login", (userName) => {
      let user = users.find((u) => {
        return u.name == userName;
      });
      if (user) {
        user.status = "online";
      }
      console.log(users);
    });

    socket.on("addFriend", (friend1, friend2) => {
      let _user1 = users.find((u) => {
        return u.name == friend1;
      });
      let _user2 = users.find((u) => {
        return u.name == friend2;
      });

      if (_user1 && _user2) {
        _user1.friends.push(friend2);
        _user2.friends.push(friend1);
      }

      console.log(users);
    });

    socket.on("retrieveFriends", () => {
      io.emit("retrieveFriendsListener", users);
      socket.broadcast.emit("retrieveFriendsListener", users);
    });

    socket.on("sendMessage", (message) => {
      io.emit("moveListener", message);
      socket.broadcast.emit("turnListener", "playAllowed");
    });

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
