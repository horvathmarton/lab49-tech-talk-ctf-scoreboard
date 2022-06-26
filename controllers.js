const { body, validationResult } = require("express-validator");
const { format } = require("date-fns");
const { checkFlag } = require("./flag-checker");
const {
  insertAttempt,
  insertSubmission,
  selectSubmission,
  selectScoreboard,
  selectChallenges,
} = require("./database");

const { CHALLENGES_URL } = process.env;

if (!CHALLENGES_URL) throw new Error("CHALLENGES_URL is not provided.");

const renderFlagSubmissionForm = async (res, errors) => {
  const challenges = (await selectChallenges()).rows;

  return res.render("flag-submission", {
    challenges,
    errors,
    challengesUrl: CHALLENGES_URL,
  });
};

const getScoreboard = async (req, res) => {
  const scoreboard = await selectScoreboard();
  const users = scoreboard.rows.map((user, idx) => ({
    position: `#${idx + 1}`,
    name: user.name,
    score: user.score,
    lastSubmission: format(user.last_submission, "yyyy-MM-dd HH:mm:ss.SSS"),
  }));

  res.render("scoreboard", { users, challengesUrl: CHALLENGES_URL });
};

const getFlagSubmissionForm = async (req, res) => renderFlagSubmissionForm(res);

const submitFlag = [
  body("username", "Please enter a username.")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Username must be at least 2 characters.")
    .isAlphanumeric()
    .withMessage("Username can only contain alphanumeric characters."),
  body("flag", "Flag cannot be empty.")
    .trim()
    .matches(/^LAB49{[a-zA-Z0-9_]+}$/)
    .withMessage("The flag format is LAB49{[a-zA-Z0-9_]+}"),
  body("challenge", "Please select a challenge."),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return renderFlagSubmissionForm(
        res,
        errors.array().map((error) => error.msg)
      );
    }

    const { challenge, flag, username } = req.body;

    await insertAttempt(username, challenge, flag);

    if (!(await checkFlag(challenge, flag))) {
      return renderFlagSubmissionForm(res, [
        "Sorry, this is not the flag for this challenge.",
      ]);
    }

    const hasSubmitted =
      (await selectSubmission(username, challenge)).rows.length > 0;

    if (hasSubmitted) {
      return renderFlagSubmissionForm(res, [
        "You already submitted this flag successfully.",
      ]);
    }

    await insertSubmission(username, challenge, flag);

    res.redirect("/scoreboard");
  },
];

module.exports = {
  getScoreboard,
  getFlagSubmissionForm,
  submitFlag,
};
