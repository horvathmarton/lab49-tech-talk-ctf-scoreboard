const { Client } = require("pg");

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) throw new Error("DATABASE_URL is not provided!");

const client = new Client({
  connectionString: DATABASE_URL,
});

const insertAttempt = async (name, challenge, flag) => {
  await client.query(
    `
    INSERT INTO attempt (name, challenge, flag)
    VALUES ($1, $2, $3)
  `,
    [name, challenge, flag]
  );
};

const insertSubmission = async (name, challenge, flag) => {
  await client.query(
    `
    INSERT INTO submission (name, challenge, flag)
    VALUES ($1, $2, $3)
  `,
    [name, challenge, flag]
  );
};

const selectScoreboard = async () => {
  const scoreboard = await client.query(`
        SELECT name, (COUNT(*) * 100) AS score, MAX(submitted) AS last_submission
        FROM submission
        GROUP BY name
        ORDER BY COUNT(*) DESC, MAX(submitted) ASC
    `);

  return scoreboard;
};

const selectSubmission = async (user, challenge) => {
  const submission = await client.query(
    `
        SELECT *
        FROM submission
        WHERE name = $1
            AND challenge = $2
    `,
    [user, challenge]
  );

  return submission;
};

const selectChallenges = async () => {
  const challenges = await client.query(
    `
      SELECT name
      FROM challenge
    `
  );

  return challenges;
};

const selectChallenge = async (name) => {
  const challenge = await client.query(
    `
    SELECT name, flag
    FROM challenge
    WHERE name = $1
  `,
    [name]
  );

  return challenge;
};

module.exports = {
  insertAttempt,
  insertSubmission,
  selectScoreboard,
  selectSubmission,
  selectChallenges,
  selectChallenge,
};

(async () => {
  await client.connect();
})();
