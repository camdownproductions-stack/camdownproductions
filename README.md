# Camdown Productions React Portfolio

A React portfolio website for Camdown Productions, built for GitHub Pages.

The portfolio has two main sections:

- Videos
  - Pre-Wedding
  - Wedding
  - Maternity
- Photos
  - Pre-Wedding
  - Wedding
  - Maternity

Each category opens as a smooth dropdown and displays its media in a horizontal carousel.

## Run Locally

```powershell
npm install
npm run dev
```

Open the local URL Vite prints in the terminal.

## Build Locally

```powershell
npm run build
```

## Google Drive Setup

Create six public Google Drive folders:

- Videos / Pre-Wedding
- Videos / Wedding
- Videos / Maternity
- Photos / Pre-Wedding
- Photos / Wedding
- Photos / Maternity

Set each folder to **Anyone with the link can view**.

Add each folder ID to [public/drive-folders.json](public/drive-folders.json).

Example:

```json
{
  "videos": {
    "preWedding": "GOOGLE_DRIVE_FOLDER_ID",
    "wedding": "GOOGLE_DRIVE_FOLDER_ID",
    "maternity": "GOOGLE_DRIVE_FOLDER_ID"
  },
  "photos": {
    "preWedding": "GOOGLE_DRIVE_FOLDER_ID",
    "wedding": "GOOGLE_DRIVE_FOLDER_ID",
    "maternity": "GOOGLE_DRIVE_FOLDER_ID"
  }
}
```

The folder ID is the part after `/folders/` in a Google Drive folder URL.

## Google API Key

The site uses the Google Drive API to list public files from those folders.

Create a Google API key with Google Drive API enabled, then add it as a GitHub repository variable:

```text
VITE_GOOGLE_DRIVE_API_KEY
```

In GitHub:

1. Open the repo.
2. Go to **Settings > Secrets and variables > Actions > Variables**.
3. Add `VITE_GOOGLE_DRIVE_API_KEY`.
4. Re-run the GitHub Pages workflow.

For safety, restrict the API key in Google Cloud to your GitHub Pages domain.

## Deploy on GitHub Pages

1. Push changes to `main`.
2. In GitHub, open **Settings > Pages**.
3. Set **Source** to **GitHub Actions**.
4. The workflow builds the React app and publishes `dist`.
