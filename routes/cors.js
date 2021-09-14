const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) { //remember that indexOf returns -1 if it is falsy
        corsOptions = { origin: true }; //origin was found and the request should be accepted
    } else {
        corsOptions = { origin: false }; //origin not found and request should be rejected
    }
    callback(null, corsOptions);
};



exports.cors = cors(); //this will allow cors for all origins
exports.corsWithOptions = cors(corsOptionsDelegate); //this only allows what the corsOptionsDelegate determines to be a part of the whitelist; will send back the cors response header of Access Control Allow Origin with the whitelisted origin as the value; if rejected, it won't include the cors response header at all