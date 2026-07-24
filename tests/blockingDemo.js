const fs = require("fs");

console.log("Start");

fs.readFile("package.json", "utf8", (err, data) => { // non-blocking..waits for file to read and then prints it
    console.log("File read");
});

console.log("End");