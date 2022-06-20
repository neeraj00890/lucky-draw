
exports.getRandomNumber = (numbers) => {
    return Math.floor(Math.random() * numbers) + 1;
}

exports.getRandomNumberFromArray = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}