const fse = require('fs-extra')
const fs = require('fs');
const path = require('path')
const { promisify } = require('util')
const ejsRenderFile = promisify(require('ejs').renderFile)
const globP = promisify(require('glob'))
const config = require('../site.config')
const marked = require('marked');
const frontMatter = require('front-matter');

const srcPath = './src'
const distPath = './public'

fse.emptyDirSync(distPath)

globP('**/*.@(md|ejs|html)', { cwd: `${srcPath}/pages` })
  .then((files) => {
    files.forEach((file) => {
      const fileData = path.parse(file)
      const destPath = path.join(distPath, fileData.dir)
      fse.mkdirs(destPath)
        .then(() => {
          return fse.readFile(`${srcPath}/pages/${file}`, 'utf-8')
        })
        .then((data) => {
          const pageData = frontMatter(data)
          const templateConfig = Object.assign({}, config, { page: pageData.attributes })
          let pageContent  
          switch (fileData.ext) {
            case '.md':
              pageContent = marked(pageData.body)
              break
            case '.ejs':
              pageContent = ejs.render(pageData.body, templateConfig)
              break
            default:
              pageContent = pageData.body
          }
          return {pageContent,templateConfig}
        })
        .then((data) => {
          var style = fs.readFileSync(`${srcPath}/style/style.css`, 'utf8');
          return ejsRenderFile(`${srcPath}/layouts/default.ejs`, Object.assign({}, data.templateConfig, { body: data.pageContent,style:style }))
        })
        .then((layoutContent) => {
          fse.writeFile(`${destPath}/${fileData.name}.html`, layoutContent)
        })
        .catch((err) => { console.error(err) })
    })
  })
  .catch((err) => { console.error(err) })