const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', container: 'cloudops-monitor-lite' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});