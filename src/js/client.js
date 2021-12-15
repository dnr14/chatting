const socket = io();
const $btn = document.querySelector("#btn");
const $input = document.querySelector("#input");
const $chat = document.querySelector("#chat");
const $users = document.querySelector("#users");
const $sendBtn = document.querySelector("#sendBtn");
const $sendInput = document.querySelector("#sendInput");
const $nickname = document.querySelector("#nickname");
const $nickname_add = document.querySelector("#nickname_add");

let first = true;
let nickname = null;
let client_user_list = [];
const response_messages = [];

$nickname.innerHTML = nickname || "닉네임 : 아직없음";

socket.on("connect", () => {
  const text = "서버와 연결되었습니다";
});

socket.on("usersUpdateMessage", (data) => {
  const { username, message, list } = data;
  const messageDiv = document.createElement("div");
  messageDiv.innerHTML = message;
  client_user_list.push(username);

  $users.innerHTML = "";
  client_user_list.forEach((username) => {
    const div = document.createElement("div");
    div.append(username);
    $users.append(div);
  });

  nickname = username;
  $chat.append(messageDiv);
});

socket.on("userDelete", (data) => {
  const { username } = data;
  client_user_list = client_user_list.filter((user) => user !== username);
  $users.innerHTML = "";
  if (client_user_list.length === 0) {
    $users.append(userZeroText());
  } else {
    $users.append(...usersDivRender(client_user_list));
  }
});

socket.on("responseMessage", (messages) => {
  $chat.innerHTML = "";
  $chat.append(...chatDivRender(messages));
});

socket.on("init", (init) => {
  const { users, messages } = init;

  if (users.length === 0) {
    $users.append(userZeroText());
    return;
  }
  client_user_list = users;
  $users.innerHTML = "";
  $users.append(...usersDivRender(client_user_list));

  if (messages.length === 0) {
    $chat.append("...메세지가 없습니다.");
    return;
  }
  $chat.innerHTML = "";
  $chat.append(...chatDivRender(messages));
});

$btn.addEventListener("click", () => {
  if ($input.value !== "" && nickname === null) {
    const { value } = $input;
    socket.emit("addUserName", value);
    $input.value = "";
    $nickname.innerHTML = `닉네임 : ${value}`;
    $nickname_add.style.display = "none";
  }
});

$sendBtn.addEventListener("click", () => {
  const { value } = $sendInput;
  if (value !== "" && nickname !== null) {
    socket.emit("sendMessage", value);
    $sendInput.value = "";
    return;
  }
  $sendInput.value = "";
});

function usersDivRender(client_user_list) {
  return client_user_list.map((username) => {
    const div = document.createElement("div");
    div.append(username);
    return div;
  });
}

function userZeroText() {
  const div = document.createElement("div");
  div.append("유저가 없습니다...");
  return div;
}
function chatDivRender(messages) {
  return messages.map((message) => {
    const div = document.createElement("div");
    const form = `[${message.user.username} (${message.date})] : ${message.message}`;
    div.append(form);
    return div;
  });
}
