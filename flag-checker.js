const { selectChallenge } = require("./database");

module.exports.checkFlag = async (challengeName, flag) => {
  const challenges = (await selectChallenge(challengeName)).rows;

  if (challenges.length === 0) {
    return false;
  }

  const [challenge] = challenges;

  return challenge.flag === flag;
};
