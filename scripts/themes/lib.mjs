// Shared helpers for the theme generators in this folder.
// Every image is drawn as an SVG and rendered with sharp at exactly the size listed in src/themes/spec.ts.
// The text uses macOS system fonts (Arial Rounded MT Bold, Arial Black, PingFang SC).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** file name → {width, height, frames?}, read from the `THEME_IMAGE_SPEC` object in src/themes/spec.ts */
export const SPEC = (() => {
    const source = fs.readFileSync(path.join(ROOT, 'src/themes/spec.ts'), 'utf8');
    const match = source.match(/THEME_IMAGE_SPEC = (\{[\s\S]*\}) as const;/);
    if (!match) throw new Error('THEME_IMAGE_SPEC not found in src/themes/spec.ts');
    return JSON.parse(match[1]);
})();
export const size = (name) => [SPEC[name].width, SPEC[name].height];

export const FONT = {en: 'Arial Rounded MT Bold', num: 'Arial Black', zh: 'PingFang SC'};

export const DEFS = `<defs>
<linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe0"/><stop offset=".45" stop-color="#ffd84a"/><stop offset="1" stop-color="#e8890c"/></linearGradient>
<linearGradient id="gGoldH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8890c"/><stop offset=".5" stop-color="#ffe680"/><stop offset="1" stop-color="#e8890c"/></linearGradient>
<linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff626a"/><stop offset=".5" stop-color="#d62839"/><stop offset="1" stop-color="#8e1020"/></linearGradient>
<linearGradient id="gDeepRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e5343f"/><stop offset=".55" stop-color="#b3121f"/><stop offset="1" stop-color="#6e0a14"/></linearGradient>
<linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4fd17c"/><stop offset=".5" stop-color="#1f8a45"/><stop offset="1" stop-color="#0b4f25"/></linearGradient>
<linearGradient id="gSilver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#dfe8ef"/><stop offset="1" stop-color="#93a8bb"/></linearGradient>
<linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9be7ff"/><stop offset=".5" stop-color="#3aa7e8"/><stop offset="1" stop-color="#1b5fa8"/></linearGradient>
<linearGradient id="gSack" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c98a4b"/><stop offset=".6" stop-color="#9c6130"/><stop offset="1" stop-color="#6f4019"/></linearGradient>
<linearGradient id="gSilk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset=".55" stop-color="#f2b134"/><stop offset="1" stop-color="#b8700a"/></linearGradient>
<radialGradient id="gShine" cx=".32" cy=".28" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".35" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<radialGradient id="gGlowGold"><stop offset="0" stop-color="#fff6c8" stop-opacity=".95"/><stop offset=".4" stop-color="#ffd84a" stop-opacity=".45"/><stop offset="1" stop-color="#ffb300" stop-opacity="0"/></radialGradient>
<radialGradient id="gGlowIce"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".35" stop-color="#bfeaff" stop-opacity=".55"/><stop offset="1" stop-color="#5fb8ff" stop-opacity="0"/></radialGradient>
<radialGradient id="gFade"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".55" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<pattern id="pCandy" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="40" height="40" fill="#ffffff"/><rect width="20" height="40" fill="#e0283a"/></pattern>
<pattern id="pGoldStripe" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="40" height="40" fill="#ffe36b"/><rect width="20" height="40" fill="#ffc21c"/></pattern>
<filter id="fShadow" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur in="SourceAlpha" stdDeviation="5"/><feOffset dy="7" result="o"/><feComponentTransfer in="o" result="s"><feFuncA type="linear" slope=".4"/></feComponentTransfer><feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="fBlur3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="fBlur8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="fBlur20" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
</defs>`;

