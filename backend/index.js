const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

let rooms = [
  {frequency: 61.5, clients: []},
  {frequency: 74.2, clients: []},
  {frequency: 88.6, clients: []},
  {frequency: 107.3, clients: []},
  {frequency: 121.8, clients: []},
  {frequency: 137.2, clients: []},
  {frequency: 159.7, clients: []},
];

io.on('connection', (client) => {
  client.emit(
    'get_frequencys',
    rooms.map((room) => {
      return room.frequency;
    })
  );

  client.on('audio', (data) => {
    rooms[data.roomid].forEach((cl) => {
      if (cl.id == client.id) {
        client.emit('audio_incoming', data.audiodata);
      }
    });
  });

  client.on('join_room', (roomid) => {
    rooms[roomid].clients.push(client);
    updateJoinedClients(rooms[roomid].clients);
  });

  client.on('leave_room', (roomid) => {
    let clientIndex = rooms[roomid].clients.indexOf(client);
    rooms[roomid].clients.splice(clientIndex, 1);
    updateJoinedClients(rooms[roomid].clients);
  });
});

function updateJoinedClients(room) {
  let filtered = room.map((cl) => {
    return cl.id;
  });

  room.forEach((client) => {
    client.emit('update_joined_users', {
      updated: filtered,
    });
  });
}

server.listen(8000);
console.log('server started...');
