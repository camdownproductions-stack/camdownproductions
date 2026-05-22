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

## Dashboard

After deployment, open:

```text
https://camdownproductions-stack.github.io/camdownproductions/admin/
```

The dashboard lets you update:

- Google Drive folder IDs
- Menu items and Portfolio dropdown links
- Blog posts
- Brand text
- Hero text
- Collage heading
- Intro text
- Kind words section
- Contact Instagram button

To publish from the dashboard, create a GitHub fine-grained personal access token:

1. GitHub > **Settings > Developer settings > Personal access tokens > Fine-grained tokens**
2. Repository access: `camdownproductions-stack/camdownproductions`
3. Permissions: **Contents: Read and write**
4. Paste the token into the dashboard and click **Load Website Data**

The token stays in the browser session and is not stored by the website. Saving from the dashboard commits changes to:

- [public/drive-folders.json](public/drive-folders.json)
- [public/site-content.json](public/site-content.json)

GitHub Pages redeploys automatically after the commit.

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
