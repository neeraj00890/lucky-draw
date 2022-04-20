const {
  getRandomNumber,
  getRandomNumberFromArray,
} = require("../common/common.utils");

const {
  NUMBER_THOUSAND,
  WINNING_TYPES,
} = require("../common/common-constants");
const messages = require("../common/response-messages");

const WinningPrice = require("./winning-prize.model");
const LuckydrawRedemption = require("./lucky-draw-redemption.model");

function getGoldList() {
  return [getRandomNumber()];
}

function getSilverList(blackListNumbers) {
  const silverList = [];
  while (silverList.length != 9) {
    const number = getRandomNumber();
    if (!blackListNumbers.includes(number)) {
      silverList.push(number);
    }
  }
  return silverList;
}

function getBrownList(blackListNumbers) {
  const oneToThousand = Array.from(
    { length: NUMBER_THOUSAND },
    (_, i) => i + 1
  );
  return oneToThousand.filter((number) => !blackListNumbers.includes(number));
}

async function handleGoldWinner(address, winningPrizes, randomNumber) {
  const returnObject = {};
  returnObject.winningType = WINNING_TYPES.GOLD;
  await LuckydrawRedemption.create({
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

async function handleSilverWinner(address, winningPrizes, randomNumber) {
  const returnObject = {};
  returnObject.winningType = WINNING_TYPES.SILVER;
  await LuckydrawRedemption.create({
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

async function handleBrownWinner(address, winningPrizes, randomNumber) {
  const returnObject = {};
  returnObject.winningType = WINNING_TYPES.BROWN;
  await LuckydrawRedemption.create({
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

exports.initializeWinningPrize = async function () {
  const initialCount = await WinningPrice.countDocuments({});
  console.log(initialCount);
  if (initialCount > 0) {
    return {
      message: messages.DATA_EXISTS,
    };
  }

  const goldPrizes = getGoldList();
  const silverPrizes = getSilverList(goldPrizes);
  const brownPrizes = getBrownList([...silverPrizes, ...goldPrizes]);
  await WinningPrice.create({
    goldPrizes,
    silverPrizes,
    brownPrizes,
    availableGoldPrizes: goldPrizes,
    availableSilverPrizes: silverPrizes,
    availablebrownPrizes: brownPrizes,
  });

  return {
    message: messages.SUCCESS_INIT_SCRIPT,
  };
};

async function checkAlready(address) {
  const res = await LuckydrawRedemption.findOne({ address: address });
  if (res !== null) {
    console.log("Already Present");
    return res.winningType;
  } else {
    return null;
  }
}

exports.redeemPrize = async function (address) {
  let returnObject = {};

  const res = await checkAlready(address);
  if (res !== null) {
    console.log("Returning present value");
    returnObject.winningType = res.winningType;
    return returnObject;
  }
  const winningPrizes = await WinningPrice.findOne({});
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
    console.log(
      address,
      isBrownWinner,
      isSilverWinner,
      isGoldWinner,
      randomNumber
    );
    if (isGoldWinner) {
      returnObject = await handleGoldWinner(
        address,
        winningPrizes,
        randomNumber
      );
    } else if (isSilverWinner) {
      returnObject = await handleSilverWinner(
        address,
        winningPrizes,
        randomNumber
      );
    } else if (isBrownWinner) {
      returnObject = await handleBrownWinner(
        address,
        winningPrizes,
        randomNumber
      );
    }
  } else {
    returnObject.winningType = "NONE(No Number Available)";
  }
  return returnObject;
};

exports.fetchGoldSilverUsers = async function () {
  const data = await LuckydrawRedemption.find(
    {
      $or: [
        { winningType: WINNING_TYPES.SILVER },
        { winningType: WINNING_TYPES.GOLD },
      ],
    },
    { address: 1, winningType: 1 }
  );
  return data;
};
