const mjml2html = require('mjml')
const path = require('path')
const fs = require('fs')
const {promisify} = require('es6-promisify')

async function main () {
  const files = (await promisify(fs.readdir)(path.resolve(__dirname)))
    .filter(f => f.endsWith('.mjml'))

  files.forEach(file => {
    console.log(`Processing ${file}`)
    let replaces = {}
    const replacesFile = path.resolve(__dirname, file.replace('.mjml', '-replace.json'))
    if (fs.existsSync(replacesFile)) {
      replaces = JSON.parse(fs.readFileSync(replacesFile))
    }

    let mjmlContent = fs.readFileSync(path.resolve(__dirname, file)).toString()
    if (Object.keys(replaces).length) {
      Object.keys(replaces).forEach(k => {
        mjmlContent = mjmlContent.replace(new RegExp(k, 'g'), replaces[k])
      })
    }

    const htmlContent = mjml2html(mjmlContent, {beautify: true}).html
    fs.writeFileSync(path.resolve(__dirname, '../mail-templates', file.replace('.mjml', '.html')), htmlContent)
    console.log(`Finished ${file}`)
  })
}

main()
