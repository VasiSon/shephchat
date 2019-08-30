module.exports = {
    getFileExtension(file){
        return file.split('.')[1]
    },
    getFilename(file){
        return file.split('.')[0]
    },
    getRandomNumber(min, max){
        return Math.floor(Math.random() * (max - min)) + min
    },
    getRandomString(length){
        const SYMBOLS = "abcdef0123456789"
        let result = ""
        for(let i = 0; i < length; i++){
            result += SYMBOLS[this.getRandomNumber(0, SYMBOLS.length - 1)]
        }
        return result;
    },
    bindSingletone(serviceContainer, key, _class){
        serviceContainer.singleton(key, (container) => {
            return new _class(container)
        })
    },
    bindSingletones(serviceContainer, singletones){
        for(let key in singletones) {
            this.bindSingletone(serviceContainer, key, singletones[key]);
        }    
    },
}