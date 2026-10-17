# Creativo portfolio website

A lightweight, responsive static website built with HTML, CSS, and JavaScript. No framework or build step is required.

## Before publishing
1. Open `index.html` in a text editor.
2. Find `const CONTACT_EMAIL = "YOUR_EMAIL@example.com";` and replace it with your real professional email address.
3. Replace the six portfolio example links and titles with your own real projects.
4. Replace the gradient thumbnail blocks with real project thumbnail images (or use video-platform thumbnails). Only publish work you have permission to show.
5. Update page title and meta description if your positioning changes.

## Preview locally
Double-click `index.html` to open it in a browser.

## Publish free with Cloudflare Pages
1. Create a GitHub account if needed, then create a repository named `creativo-portfolio`.
2. Upload `index.html` to the repository's top level.
3. In Cloudflare Dashboard, open Workers & Pages → Create application → Pages → Import an existing Git repository.
4. Select the repository. For a plain static HTML site, use `index.html` at the project root. If asked for build settings, no framework/build is needed; use build command `exit 0` and output directory `.` where supported.
5. Deploy and choose the available `*.pages.dev` address.
6. Open the public URL on desktop and phone and test every portfolio link and the contact flow.

## Alternative: Netlify Drop
You can also sign in to Netlify and use its manual deploy/drop flow to publish the folder and receive a `*.netlify.app` address. For ongoing edits, Git-based deployment is preferable.

## Important
The portfolio tiles currently link to generic example websites. They are intentionally placeholders and must be replaced before sharing the website with clients. The email form uses the visitor's email application (`mailto:`); it is not a backend form and works only if the visitor has an email app configured.
