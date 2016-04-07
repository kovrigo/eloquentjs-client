import http from 'http';
import 'isomorphic-fetch';

function mock(respondWith, respondTo) {

    if (typeof respondWith !== 'string') {
        respondWith = JSON.stringify(respondWith);
    }

    let server = http.createServer(function (req, res) {
        let body = '';

        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6) req.connection.destroy();
        });

        req.on('end', function () {
            req.body = body;

            res.end(respondWith);
            server.close();

            if ( ! requestMatches(req, respondTo)) {
                throw `Request [${req.url}}] does not match pattern`;
            }
        });
    });

    server.listen(8000, '127.0.0.1');

    return server;
}

function requestMatches(request, pattern) {
    if ( ! pattern) return true;

    if (typeof pattern === 'object') {
        if (typeof pattern[request.method] === 'undefined') return false;
        pattern = pattern[request.method];
    }

    if (typeof pattern === 'function') return pattern(request);

    return request.url === `/${pattern}`;
}

mock.url = (url) => 'http://127.0.0.1:8000/'+url;

export default mock
