var fs = require('fs');
var pdf = require('html-pdf');

const srcPath = './src'
const distPath = './public'

var html = fs.readFileSync(`${distPath}/resume.html`, 'utf8');
var options = { 
  format: 'Letter',
  base: "http://localhost:5000/assets/style.css",
  border: {
    top: "0.5in",            // default is 0, units: mm, cm, in, px
    right: "0.5in",
    bottom: "0.5in",
    left: "0.5in"
  },
 };

pdf.create(html, options).toFile(`${distPath}/index.pdf`, function(err, res) {
  if (err) return console.log(err);
  console.log(res); // { filename: '/app/businesscard.pdf' }
});