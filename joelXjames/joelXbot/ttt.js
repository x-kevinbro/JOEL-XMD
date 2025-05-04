import config from '../../config.cjs';

let tttGames = {};

const ttt = async (m, sock) => {
  const from = m.from;
  const sender = m.sender;
  const prefix = config.PREFIX || ".";

  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : "";

  // Start or Join
  if (cmd === "ttt") {
    if (!tttGames[from]) {
      tttGames[from] = {
        playerX: sender,
        playerO: null,
        board: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
        turn: "X",
        messageId: null,
      };

      return m.reply(`🔥 Game Created by *${sender}*
🌠 Waiting for second player...
Type *${prefix}ttt* to join and start the match!`);
    }

    const game = tttGames[from];

    if (!game.playerO && sender !== game.playerX) {
      game.playerO = sender;

      const boardText = drawBoard(game.board);
      const msg = await sock.sendMessage(from, {
        text: `🚀 *Game Started!*\n\n${boardText}\n❌ *${game.playerX}* vs ⭕ *${game.playerO}*\n🔥 It's *${game.playerX}*'s (❌) turn!`,
      });
      game.messageId = msg.key.id;
      return;
    }

    return m.reply("⚠️ Game already started. Wait for your turn or reply with a number (1-9).");
  }

  // Make a move
  const game = tttGames[from];
  if (!game || !game.playerO) return;

  const validPlayers = [game.playerX, game.playerO];
  if (!validPlayers.includes(sender)) return;

  const move = m.body.trim();
  if (!/^[1-9]$/.test(move)) return;

  const pos = parseInt(move) - 1;
  if (game.board[pos] === "❌" || game.board[pos] === "⭕") {
    return m.reply("❌ That position is already taken!");
  }

  const symbol = game.turn === "X" ? "❌" : "⭕";
  const currentPlayer = game.turn === "X" ? game.playerX : game.playerO;

  if (sender !== currentPlayer) {
    return m.reply("⏳ Not your turn yet!");
  }

  game.board[pos] = symbol;
  const boardText = drawBoard(game.board);

  // Check win or draw
  const winner = checkWinner(game.board);
  if (winner) {
    await sock.sendMessage(from, {
      text: `🎉 *Game Over!*\n\n${boardText}\n🏆 Winner: *${currentPlayer}* (${symbol})`,
    });
    delete tttGames[from];
    return;
  }

  if (game.board.every(cell => isNaN(cell))) {
    await sock.sendMessage(from, {
      text: `⚖️ *Draw!*\n\n${boardText}`,
    });
    delete tttGames[from];
    return;
  }

  // Next turn
  game.turn = game.turn === "X" ? "O" : "X";
  const nextPlayer = game.turn === "X" ? game.playerX : game.playerO;
  const nextSymbol = game.turn === "X" ? "❌" : "⭕";

  await sock.sendMessage(from, {
    text: `🎮 *Game Continues!*\n\n${boardText}\n🔥 It's *${nextPlayer}*'s (${nextSymbol}) turn!`,
  });
};

function drawBoard(board) {
  return `
╭────────────╮
 ${board[0]} | ${board[1]} | ${board[2]}
────────────
 ${board[3]} | ${board[4]} | ${board[5]}
────────────
 ${board[6]} | ${board[7]} | ${board[8]}
╰────────────╯`;
}

function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diags
  ];
  for (const [a, b, c] of winPatterns) {
    if (board[a] === board[b] && board[b] === board[c]) {
      return board[a]; // ❌ or ⭕
    }
  }
  return null;
}

export default ttt;
