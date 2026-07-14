# Plan: Fix collapsed grid overflow clipping card side edges

## Problem
`overflow: hidden` on `.cakes-grid.collapsed` clips card side edges and shadows horizontally, not just vertically.

## Fix
Replace `overflow: hidden` with `overflow-x: clip; overflow-y: hidden;`
- `overflow-x: clip` clips horizontally without creating a scroll container
- `overflow-y: hidden` clips vertically for the max-height constraint
- `mask-image` handles the visual fade at the bottom

## File: `menu.css` line 272-276
Change:
```css
.cakes-grid.collapsed{
    overflow:hidden;
    -webkit-mask-image:linear-gradient(to bottom, black 80%, transparent 100%);
    mask-image:linear-gradient(to bottom, black 80%, transparent 100%);
}
```
To:
```css
.cakes-grid.collapsed{
    overflow-x:clip;
    overflow-y:hidden;
    -webkit-mask-image:linear-gradient(to bottom, black 80%, transparent 100%);
    mask-image:linear-gradient(to bottom, black 80%, transparent 100%);
}
```
