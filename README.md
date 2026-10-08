# Yoann Casals portfolio

Responsive static portfolio inspired by the supplied layout reference. No build step or package install is required.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server 8000` from this folder and visit http://localhost:8000.

## Publish on GitHub Pages

1. Upload the contents of this folder to the root of a GitHub repository.
2. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
3. Open the URL GitHub Pages provides after deployment.

All local asset links are relative and work from a repository subpath.

## Update the reel

The supplied 1080p showreel is included as `showreel-homepage.mp4` and plays in the full-screen responsive player. It starts muted and loops while visible, unless the visitor has enabled reduced motion; native video controls let them pause or stop it. The original file was 119 MB, so the included H.264 copy is compressed to fit GitHub’s standard per-file upload limit while retaining its 1080p resolution. The source did not contain an audio stream. The video is self-hosted, with no third-party video embed added.

## Contact form

The short contact form validates name, email and message, then opens the visitor's email app with a message addressed to `yoanncasals@gmail.com`. The visitor sends it from their own mail app; GitHub Pages does not receive or store form submissions.
