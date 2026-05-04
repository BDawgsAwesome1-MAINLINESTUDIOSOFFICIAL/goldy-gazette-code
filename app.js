const tabButtons = document.querySelectorAll(".tab-button");
const modeButtons = document.querySelectorAll(".mode-button");

const languageConfigs = {
  python: {
    freeEditor: document.getElementById("python-free"),
    lockedEditor: document.getElementById("python-locked"),
    notes: document.getElementById("python-notes"),
    output: document.getElementById("python-output"),
    runButton: document.getElementById("run-python"),
    template: `import random
import textwrap

# Adventure Coin Quest
# In Free mode, edit code between the "EDIT ZONE" comments.
# In Locked mode, click yellow highlighted zones and edit inline.

__SETTINGS_BLOCK__

MAP_WIDTH = 24
MAP_HEIGHT = 10
MAX_TURNS = 20

def create_player():
    return {
        "name": PLAYER_NAME,
        "health": PLAYER_HEALTH,
        "coins": 0,
        "steps": 0
    }

def build_map():
    return [["." for _ in range(MAP_WIDTH)] for _ in range(MAP_HEIGHT)]

def draw_map(game_map, player_x, player_y):
    rows = []
    for y in range(MAP_HEIGHT):
        line = []
        for x in range(MAP_WIDTH):
            if x == player_x and y == player_y:
                line.append("P")
            else:
                line.append(game_map[y][x])
        rows.append("".join(line))
    return "\\n".join(rows)

def narrate(title, message):
    print(f"\\n== {title} ==")
    for line in textwrap.wrap(message, width=68):
        print(line)

def random_event(player):
    roll = random.randint(1, 100)
    if roll <= 28:
        gain = random.randint(1, 5)
        player["coins"] += gain
        return f"You found {gain} hidden coins."
    if roll <= 56:
        damage = random.randint(2, 6)
        player["health"] -= damage
        return f"A branch trap hit you for {damage} health."
    if roll <= 82:
        heal = random.randint(1, 4)
        player["health"] += heal
        return f"A forest berry healed {heal} health."

__BONUS_EVENT_BLOCK__

    return "The wind howled, but nothing changed."

def run_game():
    random.seed(SEED_VALUE)
    player = create_player()
    game_map = build_map()
    x, y = MAP_WIDTH // 2, MAP_HEIGHT // 2

    narrate(
        "Welcome",
        f"{player['name']} enters the glowing forest to collect treasure."
    )

    for turn in range(1, MAX_TURNS + 1):
        if player["health"] <= 0:
            break
        move_x = random.choice([-1, 0, 1])
        move_y = random.choice([-1, 0, 1])
        x = max(0, min(MAP_WIDTH - 1, x + move_x))
        y = max(0, min(MAP_HEIGHT - 1, y + move_y))
        player["steps"] += abs(move_x) + abs(move_y)

        print(f"\\nTurn {turn}")
        print(draw_map(game_map, x, y))
        print(random_event(player))
        print(
            f"Stats -> health: {player['health']} | coins: {player['coins']} | "
            f"steps: {player['steps']}"
        )

    narrate(
        "Game Over",
        f"{player['name']} finished with {player['coins']} coins and "
        f"{player['health']} health."
    )

__ENDING_BLOCK__

run_game()
`,
    fields: [
      {
        token: "__SETTINGS_BLOCK__",
        label: "Player Setup",
        note: "Name, starting health, and random seed.",
        value: `# === EDIT ZONE 1: player setup ===
PLAYER_NAME = "Player One"
PLAYER_HEALTH = 22
SEED_VALUE = 9`,
      },
      {
        token: "__BONUS_EVENT_BLOCK__",
        label: "Bonus Event Rule",
        note: "Special bonus event behavior.",
        value: `    # === EDIT ZONE 2: bonus event ===
    if roll <= 95:
        bonus = random.randint(4, 9)
        player["coins"] += bonus
        return f"A glowing crate dropped {bonus} bonus coins."`,
      },
      {
        token: "__ENDING_BLOCK__",
        label: "Ending Message",
        note: "Final text printed after the game ends.",
        value: `# === EDIT ZONE 3: ending message ===
if __name__ == "__main__":
    print("Thanks for playing Adventure Coin Quest!")`,
      },
    ],
  },
  javascript: {
    freeEditor: document.getElementById("javascript-free"),
    lockedEditor: document.getElementById("javascript-locked"),
    notes: document.getElementById("javascript-notes"),
    output: document.getElementById("javascript-output"),
    runButton: document.getElementById("run-javascript"),
    outputFrame: document.getElementById("javascript-frame"),
    template: `/**
 * Meteor Dash Arena
 * In Free mode, edit between EDIT ZONE comments.
 * In Locked mode, click yellow highlighted zones and edit inline.
 */

const root = document.getElementById("game-root");
root.innerHTML = "";

__UI_TEXT__

const state = {
  energy: START_ENERGY,
  score: 0,
  level: 1,
  running: false,
  ticks: 0
};

const card = document.createElement("section");
card.className = "dash-card";
card.innerHTML = [
  "<h2>" + GAME_TITLE + "</h2>",
  "<p>" + GAME_DESC + "</p>",
  "<p><strong id='stat-energy'>Energy: 0</strong> | <strong id='stat-score'>Score: 0</strong> | <strong id='stat-level'>Level: 1</strong></p>",
  "<div class='dash-buttons'>",
  "  <button id='btn-start'>Start</button>",
  "  <button id='btn-dash'>Dash</button>",
  "  <button id='btn-rest'>Rest</button>",
  "</div>",
  "<p id='dash-message'>Press Start to begin.</p>"
].join("");
root.appendChild(card);

const energyEl = document.getElementById("stat-energy");
const scoreEl = document.getElementById("stat-score");
const levelEl = document.getElementById("stat-level");
const messageEl = document.getElementById("dash-message");
const startBtn = document.getElementById("btn-start");
const dashBtn = document.getElementById("btn-dash");
const restBtn = document.getElementById("btn-rest");

function refreshStats() {
  energyEl.textContent = "Energy: " + state.energy;
  scoreEl.textContent = "Score: " + state.score;
  levelEl.textContent = "Level: " + state.level;
}

function randomPenalty() {
  return Math.floor(Math.random() * 3);
}

function onDash() {
  if (!state.running) {
    messageEl.textContent = "Start the game first.";
    return;
  }
  state.ticks += 1;
  const cost = DASH_COST + randomPenalty();
  state.energy -= cost;
  if (state.energy <= 0) {
    state.energy = 0;
    state.running = false;
    messageEl.textContent = "Out of energy. Game over.";
    refreshStats();
    return;
  }
  state.score += POINTS_PER_DASH;
  if (state.score % LEVEL_STEP === 0) {
    state.level += 1;
  }
__POWERUP_RULE__
  messageEl.textContent = "Nice dash! Keep moving.";
  refreshStats();
}

function onRest() {
  if (!state.running) {
    messageEl.textContent = "Start the game first.";
    return;
  }
  state.energy += 3;
  state.score = Math.max(0, state.score - 1);
  messageEl.textContent = "You rested and regained energy.";
  refreshStats();
}

function onStart() {
  state.energy = START_ENERGY;
  state.score = 0;
  state.level = 1;
  state.ticks = 0;
  state.running = true;
__START_MESSAGE__
  refreshStats();
}

startBtn.addEventListener("click", onStart);
dashBtn.addEventListener("click", onDash);
restBtn.addEventListener("click", onRest);
refreshStats();
`,
    fields: [
      {
        token: "__UI_TEXT__",
        label: "UI Text + Base Values",
        note: "Game title, intro, and base numbers.",
        value: `// === EDIT ZONE 1: title and values ===
const GAME_TITLE = "Meteor Dash Arena";
const GAME_DESC = "Tap Dash to score points while managing your energy.";
const START_ENERGY = 18;
const DASH_COST = 2;
const POINTS_PER_DASH = 3;
const LEVEL_STEP = 12;`,
      },
      {
        token: "__POWERUP_RULE__",
        label: "Power-Up Rule",
        note: "Bonus behavior that runs after each dash.",
        value: `  // === EDIT ZONE 2: power-up rule ===
  if (state.ticks % 4 === 0) {
    state.energy += 1;
    state.score += 2;
  }`,
      },
      {
        token: "__START_MESSAGE__",
        label: "Start Message",
        note: "Message shown when a new round starts.",
        value: `  // === EDIT ZONE 3: start message ===
  messageEl.textContent = "Round started. Dash fast, rest smart.";`,
      },
    ],
  },
  html: {
    freeEditor: document.getElementById("html-free"),
    lockedEditor: document.getElementById("html-locked"),
    notes: document.getElementById("html-notes"),
    output: document.getElementById("html-output"),
    runButton: document.getElementById("run-html"),
    template: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Click Carnival</title>
    <style>
      :root {
__THEME_VARS__
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: Arial, sans-serif;
        background: radial-gradient(circle at top, #ffffff, var(--bg-color));
        color: #1b2430;
      }

      .card {
        width: min(560px, 92vw);
        background: #fff;
        border: 2px solid var(--card-border);
        border-radius: 16px;
        padding: 1rem;
        box-shadow: 0 12px 28px rgba(26, 39, 63, 0.13);
      }

      h1 {
        margin-top: 0;
      }

      .arena {
        min-height: 140px;
        display: grid;
        place-items: center;
        border: 2px dashed var(--card-border);
        border-radius: 12px;
        margin: 0.75rem 0;
        background: #f8fbff;
      }

      .target {
        width: 92px;
        height: 92px;
        border: 0;
        border-radius: 999px;
        background: var(--target-color);
        color: #fff;
        font-weight: 700;
        cursor: pointer;
        transition: transform 120ms ease;
      }

      .target:hover {
        transform: scale(1.08);
      }

      .stats {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
    </style>
  </head>
  <body>
    <section class="card">
      <h1>Click Carnival</h1>
      <p>Tap the target before time runs out. Reach the score goal to win.</p>
      <div class="stats">
        <strong id="score">Score: 0</strong>
        <strong id="timer">Time: 30</strong>
        <strong id="goal">Goal: 18</strong>
      </div>
      <div class="arena" id="arena">
        <button id="target" class="target">+1</button>
      </div>
      <p id="message">Game ready. Click start to begin!</p>
      <button id="start">Start Game</button>
    </section>

    <script>
      // In Free mode, edit sections marked as EDIT ZONE.
      // In Locked mode, click yellow highlighted zones and edit inline.

      let score = 0;
      let timeLeft = 30;
      let goal = 18;
      let running = false;
      let loopId = null;

      const scoreEl = document.getElementById("score");
      const timerEl = document.getElementById("timer");
      const goalEl = document.getElementById("goal");
      const messageEl = document.getElementById("message");
      const targetEl = document.getElementById("target");
      const startEl = document.getElementById("start");

      function updateStats() {
        scoreEl.textContent = "Score: " + score;
        timerEl.textContent = "Time: " + timeLeft;
        goalEl.textContent = "Goal: " + goal;
      }

      function randomPos(max) {
        return Math.floor(Math.random() * max);
      }

      function moveTarget() {
        targetEl.style.marginLeft = randomPos(180) + "px";
        targetEl.style.marginTop = randomPos(80) + "px";
      }

      function clickTarget() {
        if (!running) {
          return;
        }
        score += 1;
        moveTarget();
__BONUS_RULE__
        updateStats();
      }

      function endGame() {
        running = false;
        clearInterval(loopId);
        if (score >= goal) {
          messageEl.textContent = "You won! Great carnival reflexes.";
        } else {
          messageEl.textContent = "Time up. Try again and beat the goal!";
        }
      }

      function startGame() {
        score = 0;
        timeLeft = 30;
        running = true;
        messageEl.textContent = "Go! Tap as fast as you can.";
        updateStats();
        moveTarget();

        clearInterval(loopId);
        loopId = setInterval(() => {
          timeLeft -= 1;
          updateStats();
          if (timeLeft <= 0) {
            endGame();
          }
        }, 1000);
      }

      targetEl.addEventListener("click", clickTarget);
      startEl.addEventListener("click", startGame);

__MESSAGE_RULE__

      updateStats();
    </script>
  </body>
</html>
`,
    fields: [
      {
        token: "__THEME_VARS__",
        label: "Theme Colors",
        note: "Page background, target color, and border style.",
        value: `        /* === EDIT ZONE 1: theme === */
        --bg-color: #dce9ff;
        --target-color: #2f6fed;
        --card-border: #86a9ef;`,
      },
      {
        token: "__BONUS_RULE__",
        label: "Bonus Scoring Rule",
        note: "Extra points behavior on click streaks.",
        value: `        // === EDIT ZONE 2: bonus scoring ===
        if (score % 6 === 0) {
          score += 2;
          messageEl.textContent = "Combo bonus +2!";
        }`,
      },
      {
        token: "__MESSAGE_RULE__",
        label: "Startup Message",
        note: "Tip shown when the game first loads.",
        value: `      // === EDIT ZONE 3: startup message ===
      messageEl.textContent = "Tip: hit every 6th click for a bonus!";`,
      },
    ],
  },
};

