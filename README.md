# Camdown Productions React Portfolio

A refined React film-portfolio website inspired by the shared reference page. It is set up for GitHub Pages and can later connect to a separate media API or static media JSON source.

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL Vite prints in the terminal.

## Build locally

```powershell
npm run build
```

## Deploy on GitHub Pages

1. Create a GitHub repository and push this folder to it.
2. In GitHub, open **Settings > Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` or run the **Deploy GitHub Pages** workflow manually.

GitHub Actions will build the React site and publish the generated `dist` folder.

## Connect Instagram live media

Instagram does not allow a public browser page to scrape or fetch arbitrary profile posts directly. To render live posts, use Meta's official Instagram Graph API and set these environment variables before starting the server:

```powershell
$env:IG_GRAPH_ACCESS_TOKEN="your-long-lived-token"
$env:IG_GRAPH_ACCOUNT_IDS="instagram-business-account-id-1,instagram-business-account-id-2"
npm start
```

The site currently maps those IDs to:

- `https://www.instagram.com/camdownproductions/`
- `https://www.instagram.com/framingpicturesby_k.s/`

Without those credentials, the page shows connected profile cards and explains that the live feed is waiting for API setup.

GitHub Pages cannot run the Node API route or securely store Instagram access tokens. For live Instagram media, deploy `server.js` to a Node host such as Render, Railway, or Vercel server functions, then point the React app's feed request to that API.
