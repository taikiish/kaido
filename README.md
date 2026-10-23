# Kaido

Website for **Kaido**, the iPhone app that logs every drive and maps every road you've driven, car by car.

Live at https://taikiish.github.io/kaido/

| Page | File |
| --- | --- |
| Overview | `index.html` |
| About | `about.html` |
| Support (searchable answers) | `support.html` |
| Contact (writes the email for you) | `contact.html` |
| Privacy policy (linked from the App Store) | `privacy.html` |

Served with GitHub Pages from the `main` branch. Plain HTML, one stylesheet (`assets/site.css`) and one script (`assets/site.js`), no build step. Every page reads fine without JavaScript.

- `assets/screens/` real screenshots of the app's demo garage, status bar cropped.
- `assets/data/routes.json` the demo garage's routes (simplified), used by the "Look up a drive" map on the home page. `land.json` is state and prefecture outlines from the app's own atlas data (Natural Earth, public domain).
- `assets/logo/` the wheel-O mark and wordmark as SVG.

Contact: taikishik@gmail.com
