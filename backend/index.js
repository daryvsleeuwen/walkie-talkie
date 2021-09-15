
const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});

var rooms = [[]];


io.on('connection', client => {
  client.on('connect', () => {
      console.log('client connected');
  });

  client.on('disconnect', () => {
    console.log('client disconnected');
  });

  client.on('audio', (data) => {
    console.log("data received");


    rooms[data.roomid].forEach(cl => {
      console.log(cl.id)
      console.log(client.id)
      if (cl.id == client.id){

        client.emit('data_incoming', data.audiodata);
      } 
    });
  });

  client.on('join_room', (data) => {
    console.log('joining room ' + data)
    rooms[data].push(client);
  })

  client.on('leave_room', (data) => {
    console.log('leaving rooom ' + data)
    var clientIndex = rooms[data].indexOf(client);
    rooms[data].splice(clientIndex, 1)
  })
});

server.listen(8000);
console.log('server started...')
