// The node program that captures local performance data
// and sends it up to the socket.io server
// Req:
// - farmhash
// - socket.io-client
//data in arg is a object { user: ...}
module.exports = function (data) {
  console.log('called from ipc renderer');
  const os = require('os');
  const io = require('socket.io-client');
  let socket = io('http://127.0.0.1:8181');

  socket.on('connect', () => {
    // console.log('I connected to the socket server... Yaay!')
    // we need a way to identify this machine to whomever concerned
    const nI = os.networkInterfaces();
    // console.log(nI)
    let macA;
    // loop through all the nI for this machine and find a non-internal one
    for (let key in nI) {
      // FOR TESTING PURPOSES!!!
      // macA = Math.floor(Math.random() * 3) + 1;
      // break;
      // FOR TESTING PURPOSES!!!

      if (!nI[key][0].internal) {
        // if (nI[key][0].mac === '00:00:00:00:00:00') {
        //   macA = Math.random().toString(36).substr(2, 15);
        // } else {
        macA = nI[key][0].mac;
        console.log(macA);
        // }
        // break;
      }
    }

    // client auth with single key value
    socket.emit('clientAuth', '5t78yuhgirekjaht32i3');
    socket.emit('userData', data);
  });
};
