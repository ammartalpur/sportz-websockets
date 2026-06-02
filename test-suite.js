#!/usr/bin/env node

/**
 * Comprehensive WebSocket Testing Suite for Sportz
 * Runs the API server and test client, then provides interactive testing commands
 */

import { spawn } from 'child_process';
import readline from 'readline';
import axios from 'axios';

const API_URL = 'http://localhost:8000';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let processes = [];

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(title) {
  console.log('\n' + colors.bright + colors.cyan + '╔' + '═'.repeat(60) + '╗' + colors.reset);
  console.log(colors.bright + colors.cyan + '║ ' + title.padEnd(59) + '║' + colors.reset);
  console.log(colors.bright + colors.cyan + '╚' + '═'.repeat(60) + '╝' + colors.reset + '\n');
}

function startServer() {
  return new Promise((resolve) => {
    log('Starting Sportz API Server...', 'yellow');
    const server = spawn('node', ['src/index.js'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    server.stdout.on('data', (data) => {
      if (data.toString().includes('listening') || data.toString().includes('running')) {
        log('✅ API Server is running', 'green');
        resolve();
      }
    });

    server.stderr.on('data', (data) => {
      if (!data.toString().includes('ExperimentalWarning')) {
        process.stderr.write(data);
      }
    });

    processes.push(server);

    setTimeout(() => {
      log('✅ API Server started', 'green');
      resolve();
    }, 2000);
  });
}

function startTestClient() {
  return new Promise((resolve) => {
    log('Starting WebSocket Test Client...', 'yellow');
    const testClient = spawn('node', ['ws-test.js'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    testClient.stdout.on('data', (data) => {
      process.stdout.write(data);
      if (data.toString().includes('localhost:9000')) {
        setTimeout(() => resolve(), 500);
      }
    });

    processes.push(testClient);
  });
}

async function createMatch(matchData = null) {
  const data = matchData || {
    sport: 'football',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    startTime: new Date(Date.now() + 3600000).toISOString(),
    endTime: new Date(Date.now() + 7200000).toISOString(),
    homeScore: 2,
    awayScore: 1
  };

  try {
    const response = await axios.post(`${API_URL}/matches`, data);
    const match = response.data.data;
    log(`✅ Match created with ID: ${match.id}`, 'green');
    return match.id;
  } catch (error) {
    log(`❌ Failed to create match: ${error.message}`, 'yellow');
    return null;
  }
}

async function addCommentary(matchId, commentaryData = null) {
  const data = commentaryData || {
    minute: Math.floor(Math.random() * 90),
    sequence: 1,
    period: 'first_half',
    eventType: 'goal',
    actor: 'Player Name',
    team: 'Manchester United',
    message: 'GOAL! Beautiful play from the midfield!',
    tags: ['goal', 'spectacular']
  };

  try {
    const response = await axios.post(`${API_URL}/matches/${matchId}/commentary`, data);
    log(`✅ Commentary added to match ${matchId}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Failed to add commentary: ${error.message}`, 'yellow');
    return false;
  }
}

async function listMatches() {
  try {
    const response = await axios.get(`${API_URL}/matches`);
    log(`Found ${response.data.data.length} matches:`, 'blue');
    response.data.data.forEach((match, idx) => {
      log(`  ${idx + 1}. Match #${match.id} - ${match.homeTeam} vs ${match.awayTeam} (${match.status})`, 'cyan');
    });
    return response.data.data;
  } catch (error) {
    log(`❌ Failed to list matches: ${error.message}`, 'yellow');
    return [];
  }
}

function showMenu() {
  console.log(colors.bright + colors.yellow + '\n📋 Testing Options:' + colors.reset);
  console.log('  1. Create a new match');
  console.log('  2. List all matches');
  console.log('  3. Add commentary to a match');
  console.log('  4. Create match + Add commentary (demo)');
  console.log('  5. Open test client in browser');
  console.log('  6. Show curl commands');
  console.log('  0. Exit\n');
}

function showCurlCommands() {
  header('Useful cURL Commands');
  
  log('Create a Match:', 'cyan');
  console.log(`
curl -X POST ${API_URL}/matches \\
  -H "Content-Type: application/json" \\
  -d '{
    "sport": "cricket",
    "homeTeam": "India",
    "awayTeam": "Australia",
    "startTime": "2026-06-02T14:00:00Z",
    "endTime": "2026-06-02T22:00:00Z"
  }'
  `);

  log('Add Commentary:', 'cyan');
  console.log(`
curl -X POST ${API_URL}/matches/1/commentary \\
  -H "Content-Type: application/json" \\
  -d '{
    "minute": 45,
    "sequence": 1,
    "period": "first_half",
    "eventType": "goal",
    "actor": "Bruno Fernandes",
    "team": "Manchester United",
    "message": "GOAL! Stunning strike!",
    "tags": ["goal"]
  }'
  `);

  log('List Matches:', 'cyan');
  console.log(`
curl -X GET "${API_URL}/matches?limit=10"
  `);

  log('List Match Commentary:', 'cyan');
  console.log(`
curl -X GET "${API_URL}/matches/1/commentary?limit=50"
  `);
}

async function interactiveMode() {
  header('🏆 Sportz WebSocket Testing Suite');
  
  await startServer();
  await startTestClient();

  log('🌐 Test Client URL: http://localhost:9000', 'green');
  log('📡 API Server URL: http://localhost:8000', 'green');
  log('📝 Documentation: See WS_TESTING.md', 'blue');
  
  showMenu();

  const question = (prompt) => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  };

  let running = true;
  while (running) {
    const choice = await question(colors.bright + colors.yellow + '> ' + colors.reset);
    
    switch (choice.trim()) {
      case '1':
        log('Creating a match...', 'yellow');
        const matchId = await createMatch();
        if (matchId) {
          log(`Match created! Use Match ID: ${matchId}`, 'green');
        }
        break;

      case '2':
        await listMatches();
        break;

      case '3':
        const mid = await question('Enter Match ID: ');
        if (mid) {
          log('Adding commentary...', 'yellow');
          await addCommentary(parseInt(mid));
        }
        break;

      case '4':
        log('Creating match and adding commentary...', 'yellow');
        const id = await createMatch();
        if (id) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          await addCommentary(id, {
            minute: 15,
            sequence: 1,
            period: 'first_half',
            eventType: 'goal',
            actor: 'Cristiano Ronaldo',
            team: 'Manchester United',
            message: 'GOOOOAL! He scores again!',
            tags: ['goal', 'world-class']
          });
          await new Promise(resolve => setTimeout(resolve, 1000));
          await addCommentary(id, {
            minute: 42,
            sequence: 2,
            period: 'first_half',
            eventType: 'yellow_card',
            actor: 'Opposing Player',
            team: 'Liverpool',
            message: 'Yellow card for rough tackle',
            tags: ['yellow-card', 'foul']
          });
          log('Demo completed! Check test client for real-time events', 'green');
        }
        break;

      case '5':
        log('Opening test client in browser...', 'cyan');
        const { exec } = await import('child_process');
        exec('start http://localhost:9000 || open http://localhost:9000 || xdg-open http://localhost:9000');
        break;

      case '6':
        showCurlCommands();
        break;

      case '0':
        running = false;
        break;

      default:
        log('Invalid option. Please try again.', 'yellow');
    }

    if (running) {
      showMenu();
    }
  }

  cleanup();
}

function cleanup() {
  log('\nShutting down...', 'yellow');
  processes.forEach(proc => {
    try {
      proc.kill();
    } catch (e) {}
  });
  rl.close();
  log('Goodbye! 👋', 'green');
  process.exit(0);
}

process.on('SIGINT', cleanup);

// Start
interactiveMode().catch(error => {
  log(`Error: ${error.message}`, 'yellow');
  cleanup();
});
