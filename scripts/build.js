const fse = require('fs-extra')
const path = require('path')
const { promisify } = require('util')
const ejsRenderFile = promisify(require('ejs').renderFile)
const globP = promisify(require('glob'))
const config = require('../site.config')
const marked = require('marked');
const frontMatter = require('front-matter');

const srcPath = './src'
const distPath = './public'

// clear destination folder
fse.emptyDirSync(distPath)

// copy assets folder
fse.copy(`${srcPath}/assets`, `${distPath}/assets`)

// read page templates
globP('**/*.@(md|ejs|html)', { cwd: `${srcPath}/pages` })
  .then((files) => {
    files.forEach((file) => {
      const fileData = path.parse(file)
      const destPath = path.join(distPath, fileData.dir)

      // create destination directory
      fse.mkdirs(destPath)
        // .then(() => {
        //   // render page
        //   return ejsRenderFile(`${srcPath}/pages/${file}`, Object.assign({}, config))
        // })
        .then(() => {
          // read page file
          return fse.readFile(`${srcPath}/pages/${file}`, 'utf-8')
        })
        .then((data) => {
          // extract front matter
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
          // render layout with page contents
          return ejsRenderFile(`${srcPath}/layouts/default.ejs`, Object.assign({}, data.templateConfig, { body: data.pageContent }))
        })
        .then((layoutContent) => {
          // save the html file
          fse.writeFile(`${destPath}/${fileData.name}.html`, layoutContent)
        })
        .catch((err) => { console.error(err) })
    })
  })
  .catch((err) => { console.error(err) })