const express = require('express');
const httpProxy = require('http-proxy');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const proxy = httpProxy.createProxyServer({});

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <html>
    <body>
      <form action="/proxy" method="post">
        <input type="text" name="url" placeholder="Enter URL to proxy" style="width: 80%;">
        <input type="submit" value="Go">
      </form>
    </body>
    </html>
  `);
});

app.post('/proxy', (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  proxy.web(req, res, { target: url, changeOrigin: true }, (error) => {
    res.status(500).send('Proxy error: ' + error.message);
  });
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