const state = {
  python: { mode: "locked", freeEdited: false },
  javascript: { mode: "locked", freeEdited: false },
  html: { mode: "locked", freeEdited: false },
};

const panels = {
  python: document.getElementById("python-panel"),
  javascript: document.getElementById("javascript-panel"),
  html: document.getElementById("html-panel"),
};

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function compileCode(lang) {
  const config = languageConfigs[lang];
  let built = config.template;
  config.fields.forEach((field) => {
    built = built.replace(field.token, field.value);
  });
  return built;
}

function renderNotes(lang) {
  const config = languageConfigs[lang];
  const mode = state[lang].mode;
  const intro =
    mode === "locked"
      ? "Locked mode: edit only yellow highlighted code parts in the full script below."
      : "Free mode: edit the whole script. Keep EDIT ZONE comments as guideposts.";
  const bullets = config.fields
    .map((field, idx) => `<li><strong>Zone ${idx + 1}:</strong> ${field.note}</li>`)
    .join("");
  config.notes.innerHTML = `<h3>Where to edit</h3><p>${intro}</p><ul>${bullets}</ul>`;
}

function renderLockedCode(lang) {
  const config = languageConfigs[lang];
  let cursor = 0;
  const parts = [];

  config.fields.forEach((field, idx) => {
    const tokenIndex = config.template.indexOf(field.token, cursor);
    if (tokenIndex < 0) {
      return;
    }
    parts.push(escapeHtml(config.template.slice(cursor, tokenIndex)));
    parts.push(
      `<span class="editable-chip" contenteditable="true" data-field-index="${idx}">${escapeHtml(
        field.value
      )}</span>`
    );
    cursor = tokenIndex + field.token.length;
  });

  parts.push(escapeHtml(config.template.slice(cursor)));
  config.lockedEditor.innerHTML = `<div class="locked-code-view">${parts.join("")}</div>`;

  config.lockedEditor.querySelectorAll(".editable-chip").forEach((chip) => {
    chip.addEventListener("input", () => {
      const idx = Number(chip.dataset.fieldIndex);
      const normalized = chip.innerText.replace(/\u00a0/g, " ");
      config.fields[idx].value = normalized;
      if (!state[lang].freeEdited) {
        config.freeEditor.value = compileCode(lang);
      }
    });
  });
}

