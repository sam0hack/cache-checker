var https = require("https");

/* Add the path to the website here */
var options = {
  host: "ilmtechnosolutions.com",
  method: "get",
  path: "/",
};

var req = https.request(options, function (res) {
  if (res.socket.authorized) {
    console.log("The website uses SSL Certificate!!");
  } else {
    console.log("The website does not use SSL Certificate!!");
  }
});

req.end();
