const markdox = require('markdox')
const mkdirp = require('mkdirp')

function runMarkdox(options) {
  markdox.process(
    options.src,
    {output: options.output, template: options.template},
    (err) => {
      if (err) console.error(err)
      else console.log('File `' + options.output + '` generated with success')
    }
  )
}

function generateDocs(options) {
  mkdirp('./docs', (err) => {
    if (err) console.error(err)
    else runMarkdox(options)
  })
}

generateDocs({
  src: './src/index.js',
  output: './docs/api.md',
  template: './scripts/cycle-docs-template.md.ejs',
})
