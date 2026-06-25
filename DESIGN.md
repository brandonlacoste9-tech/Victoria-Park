# JustBookMe Design System

## Core Aesthetic
The application features a luxurious, modern SaaS aesthetic combining a light leather motif with clean, glassmorphism elements. It leans into a premium "stitched leather" aesthetic inspired by classic craftsmanship, while maintaining modern usability standards.

## Color Palette

### Base & Backgrounds
- `--background`: `#faf7f2` (Main application background, an off-white cream)
- `--surface`: `#ffffff` (Card and container surfaces)
- `--surface-elevated`: `#fffdf9` (Slightly elevated surfaces)

### Leather & Stitching Details
- `--leather`: `#eae0d3` (Base color for the leather texture, a soft tan/beige)
- `--leather-stitch`: `#c4a882` (Color used for dashed stitching borders and shadow accents)

### Branding & Accents
- `--primary`: `#1e3a5f` (Deep navy blue for strong contrast and primary text/buttons)
- `--accent`: `#c4a035` (A rich, gold-like yellow for primary CTAs and highlights)
- `--teal`: `#2d6a5a` (Secondary accent color for success states and badges)

## Texture & Motifs

### Leather Texture (`.leather`)
A custom SVG `feTurbulence` fractal noise filter is layered over the `--leather` base color to create a realistic, subtle leather grain texture. This is primarily used as the background for the application shell and dashboard layout to give a premium feel to the workspace.

### Stitched Cards (`.card`)
Cards and primary containers utilize a stitched design motif:
- **Border**: A 2px dashed border using `rgba(196, 168, 130, 0.5)` (derived from `--leather-stitch`) to simulate stitching.
- **Shadows**: Soft drop shadows combined with an `inset` shadow to give the cards a slightly recessed or embossed "stamped into the leather" look.
- **Hover States**: On interactive elements, the border opacity increases and the box elevates with a slightly stronger drop shadow, emphasizing the tactile nature of the UI.

## Typography
- **Headings / Display**: `Fraunces` (or similar serif). Used for large marketing text, hero sections, and prominent titles to give an editorial, premium feel.
- **Body / UI**: `DM Sans`. Clean, highly legible sans-serif for all functional UI elements, forms, and data tables.
