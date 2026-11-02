# EvoHacks: copy, commit, push

## One-time setup
1. Extract this ZIP.
2. Open the extracted evohacks-ii folder. Copy EVERYTHING INSIDE it into your existing EvoHacks Git repository folder (the folder containing your current package.json). Replace matching files. Include .github and .gitignore. Do not copy it as a nested evohacks-ii folder. Keep your existing .git folder.
3. In GitHub, open your repository → Settings → Pages. Set Source to GitHub Actions. Keep Custom domain set to evohacks.xyz.
4. The included .github/workflows/deploy.yml handles deployment. If you have another Pages deployment workflow with a different filename, disable that old deployment workflow in GitHub Actions so it does not compete with this one. Preserve unrelated workflows.
5. Use your repository's default branch (usually main). Then run:

```bash
git add .
git commit -m "Launch EvoHacks II redesign"
git push
```

That's it. GitHub installs the dependencies, builds the website and publishes dist/. You do NOT need to run npm install, npm ci, or npm run build on your computer.

## Future updates
Edit the files, then run:

```bash
git add .
git commit -m "Update EvoHacks website"
git push
```

The workflow deploys pushes to the default branch only. If you work on another branch, merge it into the default branch first.

## Verify publication
On GitHub, open Actions → Deploy EvoHacks to GitHub Pages. When the workflow is green, open https://evohacks.xyz and refresh. Publishing usually takes a few minutes. If it fails, open the failed step and share its error message.

## Files
- src/App.tsx: page content, schedule, sponsors, winners and interactions.
- src/index.css: complete styling.
- src/main.tsx: React entry point.
- src/Evolution.tsx: Three.js scene.
- src/Fallback.tsx: lightweight canvas fallback.
- src/Policies.tsx: existing policies.
- src/App.css: intentionally empty; styling is in index.css.
- package.json and package-lock.json: matching dependencies and build scripts.
- tsconfig.json and vite.config.ts: build configuration.
- index.html: HTML entry point.
- public/favicon.svg: icon.
- public/CNAME: evohacks.xyz domain file.
- .github/workflows/deploy.yml: automatic GitHub Pages deployment.

This package targets the existing evohacks.xyz custom domain. It does not change DNS or GitHub settings automatically. Use one Vite configuration: if your old project has vite.config.js, remove that redundant config when copying the included vite.config.ts.

Current event: November 28–29, 2026. Start: 9 AM Pacific Saturday; submissions close noon Sunday; judging noon–2:30 PM; winners at 3 PM Sunday. The new judges, theme and registration link are still awaiting announcement. Previous event winners, sponsors and judges are clearly archived.

Build was verified before export. GPU scene visuals still need verification in a WebGL-enabled browser; the preview environment used the working canvas fallback. The GitHub Actions workflow follows Vite's official Pages deployment guide, but cannot be executed in your repository until you push it.
