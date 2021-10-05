const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require("agora-access-token");
require('dotenv').config();
const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

let rooms = [
  { frequency: 61.5, clients: [] },
  { frequency: 74.2, clients: [] },
  { frequency: 88.6, clients: [] },
  { frequency: 107.3, clients: [] },
  { frequency: 121.8, clients: [] },
  { frequency: 137.2, clients: [] },
  { frequency: 159.7, clients: [] },
];

io.on("connection", (client) => {
  let room;

  client.emit(
    "get_frequencys",
    rooms.map((room) => {
      return room.frequency;
    })
  );

  client.on("join_room", (roomid) => {
    room = roomid;

    rooms[room].clients.push({ talking: false, socket: client });
    generateToken(client, roomid);
    updateJoinedClients(rooms[room].clients, client);
  });

  client.on("leave_room", () => {
    const index = findClient(room, client.id);
    rooms[room].clients.splice(index, 1);
    updateJoinedClients(rooms[room].clients, client);
  });

  client.on("set_talking_state", (talking) => {
    const index = findClient(room, client.id);
    rooms[room].clients[index].talking = talking;

    updateJoinedClients(rooms[room].clients, client);
  });
});

function findClient(room, clientid) {
  let index = null;
  let clients = rooms[room].clients;

  for (let i = 0; i < clients.length; i++) {
    if (clients[i].socket.id === clientid) {
      index = i;
      break;
    }
  }

  return index;
}

function updateJoinedClients(roomclients, self) {
  let filtered = roomclients.map((client) => {
    if (client.id != self.id) {
      return { id: client.socket.id, talking: client.talking };
    }
  });

  roomclients.forEach((client) => {
    client.socket.emit("update_joined_users", filtered);
  });
}

function generateToken(client, roomid, socket) {
  const appID = "973ff918e3064ce4ba5e71bac6d06267";
  const appCertificate = "b01b51220fbd4b99bce3e2755649a273";
  const role = RtcRole.PUBLISHER;

  const expirationTimeInSeconds = 3600000;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const channelName = "channel_" + roomid;
  const uid = client.id;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  client.emit("token_receiving", token);
}

server.listen(process.env.PORT || 5000);
