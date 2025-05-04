import config from '../../config.cjs';

const tttGames = {};

function renderBoard(board) {
  return `
  ╭───────────────╮
    ${board[0] === ' ' ? '1️⃣' : board[0]} | ${board[1] === ' ' ? '2️⃣' : board[1]} | ${board[2] === ' ' ? '3️⃣' : board[2]}
   ───────────────
    ${board[3] === ' ' ? '4️⃣' : board[3]} | ${board[4] === ' ' ? '5️⃣' : board[4]} | ${board[5] === ' ' ? '6️⃣' : board[5]}
   ───────────────
    ${board[6] === ' ' ? '7️⃣' : board[6]} | ${board[7] === ' ' ? '8️⃣' : board[7]} | ${board[8] === ' ' ? '9️⃣' : board[8]}
  ╰───────────────╯
  `.replace(/X/g, '*🅧*').replace(/O/g, '*🅾*');
}

function checkWinner(board) {
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (let [a, b, c] of wins) {
    if (board[a] !== ' ' && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.includes(' ') ? null : 'draw';
}

const ttt = async (m, sock) => {
  const prefix = config.PREFIX || '.';
  const body = m.body || '';
  const cmd = body.startsWith(prefix) ? body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const from = m.from;
  const sender = m.sender;

  const game = tttGames[from];

  // If the command is not valid, ignore the message
  if (!['ttt'].includes(cmd)) return;

  if (cmd === 'ttt') {
    if (!game) {
      tttGames[from] = {
        board: Array(9).fill(' '),
        players: [sender],
        turn: 0,
        started: false
      };
      return sock.sendMessage(from, {
        text: `🔥 *${m.pushName}* has created a Tic Tac Toe game! 🌟\n\n🌠 *Waiting for the second player to join...*\nType *${prefix}ttt* to join the game and challenge your opponent! 🏆`,
        mentions: [sender],
        react: { text: '⏳', key: m.key }
      });
    }

    if (game.players.includes(sender)) {
      return sock.sendMessage(from, { text: '*You are already in the game. 😎*' }, { quoted: m });
    }

    if (game.players.length === 1 && !game.started) {
      game.players.push(sender);
      game.started = true;

      const p1 = await sock.onWhatsApp(game.players[0]);
      const p2 = await sock.onWhatsApp(game.players[1]);

      return sock.sendMessage(from, {
        text: `🚀 *Game Started!*\n\n✨ ${renderBoard(game.board)}\n\n*${p1[0].notify}* (🅧) vs *${p2[0].notify}* (🅾)\n\n💥 *It's ${p1[0].notify}'s (🅧) turn!* 🔥`,
        mentions: game.players,
        react: { text: '🎮', key: m.key }
      });
    }

    return sock.sendMessage(from, { text: '*A game is already in progress. 🔄*' }, { quoted: m });
  }

  if (/^[1-9]$/.test(cmd)) {
    if (!game || !game.started) return;

    const move = parseInt(cmd) - 1;
    const symbol = game.turn % 2 === 0 ? 'X' : 'O';
    const currentPlayer = game.players[game.turn % 2];

    if (sender !== currentPlayer) {
      return sock.sendMessage(from, { text: `🚫 *Not your turn!*` }, { quoted: m });
    }

    if (game.board[move] !== ' ') {
      return sock.sendMessage(from, { text: `❌ *Spot already taken!*` }, { quoted: m });
    }

    game.board[move] = symbol;
    const winner = checkWinner(game.board);

    if (winner === 'X' || winner === 'O') {
      const winnerName = await sock.onWhatsApp(currentPlayer);
      delete tttGames[from];
      return sock.sendMessage(from, {
        text: `🏆 *Game Over!*\n✨ ${renderBoard(game.board)}\n\n🎉 *Winner: ${winnerName[0].notify} (${winner})* 🎉\n\n🌟 *You dominated the game! 💪*`,
        mentions: game.players,
        react: { text: '🎆', key: m.key }
      });
    } else if (winner === 'draw') {
      delete tttGames[from];
      return sock.sendMessage(from, {
        text: `🤝 *It's a Draw!* ✨\n${renderBoard(game.board)}\n\n🌈 *Great effort from both players! 💥*`,
        mentions: game.players,
        react: { text: '🤝', key: m.key }
      });
    }

    game.turn++;
    const nextPlayer = game.players[game.turn % 2];
    const name = await sock.onWhatsApp(nextPlayer);

    return sock.sendMessage(from, {
      text: `${renderBoard(game.board)}\n\n⏳ *Next Turn: ${name[0].notify} (${game.turn % 2 === 0 ? '🅧' : '🅾'})*`,
      mentions: [nextPlayer],
      react: { text: '⏳', key: m.key }
    });
  }
};

export default ttt;
