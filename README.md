# react-angpao-rain

English | [繁體中文](./README.zh-TW.md)

A red envelope (angpao) rain mini game for React, built on [Phaser 3](https://phaser.io/).

Players drag a character left and right to catch falling angpao before the timer runs out. Your backend decides the prize, which the game then reveals on a summary and result screen.

- Drop-in `<AngpaoRain />` component, or `<AngpaoRainLauncher />` (floating button + full-screen overlay)
- The prize comes from your own `onDraw` callback, so it works with any backend
- Themes: swap the whole artwork by passing a different set of images. Two themes are built in
- English and Simplified Chinese artwork
- Images ship with the package and load lazily, only for the theme in use
- No UI framework dependency, all styles are self-contained

`react >=19 <20`, `phaser ^3.90`


## Install

```bash
yarn add react-angpao-rain phaser
# or
npm install react-angpao-rain phaser
```

`react`, `react-dom` and `phaser` are peer dependencies.


## Usage

Import the stylesheet once, e.g. in your entry file:

```tsx
import 'react-angpao-rain/dist/index.css';
```

### Launcher (floating button + overlay)

```tsx
import {AngpaoRainLauncher, type DrawRequest, type DrawResult} from 'react-angpao-rain';

const draw = async ({score}: DrawRequest): Promise<DrawResult> => {
    const res = await fetch('/api/angpao-draw', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({angpao_count: score}),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json(); // {counts: [{type: 0, amount: 2}, ...], result: 12.5}
};

const App = () => (
    <AngpaoRainLauncher
        locale="zh-CN"
        onDraw={draw}
        onClaim={result => console.log('claimed', result)}
    />
);
```

A floating button appears in the bottom-right corner. It opens the game in a full-screen overlay, which closes again when the player presses the close button on the title screen or the receive button on the result screen.

### Inline

`<AngpaoRain />` fills its parent element and scales the game to fit, so give the parent a size:

```tsx
import {AngpaoRain} from 'react-angpao-rain';

<div style={{width: 360, height: 640, background: '#5a0a0a'}}>
    <AngpaoRain onDraw={draw} onClose={() => setShowGame(false)}/>
</div>
```

The game canvas is transparent, so the parent's background shows through. To start a new round, remount the component, e.g. by changing its `key`.


## Game flow

```
Loading → Title → Countdown → Play (duration) → Time's up → Summary (5s) → Result
            │                                     │                         │
         onClose                        onGameOver, onDraw              onClaim
```

`onDraw` is called as soon as the timer runs out, while the "time's up" animation plays, so the request usually finishes before the summary screen appears.


## API

### `<AngpaoRain />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `onDraw` | `(req: {score}) => Promise<DrawResult>` | **required** | Called when the round ends. Resolve with the prize to show. |
| `onClaim` | `(result: DrawResult) => void` | | Player pressed the receive button on the result screen. |
| `onClose` | `() => void` | | Player pressed the close button on the title screen. |
| `onGameOver` | `(info: {score, time}) => void` | | Timer ran out, just before `onDraw`. |
| `onError` | `(error: unknown) => void` | | `onDraw` rejected or resolved with a malformed result, or the theme's images are incomplete or failed to load. Without it, errors are logged with `console.error`. |
| `theme` | `AngpaoRainTheme` | `defaultTheme` | Artwork of the game, see [Themes](#themes). |
| `locale` | `'en-US' \| 'zh-CN'` | `'en-US'` | Language of the in-game artwork (English or Simplified Chinese). |
| `duration` | `number` | `10` | Round length in seconds. |
| `formatAmount` | `(value) => string` | ``v => `RM ${v}` `` | Formats the total on the result screen. |
| `width` / `height` | `number` | `450` / `800` | Logical game size; the canvas is scaled to fit its parent. |
| `className` / `style` | | | Applied to the wrapper element. |

Changing `theme`, `locale`, `duration`, `width` or `height` restarts the game. Callback props can change freely. Define themes at module level, not inline in JSX: a new theme object on every render would restart the game every render.

### `<AngpaoRainLauncher />`

Accepts every `<AngpaoRain />` prop except `className` / `style`, plus:

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | | Controlled open state. Leave undefined to let the launcher manage it. |
| `onOpenChange` | `(open: boolean) => void` | | Called whenever the launcher wants to open or close. |
| `defaultOpen` | `boolean` | `false` | Initial state when uncontrolled. |
| `closeOnClaim` | `boolean` | `true` | Close the overlay after the receive button is pressed. |
| `hideButton` | `boolean` | `false` | Hide the floating button, e.g. to open only through `open`. |
| `buttonImage` | `string` | the theme's `launcherImage` | Image for the floating button. |
| `buttonLabel` | `string` | `'Play angpao rain'` | Accessible label of the button and the dialog. |
| `buttonClassName` | `string` | | Extra class on the button. |

While the overlay is open, page scrolling is locked.

### `DrawResult`

```ts
interface DrawResult {
    /** Breakdown on the summary screen, up to 13 rows */
    counts: {type: number, amount: number | string}[]
    /** Total on the result screen, passed through formatAmount */
    result: number | string
}
```

`type` is the prize artwork index, `0` – `12` (see [prize artwork](#prize-artwork)). Either way the player can still finish and close the game:

- `onDraw` rejects: `onError` is called and the game shows an empty result (`0`).
- `onDraw` resolves with a malformed result: `onError` is called with what is wrong, and the game shows the valid part. Rows without a known `type` are dropped, rows past the 13th are not shown, and a missing `result` shows `0`.

### `AngpaoRainLocale`

`'en-US' | 'zh-CN'`, the type of the `locale` prop. Only these two values are supported. Any other value (e.g. from untyped JavaScript) falls back to `'en-US'`. If your app uses other locales, map them yourself:

```tsx
<AngpaoRain locale={i18n.language.startsWith('zh') ? 'zh-CN' : 'en-US'} onDraw={draw}/>
```


## Themes

A theme is a complete set of the game's images. The game code never changes between themes: a new look is just a new set of images with the same file names and sizes.

### Built-in themes

| Theme | Look |
|---|---|
| `defaultTheme` | Red envelopes, gold coins, ingots, lanterns and a lucky kid. Used when no `theme` is passed. |
| `christmasTheme` | Santa, gift boxes, ornaments and snowflakes. |

```tsx
import {AngpaoRainLauncher, christmasTheme} from 'react-angpao-rain';

<AngpaoRainLauncher theme={christmasTheme} onDraw={draw}/>
```

Each theme's images are a separate chunk (about 1.1 MB gzipped) that is only downloaded when a game with that theme is mounted. Themes you don't use are never downloaded.

### `AngpaoRainTheme`

```ts
interface AngpaoRainTheme {
    /** Shown in error messages */
    name: string
    /** Every image, keyed by file name, or a function that loads them */
    images: Record<AngpaoRainImageFile, string> | (() => Promise<Record<AngpaoRainImageFile, string>>)
    /** Floating button of the launcher */
    launcherImage?: string | (() => Promise<string>)
    colors?: {
        text?: string   // loading text, score, timer, prize counts. Default '#ffffff'
        total?: string  // total prize on the result screen. Default '#3BAEDD'
    }
}
```

`AngpaoRainImageFile` is the union of every file name, so TypeScript flags a typo. The image URLs can be anything the browser can load: imported files, paths in your `public/` folder, or a CDN.

### Making a new theme

1. Give the designers the [image spec](#image-spec) below, plus an existing theme as a reference ([`src/themes/default/img`](./src/themes/default/img)). Every image must keep its file name and pixel size.
2. Check the delivered folder:

    ```bash
    yarn theme:check path/to/delivered/img
    ```

    It lists missing files, wrong sizes, and files the game doesn't use.
3. Add the theme. Pick one:

    **In this package** (other projects get it with the next release): put the images in `src/themes/<name>/img/` and the button image at `src/themes/<name>/launcher.png`, copy `index.ts`, `images.ts` and `launcher.ts` from [`src/themes/christmas`](./src/themes/christmas), rename the export, and export it from [`src/themes/index.ts`](./src/themes/index.ts).

    **In your own project** (e.g. artwork you can't publish), with Vite:

    ```ts
    // themes/brand/index.ts
    import {type AngpaoRainTheme, toThemeImages} from 'react-angpao-rain';

    export const brandTheme: AngpaoRainTheme = {
        name: 'brand',
        // a separate chunk, downloaded only when the game is mounted
        images: () => import('./images').then(module => module.default),
        launcherImage: '/brand/launcher.png',
        colors: {total: '#ffd84a'},
    };

    // themes/brand/images.ts
    export default toThemeImages(import.meta.glob<string>('./img/*.png', {eager: true, import: 'default'}));
    ```

    **On a CDN**:

    ```ts
    import {type AngpaoRainImageFile, type AngpaoRainTheme, THEME_IMAGE_SPEC} from 'react-angpao-rain';

    const base = 'https://cdn.example.com/angpao-rain/brand';
    export const brandTheme: AngpaoRainTheme = {
        name: 'brand',
        images: Object.fromEntries(Object.keys(THEME_IMAGE_SPEC).map(file => [file, `${base}/${file}`])) as Record<AngpaoRainImageFile, string>,
    };
    ```

    The CDN must send CORS headers, because the game draws the images on a WebGL canvas.

The game checks every theme when it starts:

- Missing files: `onError` is called with the list of file names, and the game doesn't start.
- Files that fail to load or aren't valid images: `onError` is called with their names, and the game runs with placeholders.
- Wrong pixel size: a console warning lists each file with its actual and expected size. The image still loads, but may look out of place.

### Image spec

| Screen | File | Size | Use |
|---|---|---|---|
| Loading | `loadingbar_bg.png` | 650 × 50 | Loading bar track |
|  | `loadingbar_fill.png` | 650 × 50 | Loading bar fill, revealed from the left as it loads |
| Title | `title-masthead.png` | 1082 × 595 | Logo |
|  | `title-glow.png` | 1080 × 857 | Glow behind the logo |
|  | `title-angpao.png` | 500 × 504 | Big envelope |
|  | `title-coin-01.png`<br>`title-coin-02.png`<br>`title-coin-03.png` | 200 × 155<br>150 × 263<br>200 × 178 | Decorations around the logo |
|  | `star-01.png` | 200 × 264 | Sparkle; also falls during play |
|  | `btn-start-en.png`<br>`btn-start-cn.png` | 600 × 158 | Start button |
|  | `btn-close.png` | 100 × 100 | Close button |
|  | `btn-mask.png` | 600 × 158 | Button shape; the shine is clipped to its white area |
|  | `button-highlight.png` | 200 × 277 | Shine that sweeps across the buttons |
| Countdown | `countdown-ready.png`<br>`countdown-03.png`<br>`countdown-02.png`<br>`countdown-01.png`<br>`countdown-go.png` | 640 × 493<br>380 × 554<br>301 × 445<br>280 × 613<br>630 × 526 | READY, 3, 2, 1, GO |
|  | `countdown-angpao-num.png`<br>`countdown-angpao-text.png`<br>`countdown-coin-num.png`<br>`countdown-coin-text.png`<br>`countdown-line-num.png`<br>`countdown-line-text.png`<br>`countdown-star-num.png`<br>`countdown-star-text.png` | 680 × 793<br>680 × 788<br>700 × 653<br>700 × 910<br>620 × 729<br>839 × 926<br>500 × 524<br>770 × 808 | Decorations that burst around the text: `-num` with the numbers, `-text` with READY / GO |
|  | `countdown-blue-ring.png` | 450 × 471 | Ring |
|  | `countdown-funnel.png` | 200 × 267 | Hourglass |
| Play | `angpao.png` | 150 × 195 | Falling envelope to catch |
|  | `plus_one.png` | 200 × 140 | +1 on each catch |
|  | `player.png` | 390 × 517 | Character with the back half of the sack. Envelopes are caught at the sack opening, so keep the sack where it is |
|  | `player-bag.png` | 390 × 517 | Front half of the sack, drawn over the caught envelopes |
|  | `player-bag-glow.png`<br>`player-glow.png` | 390 × 517<br>800 × 768 | Glow on the sack / behind the character on a catch |
|  | `icon-score.png` | 80 × 85 | Score icon |
|  | `timer-icon.png` | 75 × 85 | Timer icon |
|  | `timer-bar-bottom.png` | 570 × 50 | Timer track |
|  | `timer-bar-top.png` | 570 × 50 | Timer fill, cut from the right as time runs out |
|  | `text-time-up.png` | 649 × 618 | "Time's up" |
|  | `player-sweat.png` | 1170 × 593 | Time's up animation: **3 frames of 390 × 593**, left to right |
| Summary | `result-title.png` | 1010 × 643 | Title |
|  | `result-angpao-01-0.png` … `result-angpao-10.png` (13) | 300 × 297 | Prize `type` 0 – 12, see the table below |
| Result | `glare_v2.png` | 1000 × 1007 | Rays behind everything |
|  | `result-angpao-bg.png` | 540 × 343 | Decoration above the card |
|  | `player-run.png` | 800 × 490 | Celebration animation: **2 frames of 400 × 490**, left to right |
|  | `result-box-bg.png` | 600 × 800 | Card |
|  | `result-congratulations.png` | 720 × 224 | Banner |
|  | `result-text-received-en.png`<br>`result-text-received-cn.png` | 360 × 36<br>240 × 60 | "You've received" |
|  | `btn-receive-en.png`<br>`btn-receive-cn.png` | 600 × 158 | Receive button |

All sizes are in pixels; use PNG with transparency. Text is part of the artwork, so `-en` / `-cn` files exist in both languages. The other images are shared by both, including the logo. The sizes also live in code as `THEME_IMAGE_SPEC` ([`src/themes/spec.ts`](./src/themes/spec.ts)).

### Prize artwork

The `type` in `DrawResult.counts` picks the image. The face value is printed on the image itself. The game never adds the prizes up: `result` from your backend is the total shown.

| `type` | File | Face value |
|---|---|---|
| 0 | `result-angpao-01-0.png` | RM 0.50 |
| 1 | `result-angpao-01-1.png` | RM 1 |
| 2 | `result-angpao-01-2.png` | RM 2 |
| 3 | `result-angpao-01-3.png` | RM 3 |
| 4 | `result-angpao-02.png` | RM 5 |
| 5 | `result-angpao-03.png` | RM 10 |
| 6 | `result-angpao-04.png` | RM 30 |
| 7 | `result-angpao-05.png` | RM 50 |
| 8 | `result-angpao-06.png` | RM 100 |
| 9 | `result-angpao-07.png` | RM 300 |
| 10 | `result-angpao-08.png` | RM 500 |
| 11 | `result-angpao-09.png` | RM 1k |
| 12 | `result-angpao-10.png` | RM 0 |

### Built-in theme sources

The two built-in themes are drawn in code (SVG rendered with [sharp](https://sharp.pixelplumbing.com/)) by [`scripts/themes`](./scripts/themes). Edit a script and run `yarn theme:generate` to redraw them. The scripts use macOS system fonts.


## Styling

The launcher reads these CSS variables:

```css
:root {
    --angpao-rain-button-size: 120px;           /* floating button size */
    --angpao-rain-button-offset: 16px;          /* distance from the bottom-right corner */
    --angpao-rain-z-index: 1000;                /* button and overlay */
    --angpao-rain-backdrop: rgba(0, 0, 0, .85); /* overlay background */
}
```

Class names are prefixed with `angpao-rain__`. The in-game text uses [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans), which the stylesheet loads from Google Fonts.


## Development

```bash
yarn install
yarn build              # type-check + build to dist/
yarn dev                # rebuild on change
yarn test               # unit tests
yarn lint:fix
yarn theme:check <dir>  # check a folder of theme images against the spec
yarn theme:generate     # redraw the built-in themes
```

The project uses Yarn 1 (`packageManager` is pinned to `yarn@1.22.22`).

### Example app

[`example/`](./example) is a Vite + React app that installs the package through `link:..`, the same way another project would after `npm install`. It includes both components, a mock `onDraw`, and switches for locale, theme, duration and a simulated API failure.

```bash
yarn build          # in the root, the example uses dist/
cd example
yarn install
yarn dev            # http://localhost:3000
```

Run `yarn dev` in the root at the same time to rebuild the package while you work on it.

### Project structure

```
src/
├── index.ts                 public exports
├── AngpaoRain.tsx           React wrapper: loads the theme + font, creates / destroys the Phaser game
├── AngpaoRainLauncher.tsx   floating button + overlay
├── angpao-rain.module.scss
├── types.ts                 public types
├── config.ts                game constants, locale + result helpers
├── themes/
│   ├── spec.ts              file name + size of every theme image
│   ├── default/             img/, launcher.png, index.ts
│   └── christmas/
└── game/
    ├── assets.ts            texture key → file, theme validation
    ├── context.ts           state shared by the scenes of one game
    ├── createGame.ts
    └── scenes/              Preload → Title → Game → Summary → Result
scripts/themes/              generators of the built-in themes, theme:check
```


## License

MIT, covering the code and the built-in themes.
