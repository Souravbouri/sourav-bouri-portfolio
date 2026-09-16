# Sourav Bouri — Cybersecurity Portfolio

A cinematic, scroll-driven personal portfolio built with Flask, focused on
cybersecurity, defensive security, and practical systems learning.

The site is a single Flask page (`templates/index.html`) styled with a
custom cyber/terminal aesthetic (`static/css/style.css`) and animated with
vanilla JavaScript (`static/js/script.js`) — no frontend framework, no
build step.

---

## ✨ Features

- Scroll-driven cinematic section and word animations
- Hero identity panel with a live status sidebar (focus areas, location,
  current cycle: *Learn → Build → Hack → Improve → Repeat*)
- **Glitch / RGB-split identity effect** on the name, in the style of
  title-card glitches from *Mr. Robot* — triggers on a timer and on hover
- Ambient cybersecurity FX layer:
  - Matrix-style falling character rain (canvas, respects
    `prefers-reduced-motion`)
  - CRT scanlines, vignette, and film-grain overlay
  - Custom glow cursor (desktop only, native cursor hidden)
  - Text-decrypt / scramble-in animation on section labels
  - Typewriter effect on the availability badge
- **Subtle 3D tilt** on the hero photo and every card (projects, labs,
  skills, articles) that follows the cursor, with a soft light "glare"
  that tracks with it
- **Articles section**, pulling in your Medium and Substack posts as
  cards — see "Adding a new article" below
- **Working contact form** ("Let's talk security.") that emails you
  directly — your inbox address is never exposed anywhere in the HTML
  or JavaScript. See "Contact form setup" below.
- Interactive skill cards, animated timeline, and project/lab sections
- Fully responsive (desktop → tablet → mobile), with the hero photo and
  sidebar gracefully collapsing on smaller screens
- Respects `prefers-reduced-motion` throughout — all decorative animation
  layers are disabled automatically for users who request it

---

## 🗂 Project Structure

```
sourav-bouri-portfolio/
├── app.py                     # Flask app + the /contact mail route
├── requirements.txt
├── .env.example                # Copy to .env and fill in (never commit .env)
├── templates/
│   └── index.html             # Single-page site markup
├── static/
│   ├── css/
│   │   └── style.css          # All styling + cyber FX layer
│   ├── js/
│   │   └── script.js          # Scroll engine + cyber FX behaviour
│   └── images/
│       └── sourav.jpg.jpeg    # Hero photo
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Setup & Run (Windows)

Open **Command Prompt** or **PowerShell** in the project folder and run:

```bat
:: 1. Create a virtual environment
python -m venv .venv

:: 2. Activate it
.venv\Scripts\activate

:: 3. Install dependencies
python -m pip install -r requirements.txt

:: 4. Run the Flask app
python app.py
```

Then open your browser to:

```
http://127.0.0.1:5000
```

> **Note:** On some Windows setups, `pip` installs packages into the global
> environment instead of the active virtual environment. If that happens,
> always run pip and the app through the Python interpreter directly
> (`python -m pip install ...`) rather than the bare `pip`/`flask` commands —
> this guarantees you're using the venv's interpreter.

To stop the server, press `CTRL + C` in the terminal.

---

## 📧 Contact form setup

The "Let's talk security." form on the site sends real email — but your
inbox address is never written into `index.html` or `script.js`. It only
ever lives on the server, in a `.env` file that is git-ignored and never
uploaded anywhere.

**1. Create a Gmail App Password** (don't use your normal Gmail password):

1. Turn on 2-Step Verification on the Google account you want to send
   from: [myaccount.google.com/security](https://myaccount.google.com/security)
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Create an app password named something like "Portfolio Contact Form"
4. Google shows you a 16-character password — copy it (you won't see it
   again)

**2. Create your `.env` file:**

```bat
copy .env.example .env
```

Open `.env` and fill in:

```
MAIL_USERNAME=youraddress@gmail.com
MAIL_PASSWORD=the16characterapppassword
MAIL_TO=youraddress@gmail.com
```

`MAIL_TO` is where messages actually land — leave it the same as
`MAIL_USERNAME` unless you want them delivered somewhere else.

**3. Run the app as normal** (`python app.py`). Submit the form once
yourself to confirm it arrives.

If `.env` isn't filled in yet, the form still works safely — it shows the
visitor a friendly "not fully set up yet, reach me on GitHub/LinkedIn"
message instead of crashing.

**Built-in protections**, no extra setup needed:
- Every field is validated server-side (not just in the browser)
- A hidden honeypot field silently discards bot submissions
- A visitor can send at most 5 messages every 10 minutes

> **Not using Gmail?** Set `SMTP_HOST` / `SMTP_PORT` in `.env` to your own
> provider's values — the rest works the same way.

---

## ✍️ Adding a new article

The Articles section (`static/images` aside, everything here lives
directly in `templates/index.html`, inside `<div class="article-grid">`)
is built to grow. To add a new post:

1. Open `templates/index.html` and find the comment
   `<!-- ARTICLES -->` above the article grid.
2. Copy one whole `<a class="article-card"> ... </a>` block.
3. Update:
   - `href` → the article's URL
   - the `<img src="...">` → the article's cover image (or delete the
     `<img>` and keep `article-thumb-text` + `<span class="thumb-glyph">`
     for a text-only card, like the Substack one)
   - the two tags and the read-time/platform label in `.article-meta`
   - the `<h3>` title and the `<p>` description
   - the "Read on Medium" label if it's not a Medium post
4. Save and refresh — the grid reflows automatically for 1, 2, or many
   cards.

---

## 🛠 Tech Stack

- **Flask** — serves the page and handles the `/contact` mail route
- **python-dotenv** — loads mail credentials from `.env` at runtime
- **smtplib** (Python standard library) — sends the contact form email,
  no extra mail service dependency needed
- **HTML5 / CSS3** — custom cyber-terminal design system, no CSS framework
- **Vanilla JavaScript** — scroll engine, glitch FX, canvas matrix rain,
  text scramble, custom cursor, 3D card/photo tilt — no external JS
  libraries

---

## 📌 Notes for Future Updates

- The hero photo lives at `static/images/sourav.jpg.jpeg` — swap it out
  for a different image and it will automatically pick up the same
  grayscale scan-frame treatment.
- All ambient FX (matrix rain, scanlines, cursor, glitch bursts) are
  additive layers in `style.css` / `script.js` and can be tuned or removed
  independently without touching the core scroll engine.

---

## 📬 Contact

- GitHub: [Souravbouri](https://github.com/Souravbouri)
- LinkedIn: [Sourav Bouri](https://www.linkedin.com/in/sourav-bouri-5ba902293/)
