const ContainerBuilder = require('js-service-container').ContainerBuilder

const Helpers = require('../helpers')

const singletones = {
    configuration: require('../services/configuration'),
    connection: require('../services/connection'),
    user: require('../services/user'),
    message: require('../services/message')
}

const serviceContainer = new ContainerBuilder()

Helpers.bindSingletones(serviceContainer, singletones)

module.exports = serviceContainer.build()
