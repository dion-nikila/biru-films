# Biru Films — A different frame of mind

An independent website concept for Biru Films, built around the studio’s orbital identity and its publicly available film work. This is a proposal, not an official commissioned website.

## Experience

- Opening title curtain, oversized moving wordmark, orbital photography, and pointer parallax.
- Scroll-expanded cinema section with the official **In The Middle** trailer artwork.
- Staggered project layouts, custom title treatments, and accessible film dialogs.
- Interactive 2.39:1, 16:9, and 4:3 framing study.
- Word-by-word studio reveal, rotating orbital illustration, moving typography, and a large contact finale.
- Dedicated phone composition, an accessible mobile menu, native scrolling, reduced-motion support, and a persistent motion switch.

## Run locally

Serve `dist/` using any static web server. For example:

```sh
python3 -m http.server 8080 --directory dist
```

There is no build step, framework, dependency install, analytics, backend, or form submission. YouTube players load only when a film is opened. All other fonts and imagery are local.

## Validation

Checked in Chromium at phone widths of 320 and 390 pixels, a 768-pixel tablet viewport, and a 1363-pixel laptop viewport. No horizontal page overflow was observed. The mobile menu, navigation, framing controls, film dialog, focus restoration, and motion toggle were exercised. JavaScript syntax and local asset references were checked. These are browser viewport checks, not a claim of physical-device or Safari certification.

## Publishing

The client website is published from the `docs/` folder on the `main` branch using GitHub Pages. `docs/` is an exact deployment copy of `dist/`, excluding local QA tools. Update both folders together.

## Content and sources

See [SOURCES.md](SOURCES.md) for the verified profile, film links, visual references, and asset attribution. The two notebook poster treatments and website copy are proposed design work. The coastline and wave photographs are illustrative visual studies, not Biru film stills. The official trailer artwork remains Biru’s original artwork.

Before a commissioned launch, replace the concept treatments with approved film masters, confirm project credits and service copy with the studio, and add their preferred enquiry destination. The prototype links to the verified Instagram profile rather than an invented email address.

Font license files are in `licenses/`. Third-party artwork and photographs remain subject to their respective owners and licenses.
