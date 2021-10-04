const { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-access-token')
const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
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

io.on('connection', (client) => {
  let room;

  client.emit('get_frequencys',
    rooms.map((room) => {
      return room.frequency;
    })
  );

  client.on('join_room', (roomid) => {
    console.log('user joined room');
    room = roomid;

    rooms[room].clients.push({ talking: false, socket: client });
    generateToken(client, roomid);
    updateJoinedClients(rooms[room].clients, client);
  });

  client.on('leave_room', () => {
    findClient(room, client, (cl, i) =>{
      rooms[room].clients.splice(i, 1);
    });

    updateJoinedClients(rooms[room].clients, client);
  });

  client.on('set_talking_state', (talking) => {
    findClient(room, client, (cl) =>{
      cl.talking = talking;
    });

    updateJoinedClients(rooms[room].clients, client);
  });
});


function findClient(room, client, callback){
  if(typeof room === 'number'){
    rooms[room].clients.forEach((cl, index) => {
      if (cl.socket.id === client.id) {
        if(typeof callback === 'function'){
          callback(cl, index);
        }
      }
    });
  }
}

function updateJoinedClients(roomclients, self) {
  let filtered = roomclients.map((client) => {
    if(client.id != self.id){
      return { id: client.socket.id, talking: client.talking };
    }
  });

  roomclients.forEach((client) => {
    client.socket.emit('update_joined_users', filtered);
  });
}

function generateToken(client, roomid, socket) {
  const appID = '973ff918e3064ce4ba5e71bac6d06267';
  const appCertificate = 'b01b51220fbd4b99bce3e2755649a273';
  const role = RtcRole.PUBLISHER;

  const expirationTimeInSeconds = 3600000;
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

  const channelName = 'channel_' + roomid;
  const uid = client.id;

  const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);

  client.emit('token_receiving', token)
}

server.listen(8000);
