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

Add the final MP4 file under `assets/` and set it as the `src` on the `<video class="reel-player">` element in `index.html`. The attached ranch image is currently used as the hero background and video poster. A real video file or direct embed URL has not been supplied yet.

## Contact form

The short contact form validates name, email and message, then opens the visitor's email app with a message addressed to `yoanncasals@gmail.com`. The visitor sends it from their own mail app; GitHub Pages does not receive or store form submissions.
