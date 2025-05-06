import config from '../../config.cjs';

const wcgGames = {};

const wcg = async (m, sock) => {
  const from = m.from;
  const sender = m.sender;
  const prefix = config.PREFIX || ".";

  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : "";

  // Start WCG game
  if (cmd === "wcg") {
    if (wcgGames[from]) {
      return m.reply("⚠️ A game is already in progress!\nType your number guess (1-20) to play.");
    }

    const number = Math.floor(Math.random() * 20) + 1;
    wcgGames[from] = { number, attempts: {}, startedBy: sender };

    return m.reply(`🎯 *WCG Game Started!*\nTry to guess a number between *1 - 20*.\nType a number to play!`);
  }

  // Reset WCG game
  if (cmd === "resetwcg") {
    if (wcgGames[from]) {
      delete wcgGames[from];
      return m.reply("♻️ *WCG game has been reset!*");
    } else {
      return m.reply("❌ No active WCG game to reset.");
    }
  }

  // Ongoing game logic
  const game = wcgGames[from];
  if (!game) return;

  const guess = parseInt(m.body.trim());
  if (isNaN(guess) || guess < 1 || guess > 20) return;

  if (game.attempts[sender]) {
    return m.reply("⏳ You've already guessed! Wait for others or reset.");
  }

  game.attempts[sender] = guess;

  if (guess === game.number) {
    delete wcgGames[from];
    return sock.sendMessage(from, {
      text: `🏆 *Correct Guess!* ${sender} guessed the number *${guess}*!`,
    });
  } else {
    return m.reply(`❌ Wrong guess! ${guess} is not correct.`);
  }
};
// codes by joeljamestech 
export default wcg;
