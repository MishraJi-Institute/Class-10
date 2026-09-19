# Sant Shri Asaramji Gurukul, Indore — Study Material Website

This repository contains the school study-material portal for **Sant Shri Asaramji Gurukul, Indore**.

## What the website does

The home page is a **multi-subject study library**, not an AI-only page. It automatically discovers HTML presentations from GitHub.

### Add a new HTML PPT without editing the website

Put the new presentation inside:

```text
ppts/
  Mathematics/
    your-presentation.html
  AI/
    your-presentation.html
  Computer-Science/
    your-presentation.html
```

Then commit/push it to GitHub. Refresh the website. The new presentation will be detected automatically and shown under its subject.

The HTML PPT should preferably include:

```html
<title>Your Presentation Title</title>
<meta name="description" content="Short description of the presentation.">
```

No manual card entry is required in `index.html` or `home.html`.

## Main files

- `index.html` — main multi-subject study library
- `home.html` — home/library alias
- `library.js` — automatically fetches HTML PPTs from the GitHub repository
- `glass-ui.css` — glassmorphism and visual styling
- `animations.js` — smooth animation layer
- `ppts/` — place future HTML presentations here
- `presentation.html` — existing Class 10 AI Unit 1 presentation

## GitHub repository convention

Repository: `mishraji-institute/Class-X`

HTML study presentations should be placed under `ppts/` so the automatic discovery system can distinguish them from the website's own pages.
