# Creativo

A minimal, responsive portfolio for video editing and motion design.

Warm ivory, near-black, a restrained luxury violet accent (#7F00FF), oversized typography,
and six original, editable concept covers. Built with HTML, CSS, and vanilla
JavaScript. No framework, npm packages, account, or build step is required.

## 1. Run the website

Extract the ZIP, then open `index.html` in a modern web browser. Keep the
files and `assets` folder together. All default artwork and the silent demo
reel are included locally; the default website has no external dependencies.

For a local HTTP preview, Python 3 is optional:

```sh
python serve.py
```

On Windows, `py serve.py` also works when Python is installed through the
standard Windows launcher. Open the address printed by the script,
`http://localhost:8000`. Stop the server with Ctrl+C.

To use another port:

```sh
python serve.py --port 8001
```

The separate `creativo.html` download is an all-in-one edition. Its artwork,
video, CSS, and JavaScript are embedded in the HTML file. Open it directly
in a browser. The source folder is the recommended edition for editing.
The two editions are independent; editing one does not update the other.

## 2. Where to edit

| File | Purpose |
| --- | --- |
| `content.js` | About copy, projects, videos, services, tools, email and social profiles |
| `index.html` | Page structure, hero headline, section headings, metadata and form labels |
| `styles.css` | Colors, typography, layouts, responsive rules and animation |
| `script.js` | Gallery, video player, navigation, contact draft and interactions |
| `assets/` | Editable SVG covers, favicon and original demo MP4 |
| `serve.py` | Optional local preview server using Python's standard library |
| `QA_RESULTS.json` | Automated browser-check results and testing scope |

Use a plain-text or code editor, save, and refresh your browser. There is no
admin dashboard or database. For a published site, upload the edited files
again after making changes.


## Social proof placeholders

The homepage now includes a dark **Proof of Work** section after Selected Work.
The client logo row scrolls continuously from right to left and pauses on hover. It also respects reduced-motion accessibility settings.

Edit the `socialProof` object in `content.js` to replace the four credibility
stats, six placeholder client logos, and three sample testimonials. The included
logos and quotes are intentionally generic placeholders and should **not** be
published as real client claims.

For each real testimonial, replace the `quote`, `name`, and `role`. For the logo
strip, the simplest option is to replace each `name` with the client name. If
you later want image/SVG client logos instead of text wordmarks, update the
logo renderer in `script.js` or add them directly in `index.html`.

## 3. Replace the sample projects

Open `content.js` and edit an object in the `projects` array. For example:

```js
{
  id: "your-project",
  title: "Your project title",
  category: "Motion design",
  type: "SaaS explainer",
  year: "2026",
  cover: "assets/your-project-cover.jpg",
  coverAlt: "A short, meaningful description of the project cover",
  description: "Your actual brief, creative approach, and contribution.",
  role: "Design & animation",
  tools: "After Effects / Illustrator",
  isDemo: false,
  video: { type: "file", src: "assets/your-film.mp4", captions: "" },
  projectUrl: ""
}
```

Place the new media file in `assets`. Landscape covers with a 4:3 aspect
ratio fit the gallery best. Each project has a title, category, cover,
description, role, tools, and optional full-project link. Copy or remove an
object to add or remove a project. Keep a comma between objects.

Category filters and project counts update automatically. The next-project
button follows the selected category, not unrelated projects.

An empty `video.src` opens the project cover and its details instead of a
broken video. Set `isDemo: false` after replacing that concept with your
actual work. The sample-project notice disappears when no demo projects
remain. The six included projects are fictional layout examples, not
claimed client commissions, testimonials, or achievements.

### Direct video files

```js
video: {
  type: "file",
  src: "assets/my-project.mp4",
  captions: ""
}
```

H.264 MP4 is a practical choice for browser playback. A suitable WebM file
or a direct HTTPS video URL can also be used. A cloud-drive sharing page
is not a direct video URL. Keep filenames simple and match capitalization.

### YouTube

```js
video: {
  type: "youtube",
  src: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
}
```

The parser accepts full watch URLs, short links, Shorts/embed URLs, and
11-character video IDs. Replace the example ID with your actual one.
YouTube must permit embedding. A video may be unavailable because of its
owner's settings, account requirements, restrictions, or connectivity.

### Vimeo

```js
video: {
  type: "vimeo",
  src: "https://vimeo.com/YOUR_VIDEO_ID"
}
```

Numeric Vimeo IDs, standard URLs, player URLs, and unlisted-video privacy
hashes are supported. Vimeo must permit embedding on your domain.

External players load only when their project or showreel is opened, and
need an internet connection. The default site uses no external players.
Native video has controls; third-party video uses the provider's player.

### Captions

For a direct video, place a WebVTT file in `assets` and set `captions` to its
path. The default label is English; edit `script.js` to change the track
language. Preview caption tracks through a local HTTP server or your host,
not a direct file URL. The bundled demo reel is silent.

## 4. Replace the showreel

The supplied `assets/creativo-demo.mp4` is an original 12-second silent
motion study, visibly labelled as a design demo. It is not presented as
work you have completed for a client.

Edit the `showreel` object in `content.js`:

```js
showreel: {
  title: "Creativo showreel",
  description: "A selection of my video editing and motion design work.",
  type: "file",
  src: "assets/my-showreel.mp4",
  poster: "assets/my-showreel-cover.jpg",
  badge: "SHOWREEL / 00:45",
  isDemo: false,
  backgroundSrc: "assets/my-short-muted-preview.mp4",
  captions: ""
}
```

The main player also accepts the YouTube and Vimeo types above. The
background preview must be a direct video file, not a YouTube/Vimeo page.
Use a short, lightweight, muted version, or set `backgroundSrc: ""` for a
static hero. The background pauses offscreen, when the tab is hidden, and
while a project dialog is open. It respects reduced-motion preferences
and the browser's data-saver setting when that setting is exposed.

## 5. Configure contact

The default email is deliberately empty, so an enquiry cannot be sent to
an unintended address. In this mode the form validates input, shows a
copyable draft, and explicitly states that nothing has been sent.

Set your address in `content.js`:

```js
contact: {
  email: "you@yourdomain.com",
  socials: [
    { label: "Vimeo", url: "https://vimeo.com/yourprofile" },
    { label: "Behance", url: "https://www.behance.net/yourprofile" },
    { label: "Instagram", url: "" },
    { label: "LinkedIn", url: "" }
  ]
}
```

Use your real URLs. Social links with empty or invalid URLs are hidden.

Once an email is configured, the form opens the visitor's email application
with the enquiry filled in. The visitor must send it there. A visible,
copyable draft remains as a fallback when no email app is configured or a
long mailto link is not accepted by the application.

**This is not a backend email form.** It does not send, store, or silently
submit data. There are no tracking scripts, API keys, or analytics in the
provided code. Connecting a future email service or backend requires
separate configuration and appropriate handling of visitor information.

## 6. Styling and content

The main theme variables are at the top of `styles.css`:

```css
:root {
  --paper: #f8f7f5;
  --ink: #252521;
  --accent: #7f00ff;
  --accent-orange: #ef5935;
  --max: 1280px;
}
```

Violet is the primary accent. Orange is used as a restrained secondary accent for CTA hover states, micro-details, selected motion artwork, and warm emphasis so the palette stays minimal and premium.

The site uses system sans-serif fonts and Georgia for italic accents.
No font downloads or font files are bundled. For a new headline, change
`#hero-title` in `index.html`. Update the page's description meta tag and
other section headings there as well.

The SVG covers are editable text/vector files. Their typography uses the
viewer's system fonts. All concept artwork and the silent demo video are
included to make the initial portfolio usable without external assets.

## 7. Publish

Upload the contents of this source folder to a static web host. The
publish directory is the folder containing `index.html`. There is no build
command. Preserve the relative paths and the `assets` folder. Test your
real video embeds, links, email handoff, and caption files on the deployed
domain. Add only work and client credits you have permission to publish.

This delivery does not include hosting, a domain, an admin panel, a
content-management system, or a deployed email backend.

## 8. Browser checks

`QA_RESULTS.json` contains the last full Chromium regression run: 39 passing
checks covering filters, project navigation, dialog focus restoration,
bundled video playback, reduced motion, contact validation, copy feedback,
mobile navigation, and overflow at representative desktop/mobile widths.

The cleanup pass also revalidated JavaScript syntax and Python helper syntax.
This environment currently blocks fresh browser navigation during the final
cleanup pass, so test the deployed build once on your real hosting domain.
Live mail-app delivery, external YouTube/Vimeo playback, Safari, Firefox, and
physical mobile devices still require real-device/deployed-domain testing.
