# Meme Royal 3D — Local Dev Setup

A lightweight static Three.js workflow that mirrors the Vercel deploy. Works with VS Code + Live Server (or a tiny Node server). No bundler required.

## Folder layout (this repo)
```
root/
  index.html          # landing / frame entry
  play.html           # game entry (Three.js canvas)
  game/
    main.js           # game loop + scene setup
    config.js         # gameplay + model config
    Tower3D.js
    Unit3D.js
    CardManager.js
    MultiplayerManager.js
    ...               # other systems + assets/
  public/             # static art (neon header, etc.)
  assets/             # extra art/models if added at root
```

## Import map (keep in <head>)
```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/"
  }
}
</script>
```

Load your code with:
```html
<script type="module" src="game/main.js"></script>
```
(Use `game/main.js` for play.html; the landing page uses `index.html`.)

## Run locally (fastest)
1) Open `play.html` (or `index.html`) in VS Code.
2) Right-click → **Open with Live Server**.
3) Hit the served URL (e.g., `http://127.0.0.1:5500/play.html`).

## Run via Node (no extension)
```bash
npm init -y
npm install --save-dev http-server
```
Add to `package.json`:
```json
"scripts": {
  "dev": "http-server . -p 5173"
}
```
Then run:
```bash
npm run dev
```
Open `http://localhost:5173/play.html` (or `/index.html`).

## VS Code extensions to install
- Live Server
- GLTF Tools (preview .glb/.gltf)
- Three.js Snippets
- Material Icon Theme (optional)
- Shader languages support

## Asset organization (recommend)
```
assets/
  models/
    bridge.glb
    arena.glb
    units/
      doge.glb
      pepe.glb
      shiba_tank.glb
  textures/
    ground_diffuse.png
    river_normal.png
    tower_diffuse.png
  ui/
    cards/
      doge-card.png
      pepe-card.png
    backgrounds/
      menu-bg.png
      battle-bg.png
```
Update paths in `config.js`/loaders to match wherever you place models and textures.

## Git + Vercel flow
- `git init && git add . && git commit -m "Initial local game workspace"`
- Create GitHub repo, `git remote add origin <url>`, `git push -u origin main`.
- In Vercel, link the repo; `index.html` serves at `/`, `play.html` at `/play.html`.

## Daily loop
- Edit `game/main.js`, `Tower3D.js`, `Unit3D.js`, `CardManager.js`, `MultiplayerManager.js` in VS Code.
- Preview models with GLTF Tools before wiring them in.
- Run Live Server while coding; watch DevTools console for errors.
- Commit small, push to GitHub, let Vercel deploy.
