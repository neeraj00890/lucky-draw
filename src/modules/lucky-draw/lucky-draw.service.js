const {
  getRandomNumber,
  getRandomNumberFromArray,
} = require("../common/common.utils");

const {
  WINNING_TYPES,
} = require("../common/common-constants");
const messages = require("../common/response-messages");

const WinningPrize = require("./winning-prize.model");
const Race = require("./race.model");
const LuckydrawRedemption = require("./lucky-draw-redemption.model");

function getGoldList(numbers) {
  return [getRandomNumber(numbers)];
}

function getSilverList(blackListNumbers,numbers) {
  const silverList = [];
  while (silverList.length < 9) {
    const number = getRandomNumber(numbers);
    if (!blackListNumbers.includes(number) && !silverList.includes(number)) {
      silverList.push(number);
    }
  }
  return silverList;
}

function getBrownList(blackListNumbers,numbers) {
  const availableNumbers = [];
  for (let number = 1; number <= numbers; number++) {
    if (!blackListNumbers.includes(number)) {
      availableNumbers.push(number);
    }
  }
  return availableNumbers;
}

async function handleGoldWinner(address, winningPrizes, randomNumber, race) {
  const returnObject = {};
  returnObject.winningType = WINNING_TYPES.GOLD;
  await LuckydrawRedemption.create({
    race,
    address,
    winningType: WINNING_TYPES.GOLD,
    winningNumber: randomNumber,
  });
  winningPrizes.availableGoldPrizes = winningPrizes.availableGoldPrizes.filter(
    (goldPrizeNumber) => goldPrizeNumber != randomNumber
  );
  winningPrizes.save();
  return returnObject;
}

async function handleSilverWinner(address, winningPrizes, randomNumber, race) {
  const returnObject = {};
  returnObject.winningType = WINNING_TYPES.SILVER;
  await LuckydrawRedemption.create({
    race,
    address,
    winningType: WINNING_TYPES.SILVER,
    winningNumber: randomNumber,
  });
  winningPrizes.availableSilverPrizes =
    winningPrizes.availableSilverPrizes.filter(
      (silverPrizeNumber) => silverPrizeNumber != randomNumber
    );
  winningPrizes.save();
  return returnObject;
}

async function handleBrownWinner(address, winningPrizes, randomNumber, race) {
  const returnObject = {};
  returnObject.winningType = WINNING_TYPES.BROWN;
  await LuckydrawRedemption.create({
    race,
    address,
    winningType: WINNING_TYPES.BROWN,
    winningNumber: randomNumber,
  });
  winningPrizes.availablebrownPrizes =
    winningPrizes.availablebrownPrizes.filter(
      (brownPrizeNumber) => brownPrizeNumber != randomNumber
    );
  winningPrizes.save();
  return returnObject;
}

exports.initializeWinningPrize = async function (args) {
  let { races, numbers } = args; // "ABC,XYZ,"
  races = races?.split(",");
  const racesDocument = await Race.findOne({}, null, { lean: 1 });
  let racesObject;
  let alreadyPresentRaces = [];
  let newRaces = [];
  let racesCreate = [];
  if (racesDocument) {
    racesObject = racesDocument;
    alreadyPresentRaces = racesObject.races
      .filter((race) => races.includes(race.name))
      .map((race) => {
        return race.name;
      });
    newRaces = races.filter((race) => !alreadyPresentRaces.includes(race));
    racesCreate = [...racesObject.races];
  }

  if (newRaces.length || !racesDocument) {
    races = !racesDocument ? races : newRaces;
    const winningPrizesPromise = [];
    for (const race of races) {
      const goldPrizes = getGoldList(numbers);
      const silverPrizes = getSilverList(goldPrizes,numbers);
      const brownPrizes = getBrownList([...silverPrizes, ...goldPrizes],numbers);
      winningPrizesPromise.push(
        WinningPrize.create({
          race,
          goldPrizes,
          silverPrizes,
          brownPrizes,
          availableGoldPrizes: goldPrizes,
          availableSilverPrizes: silverPrizes,
          availablebrownPrizes: brownPrizes,
        }).then((result) => {
          return result;
        })
      );
    }
    const winningPrizesResult = await Promise.all(winningPrizesPromise);
    for (const idx in races) {
      racesCreate.push({
        name: races[idx],
        prizes: winningPrizesResult[idx],
      });
    }

    !racesDocument
      ? await Race.create({ races: racesCreate })
      : await Race.updateOne({}, { $set: { races: racesCreate } });

    return {
      message: messages.SUCCESS_INIT_SCRIPT,
    };
  }
};

exports.redeemPrize = async function (address, race) {
  let returnObject = {};
  const existingPrize = await LuckydrawRedemption.findOne({ address, race });
  if (existingPrize) {
    returnObject.winningType = existingPrize.winningType;
    returnObject.message = messages.ALREADY_REDEEM;
    return returnObject;
  }
  const winningPrizes = await WinningPrize.findOne({ race });
  if (!winningPrizes) {
    throw new Error(`Prizes corresponding to ${race} does not exists`);
  }
  const totalAvailableNumbers = [
    ...winningPrizes.availableGoldPrizes,
    ...winningPrizes.availableSilverPrizes,
    ...winningPrizes.availablebrownPrizes,
  ];
  if (totalAvailableNumbers.length) {
    const randomNumber = getRandomNumberFromArray(totalAvailableNumbers);
    const isGoldWinner =
      winningPrizes.availableGoldPrizes.includes(randomNumber);
    const isSilverWinner =
      winningPrizes.availableSilverPrizes.includes(randomNumber);
    const isBrownWinner =
      winningPrizes.availablebrownPrizes.includes(randomNumber);
    if (isGoldWinner) {
      returnObject = await handleGoldWinner(
        address,
        winningPrizes,
        randomNumber,
        race
      );
    } else if (isSilverWinner) {
      returnObject = await handleSilverWinner(
        address,
        winningPrizes,
        randomNumber,
        race
      );
    } else if (isBrownWinner) {
      returnObject = await handleBrownWinner(
        address,
        winningPrizes,
        randomNumber,
        race
      );
    }
  } else {
    returnObject.winningType = "NONE(No Number Available)";
  }
  return returnObject;
};

exports.fetchGoldSilverUsers = async function (race) {
  const data = await LuckydrawRedemption.find(
    {
      race,
      $or: [
        { winningType: WINNING_TYPES.SILVER },
        { winningType: WINNING_TYPES.GOLD },
      ],
    },
    { address: 1, winningType: 1 }
  );
  return data;
};
