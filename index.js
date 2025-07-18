const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'squat_data.txt');

function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return raw.split('\n').filter(Boolean).map(line => {
    const [date, weight, reps] = line.split(',');
    return { date, weight, reps };
  });
}

function writeData(entry) {
  fs.appendFileSync(DATA_FILE, `${entry.date},${entry.weight},${entry.reps}\n`);
}

app.get('/', (req, res) => {
  const data = readData();
  res.render('index', { data, goal: 'Your squat goal by end of year!' });
});

app.post('/add', (req, res) => {
  const { date, weight, reps } = req.body;
  writeData({ date, weight, reps });
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Squat Tracker running on http://localhost:${PORT}`);
});
