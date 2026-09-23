const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const stream = require('stream');
const { Bot } = require('node-telegram-bot-api');
const { createWebhookServer } = require('node-telegram-bot-api/node');

function invokeServer(server, { method = 'POST', path = '/telegram', headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const req = new stream.Readable({
      read() {
        if (body) this.push(typeof body === 'string' ? body : JSON.stringify(body));
        this.push(null);
      },
    });
    req.method = method;
    req.url = path;
    req.headers = headers;

    const res = new stream.Writable({
      write(chunk, encoding, callback) {
        callback();
      },
    });
    res.statusCode = 200;
    res.headers = {};
    res.writeHead = (status, hdrs = {}) => {
      res.statusCode = status;
      res.headers = { ...res.headers, ...hdrs };
    };
    res.setHeader = (name, val) => {
      res.headers[name.toLowerCase()] = val;
    };
    res.end = () => {
      resolve({ statusCode: res.statusCode });
    };

    server.emit('request', req, res);
    res.on('error', reject);
    req.on('error', reject);
  });
}

test('webhook rejects missing secret token with 401', async () => {
  const bot = new Bot('123456:ABC-DEF');
  const server = createWebhookServer(bot, { path: '/telegram', secretToken: 'test-secret-token' });
  const update = { update_id: 1, message: { message_id: 1, chat: { id: 1 }, text: 'hi' } };
  const res = await invokeServer(server, {
    body: update,
    headers: { 'content-type': 'application/json' },
  });
  assert.equal(res.statusCode, 401);
});

test('webhook accepts valid secret and update', async () => {
  const bot = new Bot('123456:ABC-DEF');
  const secret = 'test-secret-token';
  const server = createWebhookServer(bot, { path: '/telegram', secretToken: secret });
  const update = { update_id: 2, message: { message_id: 2, chat: { id: 99 }, text: 'hello' } };
  const res = await invokeServer(server, {
    body: update,
    headers: {
      'content-type': 'application/json',
      'x-telegram-bot-api-secret-token': secret,
    },
  });
  assert.equal(res.statusCode, 200);
});