export const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${DEFS}${body}</svg>`;
export const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
export const f = (n) => +n.toFixed(2);

/** deterministic random, so every run produces the same images */
export const rng = (seed) => () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

const transparent = {r: 0, g: 0, b: 0, alpha: 0};

/**
 * Renderer writing into `src/themes/<theme>/`.
 * render(name, svg, {fit, pad}): with `fit` the drawing is trimmed to its content and contained in the target size.
 */
export function createRenderer(theme) {
    const dir = path.join(ROOT, 'src/themes', theme);
    const imgDir = path.join(dir, 'img');
    fs.rmSync(imgDir, {recursive: true, force: true});
    fs.mkdirSync(imgDir, {recursive: true});
    const done = new Set();

    async function render(name, svgStr, {fit = false, pad = 0} = {}) {
        if (!SPEC[name]) throw new Error(`${name} is not in src/themes/spec.ts`);
        const [w, h] = size(name);
        let buf = await sharp(Buffer.from(svgStr)).png().toBuffer();
        if (fit) {
            buf = await sharp(buf).trim({threshold: 0}).toBuffer();
            buf = await sharp(buf)
                .resize(w - pad * 2, h - pad * 2, {fit: 'contain', background: transparent})
                .extend({top: pad, bottom: pad, left: pad, right: pad, background: transparent})
                .png().toBuffer();
        }
        const out = await sharp(buf).png({palette: true, quality: 92, effort: 10, compressionLevel: 9}).toBuffer();
        const m = await sharp(out).metadata();
        if (m.width !== w || m.height !== h) throw new Error(`${name}: ${m.width}x${m.height} != ${w}x${h}`);
        fs.writeFileSync(path.join(imgDir, name), out);
        done.add(name);
    }

    /** 250 x 250 image of the launcher's floating button */
    async function launcher(svgStr) {
        const buf = await sharp(Buffer.from(svgStr)).png().toBuffer();
        await sharp(buf).trim({threshold: 0}).resize(250, 250, {fit: 'contain', background: transparent})
            .png({palette: true, quality: 92}).toFile(path.join(dir, 'launcher.png'));
    }

    function finish() {
        const missing = Object.keys(SPEC).filter(n => !done.has(n));
        if (missing.length) throw new Error('missing: ' + missing.join(', '));
        console.log(`${theme}: ${done.size} images + launcher.png → ${path.relative(ROOT, dir)}`);
    }

    return {render, launcher, finish};
}

/* ---------------- drawing primitives shared by every theme ---------------- */

export function fancyText(t, x, y, sz, {
    font = FONT.en, weight = 'bold', fill = 'url(#gGold)', stroke = '#6e0a14', sw = sz * 0.09,
    outer = '#ffffff', outerW = 0, shadow = true, anchor = 'middle', transform = '',
} = {}) {
    const base = `x="${x}" y="${y}" font-family="${font}" font-weight="${weight}" font-size="${sz}" text-anchor="${anchor}"`;
    const tr = transform ? ` transform="${transform}"` : '';
    let s = `<g${tr}>`;
    if (shadow) s += `<text ${base} fill="#000" fill-opacity=".35" stroke="#000" stroke-opacity=".35" stroke-width="${f(sw * 2 + outerW * 2)}" stroke-linejoin="round" transform="translate(0 ${f(sz * 0.06)})">${esc(t)}</text>`;
    if (outerW) s += `<text ${base} fill="${outer}" stroke="${outer}" stroke-width="${f(sw * 2 + outerW * 2)}" stroke-linejoin="round">${esc(t)}</text>`;
    s += `<text ${base} fill="${stroke}" stroke="${stroke}" stroke-width="${f(sw * 2)}" stroke-linejoin="round">${esc(t)}</text>`;
    s += `<text ${base} fill="${fill}">${esc(t)}</text>`;
    return s + '</g>';
}

export function sparkle(cx, cy, r, {color = '#ffffff', ry = r, glow = true} = {}) {
    const k = 0.14;
    const d = `M 0 ${f(-ry)} Q ${f(r * k)} ${f(-ry * k)} ${f(r)} 0 Q ${f(r * k)} ${f(ry * k)} 0 ${f(ry)} Q ${f(-r * k)} ${f(ry * k)} ${f(-r)} 0 Q ${f(-r * k)} ${f(-ry * k)} 0 ${f(-ry)} Z`;
    return `<g transform="translate(${f(cx)} ${f(cy)})">${glow ? `<circle r="${f(r * 0.55)}" fill="url(#gGlowGold)"/>` : ''}<path d="${d}" fill="${color}"/></g>`;
}

export function streak(cx, cy, len, rot, width = 8) {
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})">
<ellipse rx="${f(len / 2)}" ry="${f(width * 2.5)}" fill="#ffe680" fill-opacity=".5" filter="url(#fBlur8)"/>
<ellipse rx="${f(len / 2)}" ry="${f(width / 2)}" fill="#fff"/></g>`;
}

/** decorations scattered in a ring around the center, leaving the middle clear for the countdown text */
export function scatter(name, seed, count, draw, {inner = 0.58, outer = 0.9} = {}) {
    const [w, h] = size(name);
    const r = rng(seed);
    let body = '';
    for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + r() * 0.6;
        const k = inner + r() * (outer - inner);
        body += draw(w / 2 + Math.cos(a) * (w / 2) * k, h / 2 + Math.sin(a) * (h / 2) * k, r, i, Math.min(w, h));
    }
    return svg(w, h, body);
}

