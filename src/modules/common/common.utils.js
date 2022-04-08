const  {NUMBER_THOUSAND} = require("./common-constants")

exports.getRandomNumber = () => {
    return Math.floor(Math.random() * NUMBER_THOUSAND) + 1;
}

exports.getRandomNumberFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}