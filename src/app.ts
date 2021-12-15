import express, { Request, Response, NextFunction } from "express";
import http from "http";
import path from "path";
import moment from "moment";

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);
// let users = [];
// const messages = [];

const now = (): string => moment().format("YYYY.MM.DD hh시mm분ss초");

app.use(express.static("src"));

app.get("/", (_: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, "src", "/index.html"));
});

// //sockets전체 소켓인거같다.
// sockets.on("connection", function (socket) {
//   socket.on("addUserName", (username) => {
//     users.push({ id: socket.id, username });
//     sockets.emit("usersUpdateMessage", {
//       host: "server",
//       message: `${username}님이 접속했습니다.`,
//       username,
//       list: users,
//     });
//   });

//   socket.on("disconnect", () => {
//     const [user] = users.filter((user) => user.id === socket.id);
//     users = users.filter((user) => user.id !== socket.id);
//     if (!user) return;
//     socket.broadcast.emit("userDelete", {
//       name: "server",
//       message: `${user.username}님이 퇴장했습니다.`,
//       username: user.username,
//     });
//   });

//   socket.on("sendMessage", (message) => {
//     const user = users.find((user) => user.id === socket.id);
//     messages.push({
//       message,
//       user,
//       date: now(),
//     });
//     sockets.emit("responseMessage", messages);
//   });

//   socket.emit("init", {
//     users: users.map((user) => user.username),
//     messages,
//   });
// });

app.listen(8080, function () {
  console.log("서버 실행중...");
});
