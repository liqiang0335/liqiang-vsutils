const fs = require("fs");
const getLocalFile = require("./getLocalFile");
const filePath = getLocalFile("ynw.config.js");
const exsits = fs.existsSync(filePath);
module.exports = exsits ? require(filePath) : {};
