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
  let interval;
  function sendStatus() {
    componentIndex =
      componentIndex < percentComplete.length ? componentIndex : 0;
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
      socket.emit('status', status);
    } else {
      clearInterval(interval);
    }
  }
  setTimeout(() => {
    interval = setInterval(sendStatus, 200);
  }, 2000);
});

const port = process.env.PORT || 80;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
