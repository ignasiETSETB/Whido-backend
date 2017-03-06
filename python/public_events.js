var PythonShell = require('python-shell');

var options = {
  mode: 'text',
  // pythonPath: './python',
  pythonOptions: ['-u'],
  scriptPath: './python',
  args: ['party', 'place', 43.3, 2.3]
};

PythonShell.run('search.py', options, function (err, results) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution
  console.log('Facebook events added to db');
});