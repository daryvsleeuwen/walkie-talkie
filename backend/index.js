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
  let index;
  let room;

  client.emit('get_frequencys',
    rooms.map((room) => {
      return room.frequency;
    })
  );

  client.on('join_room', (roomid) => {
    room = roomid;
    index = rooms[room].clients.length;

    rooms[room].clients.push({talking: false, socket: client});
    updateJoinedClients(rooms[room].clients);
  });

  client.on('leave_room', () => {
    let clientIndex;

    rooms[room].clients.forEach((cl, index) => {
        if(cl.socket.id === client.id){
          clientIndex = index
        }
    });
    rooms[room].clients.splice(clientIndex, 1);
    updateJoinedClients(rooms[room].clients);
  });

  client.on('audio', (data) => {
    rooms[room].forEach((cl) => {
      if (cl.id == client.id) {
        client.emit('audio_incoming', data.audiodata);
      }
    });
  });

  client.on('set_talking_state', (talking) => {
    rooms[room].clients[index].talking = talking;
    updateJoinedClients(rooms[room].clients);
  });
});

function updateJoinedClients(room) {
  let filtered = room.map((client) => {
    return {id: client.socket.id, talking: client.talking};
  });

  room.forEach((client) => {
    client.socket.emit('update_joined_users', filtered);
  });
}

server.listen(8000);
console.log('server started...');
