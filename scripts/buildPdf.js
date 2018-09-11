var fs = require('fs');
var pdf = require('html-pdf');

const srcPath = './src'
const distPath = './public'

var html = fs.readFileSync(`${distPath}/resume.html`, 'utf8');
var options = { 
  format: 'Letter',
  width: "595px",        // allowed units: mm, cm, in, px
  height: "842px", 
  border: {         
  },
 };

pdf.create(html, options).toFile(`${distPath}/index.pdf`, function(err, res) {
  if (err) return console.log(err);
  console.log(res);
});