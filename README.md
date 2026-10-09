# Yoann Casals portfolio

Responsive static portfolio inspired by the supplied layout reference. No build step or package install is required.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server 8000` from this folder and visit http://localhost:8000.

## Publish on GitHub Pages

1. Upload the contents of this folder to the root of a GitHub repository.
2. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
3. Open the URL GitHub Pages provides after deployment.

All local asset links are relative and work from a repository subpath.

## Hero background

The header uses `hero-background.mp4` as a muted, looping, inline background video with `hero-ranch.png` as its poster fallback. Keep both files in the repository root when publishing. The video is H.264 and has no audio track; it pauses when the visitor requests reduced motion.

## Update the reel

The 1080p showreel is included as `showreel-homepage.mp4`. It fills the viewport, plays muted and loops while visible, unless the visitor has enabled reduced motion. The player has no visible controls or labels. The original file was 119 MB, so the included H.264 copy is compressed to fit GitHub’s standard per-file upload limit while retaining its 1080p resolution. The source did not contain an audio stream. The video is self-hosted, with no third-party video embed added.

## Contact

The “Nous écrire” button opens the visitor's email app addressed to `yoanncasals@gmail.com`. The visitor sends the message from their own mail app; GitHub Pages does not receive or store form submissions.


## Visual theme

The site uses the supplied Noir Ember Crown palette: black (`#000000`), deep umber (`#1a120f`), antique gold (`#b7791f`) and ember (`#f6ad55`). A subtle static grain texture covers the page without blocking clicks.
