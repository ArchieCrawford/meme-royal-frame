# Rosebud prompt: Meme Royal 3D refactor

You are building a Clash Royale–style loop for Meme Royal 3D. Use the architecture patterns from https://github.com/Noisyboy-9/clash_royale_game as reference and generate code that fits these requirements:

1) Game loop
- Deterministic update tick driving units, towers, projectiles, elixir regen, UI.

2) Unit state machine
- States: idle → walk → acquire_target → attack → die.
- Mixers/animations updated every frame (mixer.update(delta)).

3) Manual deployment + card cycle
- 4-card hand, deck queue cycles when a card is played.
- Spawn only when: a card is selected, click is on player side, elixir >= cost.
- Elixir regen + cost gating; no auto-spawn.

4) Lanes & pathing
- Two lanes (left/right) via bridge/river separation; units follow lane z-dir toward enemy side.
- Path nodes or simple lane-follow to keep movement deterministic.

5) Teams & combat
- Explicit team flag (player/enemy); tint meshes blue/red.
- Towers auto-attack nearest enemy in range; units target enemies first then towers; apply damage and destroy when hp <= 0.

6) Rendering
- Three.js scene with ground, river/bridge, towers, colored units; HP bars billboarded; shadows enabled.

7) Files to emit (ES modules)
- config.js: constants for arena size, lanes, towers, troops (hp/dmg/speed/range/cost/attackSpeedSec), elixir timings, enemy AI spawn cadence.
- Unit3D.js: state machine, movement, target find, attack cooldown, hp bar updates, destroy.
- Tower3D.js: simple ranged attack, hp bar, destroy.
- main.js: scene setup, camera, lights, deck/hand UI wiring, raycast spawn, elixir/timer/crowns UI, enemy AI spawns, update loop.

8) Deployment
- Keep imports aligned to Three.js import map in index.html; no bundler assumptions.

Output concise code ready to drop into /game/ (index.html already exists). Do not add extra dependencies beyond Three.js and what’s already in the project.
