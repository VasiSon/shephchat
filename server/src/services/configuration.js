const fs = require('fs')
const helpers = require('../helpers')

class Configuration {

    constructor(){
        this.config = {}
        this.loadConfiguration()
    }

    loadConfiguration(){
        let files = fs.readdirSync('./configuration').filter((file) => {
       
            return helpers.getFileExtension(file) === 'json'
        })

        files.forEach((file) => {
            let filename = helpers.getFilename(file)
            try {
                this.config[filename] = require(`../../configuration/${file}`)
            } catch (error) {
                console.error(`Ошибка чтения файла конфигурации <${filename}.json>`)
            }
        })
    }

}

module.exports = Configuration