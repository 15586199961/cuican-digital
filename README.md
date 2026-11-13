# Cuican Digital · AI-powered creative advertising

Official bilingual website for 武汉璀粲数字科技有限公司.
English: `index.html` (default), `en.html` (compatibility alias).
Chinese: `zh.html`.

## Local preview

Run `python -m http.server 8081 --bind 127.0.0.1` in this directory.

## Opening and performance

`cursor-build.js` and `cursor-build.css` are Cuican's original page-build choreography: measured elements, colored cursors with production roles, selection frames, dimension labels, typed reveals, progress, replay and skip. It plays on every load, respects reduced-motion preferences, stops on Escape, scrolling, resizing or navigation, and does not capture or transmit page snapshots. It is a website-specific opening, not a generic browser-extension engine.

The opening does not use or distribute the unlicensed `DhvanilPatel/swarm-cursors` / `califa/swarm-site` engine. Earlier local evaluation files are excluded from the public package.

The forest scene initially uses locally hosted pre-rendered WebP images: 113,588 bytes desktop and 24,810 bytes mobile. Three.js and procedural geometry load only when a visitor chooses “Enable live 3D”. Actual frame rates depend on the device; no fixed rate is guaranteed.

## Credits and licenses

- Living-world scene adapted from [ThreeUI / Sylva](https://github.com/MengTo/threeui), MIT; see `THREEUI-LICENSE.txt`.
- Three.js retains its upstream copyright and MIT license in the distributed library.
- Manrope variable font, SIL Open Font License; see `fonts/OFL.txt`.
- The company content and site-specific code are not offered under a blanket open-source license.

WeChat: `an941234567890`. X: <https://x.com/muhammudvalero>.
No invented clients, testimonials, performance figures or registration numbers are displayed. The landscape is a concept visual, not a client project. The English company name is a working translation.

## Hosting

GitHub Pages publishes the static root of `main`. All site asset URLs are relative, so the same package works at the repository subpath. No account credentials, API keys, form submissions or analytics are included.
