const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

let rooms = [[], [], [], [], [], [], []];

io.on('connection', (client) => {
  client.on('audio', (data) => {
    rooms[data.roomid].forEach((cl) => {
      if (cl.id == client.id) {
        client.emit('audio_incoming', data.audiodata);
      }
    });
  });

  client.on('join_room', (roomid) => {
    rooms[roomid].push(client);
    updateJoinedClients(rooms[roomid]);
  });

  client.on('leave_room', (roomid) => {
    let clientIndex = rooms[roomid].indexOf(client);
    rooms[roomid].splice(clientIndex, 1);
    updateJoinedClients(rooms[roomid]);
  });
});

function updateJoinedClients(room) {
  room.forEach((client) => {
    client.emit('update_joined_users', {updated: room.map(cl =>{return cl.id})});
  });
}

server.listen(8000);
console.log('server started...');
