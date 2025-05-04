import config from '../../config.cjs'; // Adjust path if needed

const tttGames = {};

function renderBoard(board) {
  return `
    ${board[0]} | ${board[1]} | ${board[2]}
   -----------
    ${board[3]} | ${board[4]} | ${board[5]}
   -----------
    ${board[6]} | ${board[7]} | ${board[8]}
  `.replace(/X/g, '*X*').replace(/O/g, '*O*');
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
  const arg = body.slice(prefix.length + cmd.length).trim();
  const from = m.from;
  const sender = m.sender;
  const isGroup = from.endsWith('@g.us');
  const game = tttGames[from];

  if (!isGroup) {
    return sock.sendMessage(from, { text: '*Only available in group chats.*' }, { quoted: m });
  }

  if (cmd === 'ttt') {
    if (game) {
      return sock.sendMessage(from, { text: '*A game is already in progress in this group.*' }, { quoted: m });
    }

    const opponent = m.mentionedJid?.[0];
    if (!opponent) {
      return sock.sendMessage(from, { text: `*Tag a user to start: ${prefix}ttt @user*` }, { quoted: m });
    }

    tttGames[from] = {
      board: Array(9).fill(' '),
      players: [sender, opponent],
      turn: 0
    };

    return sock.sendMessage(from, {
      text: `*Tic Tac Toe Challenge!*\n${renderBoard(tttGames[from].board)}\n\n*${m.pushName}* (X) vs *${(await sock.onWhatsApp(opponent))[0].notify || 'Opponent'}* (O)\n\n*${m.pushName}, it's your turn. Send a number (1-9).*`,
      mentions: [sender, opponent]
    });
  }

  // Move input (e.g. "1" to "9")
  if (/^[1-9]$/.test(cmd)) {
    if (!game) return;

    const move = parseInt(cmd) - 1;
    const symbol = game.turn % 2 === 0 ? 'X' : 'O';
    const currentPlayer = game.players[game.turn % 2];

    if (sender !== currentPlayer) {
      return sock.sendMessage(from, { text: '*Not your turn.*' }, { quoted: m });
    }

    if (game.board[move] !== ' ') {
      return sock.sendMessage(from, { text: '*Spot taken.*' }, { quoted: m });
    }

    game.board[move] = symbol;
    const winner = checkWinner(game.board);

    if (winner === 'X' || winner === 'O') {
      const winName = await sock.onWhatsApp(currentPlayer);
      delete tttGames[from];
      return sock.sendMessage(from, {
        text: `*Game Over!*\n${renderBoard(game.board)}\n\n*Winner: ${(winName[0].notify || 'Player')} (${winner})*`,
        mentions: game.players
      });
    } else if (winner === 'draw') {
      delete tttGames[from];
      return sock.sendMessage(from, {
        text: `*Draw Game!*\n${renderBoard(game.board)}`,
        mentions: game.players
      });
    }

    game.turn++;
    const nextPlayer = game.players[game.turn % 2];
    const name = await sock.onWhatsApp(nextPlayer);
    return sock.sendMessage(from, {
      text: `${renderBoard(game.board)}\n\n*${name[0].notify || 'Player'}, your turn (${game.turn % 2 === 0 ? 'X' : 'O'})*`,
      mentions: [nextPlayer]
    });
  }
};

export default ttt;
