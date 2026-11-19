# Avatar and Visual Asset Specification

## 1. Identity references

The user supplied three personal photographs in this conversation: - Two
outdoor/indoor photographs showing face, beard, hairstyle and glasses
variation. - One closer portrait giving additional hairstyle and facial
detail.

Use these as likeness references when generating new assets. Do not
substitute a generic stock developer avatar.

## 2. Identity characteristics to preserve

-   South Asian male appearance.
-   Short, dark, side-swept hair with natural volume.
-   Full, neatly maintained dark beard and moustache.
-   Warm medium-brown skin tone.
-   Oval facial structure and expressive eyes.
-   Friendly natural smile.
-   Glasses are an optional alternate, not mandatory in the default
    avatar.
-   A tilak may be omitted from the default professional avatar and
    retained only as an optional variation if desired.

## 3. Wardrobe

Default avatar outfit: navy-blue polo shirt, with understated details.
Keep the same outfit across related poses unless a deliberate alternate
outfit is approved.

## 4. Framing rules

### Static images

-   Use head-and-shoulders framing.
-   Include the full neck and both shoulders.
-   Keep the head, neck and torso anatomically connected and
    proportionate.
-   Avoid face-only crops, detached-looking heads, artificial neck
    extensions or obvious compositing.
-   Prefer a transparent background for reusable cutouts; otherwise use
    a simple background that can work with multiple themes.
-   Export a high-resolution master and optimized web versions.

### 3D animation assets

-   Use full-body assets when planning body movement, walking, turning,
    waving or expressive gestures.
-   Keep body proportions, clothing, face and hair consistent across
    frames/poses.
-   Plan for a static fallback and reduced-motion behavior.
-   Do not imply that a set of still images is a rigged 3D model. Actual
    3D animation requires a suitable model/rig or a deliberately created
    frame sequence.

## 5. Asset list

### Real photography

-   `profile-photo.webp`: approved head-and-shoulders portrait.
-   `profile-photo-alt.webp`: optional alternate crop or glasses
    version. Only use a photograph after the user selects/approves it
    for the site.

### Stylized avatar

-   `avatar-portrait.webp`: default head-and-shoulders avatar, no
    glasses.
-   `avatar-portrait-glasses.webp`: glasses alternate.
-   `avatar-coding-full.webp`: full-body coding pose if generated.
-   `avatar-thinking-full.webp`: full-body thinking pose if generated.
-   `avatar-explaining-full.webp`: full-body explaining pose if
    generated.
-   `avatar-standing-full.webp`: full-body standing pose if generated.

These are proposed filenames, not files that have already been created
or approved.

## 6. Export and optimization

-   Keep editable/high-resolution masters separately from web exports.
-   Use WebP/AVIF for static web delivery where practical.
-   Use transparent PNG or WebP only when transparency is required and
    verified.
-   Use descriptive filenames and meaningful alt text.
-   Avoid embedding text inside avatar artwork unless specifically
    required.
-   Record source, approval status, dimensions and intended use in an
    asset inventory.

## 7. Quality checklist

-   Facial likeness is recognizable and consistent.
-   Head/neck/shoulder anatomy looks natural.
-   Skin tone and lighting are coherent.
-   No extra fingers, distorted hands, inconsistent accessories or
    malformed clothing.
-   Image has enough padding for responsive cropping.
-   Background/transparency is clean.
-   The asset works against both light and dark surfaces.
