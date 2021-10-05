const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  let percentComplete = new Array(10).fill(0);
  let componentIndex = 0;
  function sendStatus() {
    componentIndex =
      componentIndex < percentComplete.length ? componentIndex : 0;
    console.log('componentIndex: ', componentIndex);
    if (percentComplete[componentIndex] < 100) {
      percentComplete[componentIndex] += 10;
    } else {
      componentIndex += 1;
    }
    if (componentIndex < percentComplete.length) {
      const status = {
        percent: percentComplete[componentIndex],
        componentIndex: componentIndex,
      };
      console.log('status: ', JSON.stringify(status));
      socket.emit('status', status);
    } else {
      clearInterval(interval);
    }
  }
  const interval = setInterval(sendStatus, 200);
});

const port = process.env.PORT || 80;
server.listen(80, () => {
  console.log(`listening on *:${port}`);
});