# Htet Aung — Portfolio Website Example

A single-page, responsive portfolio built with plain HTML, CSS and JavaScript for GitHub Pages.

## Preview locally

Open `index.html` directly, or run a local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Important replacements

### 1. Profile photo
Replace:

`assets/images/profile-placeholder.jpg`

Keep the same filename, or update the path in `index.html`.

### 2. YouTube showreel
Search in `index.html` for:

`M7lc1UVf-VE`

Replace it with your own YouTube video ID. Example: for `youtube.com/watch?v=ABC123`, use `ABC123`.

### 3. Nine reels
Replace the files in `assets/videos/` and update each reel card's `data-video` and `<source src>` values in `index.html`.

The included abstract MP4 files are lightweight layout placeholders.

### 4. Nine graphics
Replace `assets/images/graphic-01.jpg` through `graphic-09.jpg` with your real work. Keeping the same filenames is the fastest method.

### 5. Contact and social links
Search for:

- `your-email@example.com`
- LinkedIn
- TikTok
- YouTube
- Instagram

Replace the `href="#"` values with your real links.

### 6. CV
Put your final PDF here:

`assets/documents/Htet_Aung_Video_Editor_CV.pdf`

Then change the contact button link from `assets/documents/README.txt` to that PDF filename.

### 7. Text and experience
All text is in `index.html`, so it can be edited without a framework or build step.

## Theme colors

Four accent themes are already included in the navigation: lime, violet, cyan and orange. The selected theme is saved in the browser.

To change the default theme, edit the opening `<html>` tag:

```html
<html lang="en" data-theme="lime">
```

## Publish to your GitHub Pages repository

1. Back up your existing repository.
2. Delete the old example website files.
3. Upload everything inside this folder to the repository root.
4. Commit the changes to the `main` branch.
5. GitHub Pages will rebuild the same `HtetAungYeWont.github.io` address.

Keep any existing `CNAME` file if you later connect a custom domain.