function applyMode(lang, mode) {
  const config = languageConfigs[lang];
  state[lang].mode = mode;

  if (mode === "locked") {
    config.lockedEditor.classList.add("active");
    config.freeEditor.classList.remove("active");
  } else {
    if (!state[lang].freeEdited) {
      config.freeEditor.value = compileCode(lang);
    }
    config.lockedEditor.classList.remove("active");
    config.freeEditor.classList.add("active");
  }
  renderNotes(lang);
}

Object.keys(languageConfigs).forEach((lang) => {
  const config = languageConfigs[lang];
  renderLockedCode(lang);
  config.freeEditor.value = compileCode(lang);
  config.freeEditor.addEventListener("input", () => {
    state[lang].freeEdited = true;
  });
  renderNotes(lang);
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.tab;
    tabButtons.forEach((b) => b.classList.toggle("active", b === button));
    Object.entries(panels).forEach(([name, panel]) => {
      panel.classList.toggle("active", name === selected);
    });
  });
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const lang = button.dataset.lang;
    const mode = button.dataset.mode;
    document
      .querySelectorAll(`.mode-button[data-lang="${lang}"]`)
      .forEach((b) => b.classList.toggle("active", b === button));
    applyMode(lang, mode);
  });
});

let pyodide;
let pythonReady = false;
const pythonStatus = document.getElementById("python-status");
const pythonStdinInput = document.getElementById("python-stdin");

