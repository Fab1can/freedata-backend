const http = require('http');

function cleanStringify(object) {
    if (object && typeof object === 'object') {
        object = copyWithoutCircularReferences([object], object);
    }
    return JSON.stringify(object);

    function copyWithoutCircularReferences(references, object) {
        var cleanObject = {};
        Object.keys(object).forEach(function(key) {
            var value = object[key];
            if (value && typeof value === 'object') {
                if (references.indexOf(value) < 0) {
                    references.push(value);
                    cleanObject[key] = copyWithoutCircularReferences(references, value);
                    references.pop();
                } else {
                    cleanObject[key] = '###_Circular_###';
                }
            } else if (typeof value !== 'function') {
                cleanObject[key] = value;
            }
        });
        return cleanObject;
    }
}

const requestListener = function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(cleanStringify(req));
}

const server = http.createServer(requestListener);
server.listen(9090);

console.log("Server running");
