'use strict';

const readline = require('readline');
const fs = require('fs');

const csvFile = process.argv[2];
const outFile = process.argv[3];

if (typeof csvFile !== 'string' || csvFile.length === 0) process.exit(1);

const rl = readline.createInterface({
  input: fs.createReadStream(csvFile)
});

var gotTitles = false;
var titles = [];
var json = [];

rl.on('line', (line) => {
  let items = line.split(',');

  if (gotTitles) {
      let expenseEntry = {};
      titles.forEach((title, idx) => {
        let value = items[idx].trim();
        if (title === 'participants') {
          value = value.split(',');
          value = value.map((v) => v.trim());
        }
        expenseEntry[title] = value;
      });

      json.push(expenseEntry);
  }
  else {
    titles = line.split(',');
    gotTitles = true;
  }
});

rl.on('close', () => {
  if (typeof outFile === 'string') {
    fs.writeFileSync(outFile, JSON.stringify(json, null, 2));
  }
  else {
    console.log(json);
  }
})