async function initPython() {
  try {
    pyodide = await loadPyodide();
    pythonReady = true;
    pythonStatus.textContent = "Python is ready.";
  } catch (error) {
    pythonStatus.textContent = "Python engine failed to load. Refresh and retry.";
    languageConfigs.python.output.textContent = `Setup error: ${error.message}`;
  }
}

function currentCode(lang) {
  if (state[lang].mode === "locked") {
    return compileCode(lang);
  }
  return languageConfigs[lang].freeEditor.value;
}

languageConfigs.python.runButton.addEventListener("click", async () => {
  const outputEl = languageConfigs.python.output;
  const code = currentCode("python");
  const rawInput = pythonStdinInput.value.trim();
  const queue = rawInput ? rawInput.split("|").map((item) => item.trim()) : [];

  if (!pythonReady) {
    outputEl.textContent = "Python is still loading. Please wait.";
    return;
  }

  const nextInput = (promptText = "") => {
    if (queue.length > 0) {
      return queue.shift();
    }
    const typed = window.prompt(String(promptText || "Enter input value"), "");
    return typed === null ? "" : typed;
  };

  pythonStatus.textContent = "Running Python...";
  const logs = [];

  try {
    pyodide.globals.set("__next_input", nextInput);
    pyodide.setStdout({
      batched(text) {
        if (text.trim()) {
          logs.push(text);
        }
      },
    });
    pyodide.setStderr({
      batched(text) {
        if (text.trim()) {
          logs.push(`Error: ${text}`);
        }
      },
    });

    await pyodide.runPythonAsync(`
import builtins
from js import __next_input
def _runtime_input(prompt=""):
    return __next_input(prompt)
builtins.input = _runtime_input
`);
    const result = await pyodide.runPythonAsync(code);
    if (result !== undefined && String(result).trim()) {
      logs.push(`Result: ${String(result)}`);
    }
    outputEl.textContent = logs.join("\n") || "Finished with no output.";
  } catch (error) {
    outputEl.textContent = `Runtime error: ${error.message}`;
  } finally {
    pythonStatus.textContent = "Python is ready.";
  }
});

