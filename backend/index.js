const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:19006",
    }
});


io.on('connection', client => {
  client.on('connect', () => {
      console.log('client connected');
  });

  client.on('disconnect', () => {
    console.log('client disconnected');
  });
});

server.listen(8000);