/** big outlined countdown text ("3", "GO!", "TIME'S UP" …) */
export function bigText(lines, sz, {font = FONT.num, weight = 'bold', gap = 0.92, stroke = '#6e0a14', fill = 'url(#gGold)'} = {}) {
    const W = 1600;
    const H = Math.round(sz * gap * lines.length + sz * 0.6);
    return svg(W, H, lines.map((t, i) => fancyText(t, W / 2, f(sz * 0.95 + i * sz * gap), sz, {
        font, weight, fill, stroke, sw: sz * 0.1, outer: '#ffffff', outerW: sz * 0.05,
    })).join(''));
}

/** sun rays behind the title, sized to glare_v2.png */
export function glare(color = '#ffe680') {
    const [w, h] = size('glare_v2.png');
    let rays = '';
    for (let i = 0; i < 20; i++) {
        const a = (i / 20) * Math.PI * 2;
        const b = a + Math.PI / 30;
        const L = 520;
        rays += `<path d="M ${w / 2} ${h / 2} L ${f(w / 2 + Math.cos(a) * L)} ${f(h / 2 + Math.sin(a) * L)} L ${f(w / 2 + Math.cos(b) * L)} ${f(h / 2 + Math.sin(b) * L)} Z" fill="${color}"/>`;
    }
    return svg(w, h, `<mask id="mFade"><circle cx="${w / 2}" cy="${h / 2}" r="${w / 2}" fill="url(#gFade)"/></mask>
<g mask="url(#mFade)"><g filter="url(#fBlur8)" opacity=".75">${rays}</g><circle cx="${w / 2}" cy="${h / 2}" r="${w * 0.32}" fill="url(#gGlowGold)"/></g>`);
}

/** soft elliptical glow filling the whole image */
export function glow(name, fill = 'url(#gGlowGold)') {
    const [w, h] = size(name);
    return svg(w, h, `<ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2}" ry="${h / 2}" fill="${fill}"/>`);
}

/** the white shape the shine effect is masked with: same pill as the buttons */
export const PILL = 'M 79 12 H 521 A 67 67 0 0 1 521 146 H 79 A 67 67 0 0 1 79 12 Z';

export const buttonMask = () => svg(600, 158, `<path d="${PILL}" fill="#ffffff"/>`);

export const buttonHighlight = () => svg(200, 277, `<linearGradient id="hl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<g filter="url(#fBlur3)"><path d="M 90 10 H 160 L 110 267 H 40 Z" fill="url(#hl)"/></g>`);

export const receivedText = (lang, color = '#6b3b1f') => (lang === 'en'
    ? svg(900, 120, `<text x="450" y="85" font-family="${FONT.en}" font-weight="bold" font-size="80" text-anchor="middle" fill="${color}">You’ve received</text>`)
    : svg(600, 160, `<text x="300" y="115" font-family="${FONT.zh}" font-weight="600" font-size="110" text-anchor="middle" fill="${color}">您获得了</text>`));

/** face value printed on prize type 0 … 12, with its file name */
export const PRIZES = [
    ['result-angpao-01-0.png', '0.50'], ['result-angpao-01-1.png', '1'], ['result-angpao-01-2.png', '2'],
    ['result-angpao-01-3.png', '3'], ['result-angpao-02.png', '5'], ['result-angpao-03.png', '10'],
    ['result-angpao-04.png', '30'], ['result-angpao-05.png', '50'], ['result-angpao-06.png', '100'],
    ['result-angpao-07.png', '300'], ['result-angpao-08.png', '500'], ['result-angpao-09.png', '1k'],
    ['result-angpao-10.png', '0'],
];

/** sweat drops of the "time's up" frames, frame 0 … 2 */
export function sweatDrops(frame) {
    const drops = [[[70, 120], [236, 96], [222, 150]], [[62, 140], [246, 112], [232, 168]], [[56, 160], [252, 130], [238, 186]]][frame];
    return drops.map(([x, y]) => `<path d="M ${x} ${y - 18} C ${x + 10} ${y - 4} ${x + 12} ${y + 4} ${x} ${y + 10} C ${x - 12} ${y + 4} ${x - 10} ${y - 4} ${x} ${y - 18} Z" fill="#8fd8ff" stroke="#3a9ad9" stroke-width="2.5"/><circle cx="${x - 3}" cy="${y}" r="2.5" fill="#fff"/>`).join('');
}
