# Shafkat H Muhit, portfolio (Next.js)

A single-page portfolio built with Next.js (App Router) and React. No database, no environment variables.

## Run it on your computer

```bash
npm install
npm run dev        # opens http://localhost:3000
```

## Put it live on Vercel

1. Create a new GitHub repository and upload everything in this folder (not `node_modules` or `.next`).
2. On vercel.com choose **Add New, Project**, connect GitHub and pick the repository.
3. Leave every setting as it is (Vercel detects Next.js) and press **Deploy**.

Every time you push a change to GitHub, Vercel publishes it again by itself.

## Where to change things

| What | File |
| --- | --- |
| Text, links, phone, email, projects, prices, reviews | `src/data.js` |
| Your photo | `public/photo.jpg` (keep the same name, or edit `src/photo.js`) |
| Colours, fonts, spacing, animation | `app/globals.css` |
| Page title and description for Google | `app/layout.jsx` |

### Add a screenshot to a project

1. Put the image in `public/projects/`, for example `public/projects/idms.jpg`.
2. In `src/data.js`, set `image: '/projects/idms.jpg'` on that project.

The image then shows in the project row and in the hover preview.

### Still to replace

- The four reviews in `QUOTES` are demo text.
- The prices in `PRICING` are examples.

## Contact form

The site has no server, so the form does not store messages. Its buttons open WhatsApp or the visitor's email app with the
message already written, or copy it. If you want messages delivered to an inbox without the visitor's email app, add a
form service such as Formspree later.

## Single-file preview (optional)

`npm run preview:html` writes `dist/standalone.html`, the whole site in one file. It is only for quick previews.