languageConfigs.javascript.runButton.addEventListener("click", () => {
  const outputEl = languageConfigs.javascript.output;
  const outputFrame = languageConfigs.javascript.outputFrame;
  const code = currentCode("javascript");
  const safeCode = code.replaceAll("</script>", "<\\/script>");

  const srcDoc = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #f7f9ff;
        color: #1b2430;
      }
      #game-root {
        padding: 14px;
      }
      .dash-card {
        max-width: 620px;
        border: 2px solid #9db8f4;
        background: #fff;
        border-radius: 14px;
        padding: 12px;
        box-shadow: 0 8px 24px rgba(29, 47, 77, 0.14);
      }
      .dash-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      button {
        border: 0;
        border-radius: 9px;
        padding: 8px 12px;
        color: #fff;
        background: #2f6fed;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div id="game-root"></div>
    <script>
      try {
${safeCode}
      } catch (error) {
        const root = document.getElementById("game-root");
        root.innerHTML = "<pre style='color:#b20f0f;white-space:pre-wrap;'>Runtime error: " + error.message + "</pre>";
      }
    <\\/script>
  </body>
</html>`;

  outputFrame.srcdoc = srcDoc;
  outputEl.textContent = "JavaScript UI rendered below.";
});

languageConfigs.html.runButton.addEventListener("click", () => {
  const code = currentCode("html");
  languageConfigs.html.output.srcdoc = code;
});

initPython();
