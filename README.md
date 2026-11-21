# Cardon bleu

A tiny pinboard for text you copy again and again. Put each snippet on a card, sort the cards into tabs, and copy any of them with one click.

**Live:** https://cardon-bleu.storygraphers.digital

- One click copies a card
- Tabs for sorting; drag cards to reorder them or drop them on a tab to move them
- A short note on every card
- Light and dark mode
- Can be installed as an app and works offline
- No account, no server and no tracking. Everything stays in your browser

## How it works

The whole app is a single `index.html` with no dependencies and no build step. It uses the system fonts, so no third-party requests are made. Cards are saved in the browser's `localStorage`. That means:

- Your cards stay on your device and are never uploaded.
- They belong to one browser on one device and one web address. A different browser, device or URL starts empty.
- Clearing site data, or a private/incognito window, deletes them. Use **··· → Export as JSON** for backups.

## Run it

- **Online:** open the live link above.
- **Locally:** download `index.html` and open it in your browser. Install and offline mode need HTTPS or `localhost`, so they are switched off when you open the file directly.
- **Self-host:** copy all files to any static web host. You need HTTPS for the app features.

```
index.html            the app
manifest.webmanifest  app name and icons for installing
sw.js                 service worker (offline cache)
icons/                favicon and app icons
```

For local development with all features turned on:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Backup format

Export creates a JSON file:

```json
{ "version": 2, "activeIndex": 0, "tabs": [ { "name": "Snippets", "cards": [ { "note": "…", "text": "…" } ] } ] }
```

## License

[MIT](LICENSE) © 2026 storygraphers.
