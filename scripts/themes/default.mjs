// Default theme: red envelopes, gold coins, ingots, lanterns and a lucky kid mascot. Output: src/themes/default
import {
    FONT, PILL, PRIZES, bigText, buttonHighlight, buttonMask, createRenderer, f, fancyText, glare, glow,
    receivedText, rng, scatter, size, sparkle, streak, svg, sweatDrops,
} from './lib.mjs';

const {render, launcher, finish} = createRenderer('default');
const {en: EN, num: NUM, zh: ZH} = FONT;
const SKIN = '#ffd9bd';
const INK = '#2b1a12';
const DARK_RED = '#6e0a14';
const DARK_GOLD = '#b86a00';

/* ---------------- motifs ---------------- */

const ENVELOPE = {
    red: {body: 'url(#gDeepRed)', flap: 'url(#gRed)', trim: 'url(#gGold)', ink: 'url(#gGold)', stroke: DARK_RED},
    gold: {body: 'url(#gSilk)', flap: 'url(#gGold)', trim: '#fff8ea', ink: 'url(#gDeepRed)', stroke: '#fff8ea'},
    grey: {body: 'url(#gSilver)', flap: '#f4f7fa', trim: '#ffffff', ink: '#7d8fa0', stroke: '#ffffff'},
};

/** red envelope; `seal` is the text on the round seal, `value` is printed below it */
function envelope(cx, cy, w, h, {rot = 0, shadow = true, color = 'red', seal = '福', sealFont = ZH, value = ''} = {}) {
    const c = ENVELOPE[color];
    const r = w * 0.08;
    const top = -h / 2;
    const flapY = top + h * 0.2;
    const tipY = top + h * 0.46;
    const sealY = top + h * 0.38;
    const sealR = w * 0.18;
    let s = `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})"${shadow ? ' filter="url(#fShadow)"' : ''}>
<rect x="${f(-w / 2)}" y="${f(top)}" width="${f(w)}" height="${f(h)}" rx="${f(r)}" fill="${c.body}"/>
<rect x="${f(-w / 2 + w * 0.07)}" y="${f(top + h * 0.06)}" width="${f(w * 0.86)}" height="${f(h * 0.88)}" rx="${f(r * 0.6)}" fill="none" stroke="${c.trim}" stroke-opacity=".7" stroke-width="${f(w * 0.018)}"/>
<path d="M ${f(-w / 2)} ${f(top + r)} Q ${f(-w / 2)} ${f(top)} ${f(-w / 2 + r)} ${f(top)} L ${f(w / 2 - r)} ${f(top)} Q ${f(w / 2)} ${f(top)} ${f(w / 2)} ${f(top + r)} L ${f(w / 2)} ${f(flapY)} Q 0 ${f(tipY + h * 0.08)} ${f(-w / 2)} ${f(flapY)} Z" fill="${c.flap}"/>
<path d="M ${f(w / 2)} ${f(flapY)} Q 0 ${f(tipY + h * 0.08)} ${f(-w / 2)} ${f(flapY)}" fill="none" stroke="${c.trim}" stroke-width="${f(w * 0.03)}"/>
<rect x="${f(-w / 2)}" y="${f(top)}" width="${f(w * 0.2)}" height="${f(h)}" rx="${f(r)}" fill="#fff" fill-opacity=".12"/>`;
    if (seal) {
        s += `<circle cy="${f(sealY)}" r="${f(sealR)}" fill="url(#gGold)" stroke="${DARK_GOLD}" stroke-width="${f(w * 0.02)}"/>
<circle cy="${f(sealY)}" r="${f(sealR * 0.8)}" fill="none" stroke="${DARK_GOLD}" stroke-opacity=".6" stroke-width="${f(w * 0.012)}"/>
<text y="${f(sealY + sealR * (sealFont === ZH ? 0.36 : 0.3))}" font-family="${sealFont}" font-weight="900" font-size="${f(sealR * (sealFont === ZH ? 1.05 : 0.85))}" text-anchor="middle" fill="${DARK_RED}">${seal}</text>`;
    }
    if (value) {
        const sz = w * (value.length >= 4 ? 0.3 : value.length === 3 ? 0.36 : 0.46);
        s += fancyText(value, 0, f(top + h * 0.82), f(sz), {font: NUM, fill: c.ink, stroke: c.stroke, sw: sz * 0.06, shadow: false});
    } else {
        // two small coins as a pattern on the lower half
        s += coin(-w * 0.2, top + h * 0.78, w * 0.08, {shadow: false}) + coin(w * 0.2, top + h * 0.78, w * 0.08, {shadow: false});
    }
    return s + '</g>';
}

function coin(cx, cy, r, {rot = 0, shadow = true} = {}) {
    const hole = r * 0.42;
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})"${shadow ? ' filter="url(#fShadow)"' : ''}>
<circle r="${f(r)}" fill="url(#gGold)" stroke="${DARK_GOLD}" stroke-width="${f(r * 0.07)}"/>
<circle r="${f(r * 0.76)}" fill="none" stroke="${DARK_GOLD}" stroke-opacity=".55" stroke-width="${f(r * 0.05)}"/>
<rect x="${f(-hole / 2)}" y="${f(-hole / 2)}" width="${f(hole)}" height="${f(hole)}" fill="#8a4a00" stroke="${DARK_GOLD}" stroke-width="${f(r * 0.05)}"/>
${[0, 90, 180, 270].map(a => `<rect x="${f(-r * 0.07)}" y="${f(-r * 0.62)}" width="${f(r * 0.14)}" height="${f(r * 0.12)}" rx="${f(r * 0.03)}" fill="${DARK_GOLD}" fill-opacity=".55" transform="rotate(${a})"/>`).join('')}
<circle r="${f(r)}" fill="url(#gShine)"/></g>`;
}

function ingot(cx, cy, s, {rot = 0, shadow = true} = {}) {
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})"${shadow ? ' filter="url(#fShadow)"' : ''}>
<ellipse cy="${f(-s * 0.12)}" rx="${f(s)}" ry="${f(s * 0.24)}" fill="#c47d00"/>
<ellipse cy="${f(-s * 0.2)}" rx="${f(s * 0.46)}" ry="${f(s * 0.42)}" fill="url(#gGold)" stroke="${DARK_GOLD}" stroke-width="${f(s * 0.04)}"/>
<ellipse cx="${f(-s * 0.14)}" cy="${f(-s * 0.36)}" rx="${f(s * 0.12)}" ry="${f(s * 0.08)}" fill="#fff" fill-opacity=".7"/>
<path d="M ${f(-s)} ${f(-s * 0.14)} Q ${f(-s * 0.92)} ${f(s * 0.55)} 0 ${f(s * 0.55)} Q ${f(s * 0.92)} ${f(s * 0.55)} ${f(s)} ${f(-s * 0.14)} Q ${f(s * 0.55)} ${f(s * 0.14)} 0 ${f(s * 0.14)} Q ${f(-s * 0.55)} ${f(s * 0.14)} ${f(-s)} ${f(-s * 0.14)} Z" fill="url(#gGold)" stroke="${DARK_GOLD}" stroke-width="${f(s * 0.04)}"/>
<path d="M ${f(-s * 0.7)} ${f(s * 0.12)} Q ${f(-s * 0.5)} ${f(s * 0.4)} ${f(-s * 0.1)} ${f(s * 0.44)}" stroke="#fff" stroke-opacity=".6" stroke-width="${f(s * 0.06)}" fill="none" stroke-linecap="round"/></g>`;
}

function lantern(cx, cy, s, {rot = 0, shadow = true} = {}) {
    let ribs = '';
    for (const k of [0.25, 0.55]) ribs += `<ellipse rx="${f(s * 0.62 * k)}" ry="${f(s * 0.52)}" fill="none" stroke="#8e1020" stroke-width="${f(s * 0.03)}"/>`;
    let tassel = '';
    for (let i = -2; i <= 2; i++) tassel += `<line x1="${f(i * s * 0.035)}" y1="${f(s * 0.72)}" x2="${f(i * s * 0.06)}" y2="${f(s * 1.08)}" stroke="#e0283a" stroke-width="${f(s * 0.035)}" stroke-linecap="round"/>`;
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})"${shadow ? ' filter="url(#fShadow)"' : ''}>
<line y1="${f(-s * 0.95)}" y2="${f(-s * 0.6)}" stroke="url(#gGold)" stroke-width="${f(s * 0.04)}"/>
${tassel}<rect x="${f(-s * 0.08)}" y="${f(s * 0.6)}" width="${f(s * 0.16)}" height="${f(s * 0.14)}" rx="${f(s * 0.03)}" fill="url(#gGold)"/>
<ellipse rx="${f(s * 0.62)}" ry="${f(s * 0.52)}" fill="url(#gRed)"/>${ribs}
<ellipse rx="${f(s * 0.62)}" ry="${f(s * 0.52)}" fill="url(#gShine)"/>
<rect x="${f(-s * 0.32)}" y="${f(-s * 0.64)}" width="${f(s * 0.64)}" height="${f(s * 0.16)}" rx="${f(s * 0.05)}" fill="url(#gGoldH)" stroke="${DARK_GOLD}" stroke-width="${f(s * 0.02)}"/>
<rect x="${f(-s * 0.32)}" y="${f(s * 0.48)}" width="${f(s * 0.64)}" height="${f(s * 0.16)}" rx="${f(s * 0.05)}" fill="url(#gGoldH)" stroke="${DARK_GOLD}" stroke-width="${f(s * 0.02)}"/>
<text y="${f(s * 0.16)}" font-family="${ZH}" font-weight="900" font-size="${f(s * 0.46)}" text-anchor="middle" fill="url(#gGold)" stroke="#8e1020" stroke-width="${f(s * 0.02)}">福</text></g>`;
}

function blossom(cx, cy, r, {color = '#ff8fb1', rot = 0, glow: withGlow = true} = {}) {
    let petals = '';
    for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        petals += `<circle cx="${f(Math.cos(a) * r * 0.55)}" cy="${f(Math.sin(a) * r * 0.55)}" r="${f(r * 0.45)}" fill="${color}" stroke="#e05583" stroke-width="${f(r * 0.04)}"/>`;
    }
    let stamens = '';
    for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        stamens += `<circle cx="${f(Math.cos(a) * r * 0.25)}" cy="${f(Math.sin(a) * r * 0.25)}" r="${f(r * 0.06)}" fill="#ffd84a"/>`;
    }
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})">${withGlow ? `<circle r="${f(r * 1.3)}" fill="url(#gGlowGold)" opacity=".7"/>` : ''}${petals}
<circle r="${f(r * 0.3)}" fill="#fff0f5"/>${stamens}</g>`;
}

/** Chinese knot with tassel, hanging from (cx, cy) */
function knot(cx, cy, s) {
    let tassel = '';
    for (let i = -3; i <= 3; i++) tassel += `<line x1="${f(i * s * 0.03)}" y1="${f(s * 1.1)}" x2="${f(i * s * 0.05)}" y2="${f(s * 1.7)}" stroke="#e0283a" stroke-width="${f(s * 0.05)}" stroke-linecap="round"/>`;
    return `<g transform="translate(${f(cx)} ${f(cy)})" filter="url(#fShadow)">
<rect x="${f(-s * 0.4)}" y="${f(s * 0.1)}" width="${f(s * 0.8)}" height="${f(s * 0.8)}" rx="${f(s * 0.12)}" transform="rotate(45 0 ${f(s * 0.5)})" fill="url(#gRed)" stroke="url(#gGold)" stroke-width="${f(s * 0.08)}"/>
<rect x="${f(-s * 0.22)}" y="${f(s * 0.28)}" width="${f(s * 0.44)}" height="${f(s * 0.44)}" transform="rotate(45 0 ${f(s * 0.5)})" fill="none" stroke="url(#gGold)" stroke-width="${f(s * 0.05)}"/>
${tassel}<rect x="${f(-s * 0.12)}" y="${f(s * 1.0)}" width="${f(s * 0.24)}" height="${f(s * 0.16)}" rx="${f(s * 0.04)}" fill="url(#gGold)"/></g>`;
}

/* ---------------- mascot (390 x 517 base frame, same layout as the catch area) ---------------- */

const SACK_BODY = 'M 212 300 C 186 365 196 470 236 500 Q 290 522 346 500 C 384 468 390 362 362 300 Z';

function mascot({eyes = 'open', mouth = 'smile', legs = 'stand', sack = 'side', sackFull = false, armL = 'hip', sweat = -1} = {}) {
    let s = '';
    if (sack === 'shoulder') {
        s += `<g filter="url(#fShadow)"><path d="M 30 120 C 0 160 10 270 70 300 C 120 320 170 300 175 250 C 182 190 150 120 100 100 C 75 92 48 100 30 120 Z" fill="url(#gSilk)"/>
${envelope(70, 92, 56, 76, {rot: -18, shadow: false})}${envelope(128, 86, 50, 68, {rot: 14, shadow: false})}
<path d="M 40 120 Q 100 140 160 115" stroke="#d62839" stroke-width="12" fill="none" stroke-linecap="round"/></g>`;
    }
    if (sack === 'side') {
        s += `<g filter="url(#fShadow)"><path d="${SACK_BODY}" fill="url(#gSilk)"/>
<ellipse cx="287" cy="300" rx="77" ry="24" fill="#5a3208"/>
<ellipse cx="287" cy="300" rx="77" ry="24" fill="none" stroke="#ffe680" stroke-width="7"/></g>`;
        if (sackFull) {
            s += envelope(255, 282, 52, 70, {rot: -16, shadow: false})
                + coin(318, 282, 26, {shadow: false})
                + envelope(290, 270, 46, 62, {rot: 6, shadow: false});
        }
    }

    // trousers + cloth shoes
    const leg = (x, dy, lift) => `<g transform="translate(0 ${dy})"><rect x="${x}" y="415" width="34" height="${58 - lift}" rx="12" fill="#3a2a2a"/>
<path d="M ${x - 4} ${466 - lift} h 42 q 20 0 22 18 v 10 h -64 z" fill="#1f1818"/><rect x="${x - 4}" y="${492 - lift}" width="64" height="8" rx="4" fill="#ffffff"/></g>`;
    if (legs === 'stand') s += leg(112, 0, 0) + leg(160, 0, 0);
    if (legs === 'runA') s += leg(108, -26, 0) + leg(166, 0, 18);
    if (legs === 'runB') s += leg(108, 0, 18) + leg(166, -26, 0);

    // tang jacket
    const frog = (y) => `<path d="M 132 ${y} Q 150 ${y - 10} 168 ${y} Q 150 ${y + 10} 132 ${y} Z" fill="none" stroke="url(#gGold)" stroke-width="5"/><circle cx="150" cy="${y}" r="6" fill="url(#gGold)"/>`;
    s += `<g filter="url(#fShadow)"><path d="M 84 262 Q 74 340 88 438 Q 150 458 214 438 Q 228 340 218 262 Q 150 232 84 262 Z" fill="url(#gRed)"/>
<path d="M 86 420 Q 150 442 216 420 L 214 438 Q 150 458 88 438 Z" fill="url(#gGold)"/>
<line x1="150" y1="258" x2="150" y2="445" stroke="url(#gGold)" stroke-width="5"/>
${frog(300)}${frog(340)}${frog(380)}
<path d="M 112 252 Q 150 244 188 252 L 184 270 Q 150 262 116 270 Z" fill="url(#gGold)"/>
${coin(108, 330, 13, {shadow: false})}${coin(192, 330, 13, {shadow: false})}</g>`;

    // arms (red sleeves, gold cuffs)
    if (armL === 'hip') {
        s += `<path d="M 96 278 C 62 300 52 345 72 378" stroke="#c42234" stroke-width="34" fill="none" stroke-linecap="round"/>
<rect x="52" y="362" width="42" height="14" rx="7" fill="url(#gGold)" transform="rotate(20 73 369)"/><circle cx="76" cy="390" r="18" fill="${SKIN}"/>`;
    } else if (armL === 'up') {
        s += `<path d="M 96 280 C 60 260 48 220 58 180" stroke="#c42234" stroke-width="34" fill="none" stroke-linecap="round"/>
<rect x="38" y="178" width="42" height="14" rx="7" fill="url(#gGold)"/><circle cx="58" cy="162" r="20" fill="${SKIN}"/><rect x="52" y="128" width="12" height="26" rx="6" fill="${SKIN}"/>`;
    }
    if (sack === 'side') {
        s += `<path d="M 206 282 C 226 290 236 296 238 306" stroke="#c42234" stroke-width="34" fill="none" stroke-linecap="round"/>
<circle cx="236" cy="306" r="18" fill="${SKIN}"/>`;
    } else {
        s += `<path d="M 206 280 C 238 300 248 340 236 380" stroke="#c42234" stroke-width="34" fill="none" stroke-linecap="round"/>
<circle cx="234" cy="392" r="18" fill="${SKIN}"/>`;
    }

    // head
    s += `<rect x="134" y="222" width="32" height="34" fill="#f2c2a2"/>
<circle cx="90" cy="178" r="15" fill="#f2c2a2"/><circle cx="210" cy="178" r="15" fill="#f2c2a2"/>
<circle cx="150" cy="172" r="64" fill="${SKIN}"/>
<circle cx="112" cy="194" r="14" fill="#ff7b7b" fill-opacity=".5"/><circle cx="188" cy="194" r="14" fill="#ff7b7b" fill-opacity=".5"/>`;
    if (eyes === 'open') {
        s += `<ellipse cx="127" cy="170" rx="8" ry="10" fill="${INK}"/><ellipse cx="173" cy="170" rx="8" ry="10" fill="${INK}"/>
<circle cx="130" cy="166" r="3" fill="#fff"/><circle cx="176" cy="166" r="3" fill="#fff"/>`;
    } else {
        s += `<path d="M 117 174 Q 127 164 137 174" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M 163 174 Q 173 164 183 174" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    }
    s += `<path d="M 116 150 Q 127 144 138 150" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M 162 150 Q 173 144 184 150" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    if (mouth === 'smile') s += `<path d="M 132 200 Q 150 224 168 200 Z" fill="#9c2030"/><path d="M 140 212 Q 150 220 160 212 Q 150 208 140 212 Z" fill="#ff8c8c"/>`;
    else s += `<path d="M 136 208 Q 143 200 150 208 Q 157 216 164 208" fill="none" stroke="#9c2030" stroke-width="5" stroke-linecap="round"/>`;
    // round cap with a red knob
    s += `<g filter="url(#fShadow)"><path d="M 84 150 Q 84 92 150 90 Q 216 92 216 150 Q 150 134 84 150 Z" fill="#2a2222"/>
<path d="M 150 92 L 150 140 M 112 104 Q 120 124 118 144 M 188 104 Q 180 124 182 144" stroke="#4a3c3c" stroke-width="4" fill="none"/>
<path d="M 84 150 Q 150 134 216 150" stroke="url(#gGold)" stroke-width="7" fill="none" stroke-linecap="round"/>
<circle cx="150" cy="86" r="14" fill="url(#gRed)" stroke="#8e1020" stroke-width="3"/></g>`;
    if (sweat >= 0) s += sweatDrops(sweat);
    return s;
}

/** front of the sack, drawn above caught envelopes */
function sackFront() {
    return `<defs><clipPath id="below"><rect x="0" y="300" width="390" height="230"/></clipPath></defs>
<g clip-path="url(#below)"><path d="${SACK_BODY}" fill="url(#gSilk)"/>
<ellipse cx="287" cy="300" rx="77" ry="24" fill="none" stroke="#ffe680" stroke-width="7"/></g>
<path d="M 214 318 Q 287 342 360 318" stroke="#d62839" stroke-width="12" fill="none" stroke-linecap="round"/>
<circle cx="214" cy="322" r="9" fill="#d62839"/>
<rect x="268" y="386" width="64" height="64" rx="6" transform="rotate(45 300 418)" fill="url(#gRed)" stroke="#ffe680" stroke-width="4"/>
<text x="300" y="436" font-family="${ZH}" font-weight="900" font-size="48" text-anchor="middle" fill="url(#gGold)">福</text>`;
}

/* ---------------- images ---------------- */


// falling envelope + title envelope
await render('angpao.png', svg(300, 380, envelope(150, 190, 220, 300)), {fit: true, pad: 2});
await render('title-angpao.png', svg(700, 760, envelope(350, 380, 400, 540, {rot: -12})), {fit: true, pad: 70});
await render('icon-score.png', svg(300, 380, envelope(150, 190, 220, 300, {shadow: false})), {fit: true, pad: 2});

// title decorations
await render('title-coin-01.png', svg(400, 400, coin(200, 200, 150, {rot: 18})), {fit: true, pad: 4});
await render('title-coin-02.png', svg(300, 520, lantern(150, 250, 210, {rot: 6})), {fit: true, pad: 4});
await render('title-coin-03.png', svg(460, 400, ingot(230, 210, 190, {rot: -8})), {fit: true, pad: 4});
await render('star-01.png', svg(...size('star-01.png'), sparkle(100, 132, 86, {color: '#ffe680', ry: 120})));
await render('title-glow.png', glow('title-glow.png'));
await render('glare_v2.png', glare());

// masthead
{
    const r = rng(8);
    let deco = '';
    for (let i = 0; i < 7; i++) deco += sparkle(80 + r() * 1240, 60 + r() * 640, 26 + r() * 20);
    for (let i = 0; i < 5; i++) deco += blossom(80 + r() * 1240, 60 + r() * 640, 16 + r() * 10, {glow: false});
    const body = deco
        + lantern(150, 190, 120, {rot: -6}) + lantern(1250, 190, 120, {rot: 6})
        + fancyText('恭喜发财', 700, 165, 96, {font: ZH, weight: '900', fill: '#fff8ea', stroke: '#8e1020', sw: 10})
        + fancyText('红包雨', 700, 425, 240, {font: ZH, weight: '900', sw: 22, outer: '#fff7d6', outerW: 10})
        + fancyText('ANGPAO RAIN', 700, 610, 140, {sw: 14, outer: '#ffffff', outerW: 7})
        + envelope(100, 560, 120, 160, {rot: -16}) + coin(1300, 580, 62, {rot: 14}) + ingot(1300, 420, 70, {rot: 8});
    await render('title-masthead.png', svg(1400, 760, body), {fit: true, pad: 4});
}

// buttons
async function button(name, label, kind, font, sz) {
    const [w, h] = size(name);
    const gold = kind === 'gold';
    const body = `<path d="${PILL}" fill="#000" fill-opacity=".25" transform="translate(0 6)"/>
<path d="${PILL}" fill="${gold ? 'url(#gGold)' : 'url(#gRed)'}"/>
<path d="M 92 24 H 508 A 50 50 0 0 1 540 36 Q 300 64 60 36 A 50 50 0 0 1 92 24 Z" fill="#fff" fill-opacity=".35"/>
<path d="${PILL}" fill="none" stroke="${gold ? '#fff8ea' : 'url(#gGold)'}" stroke-width="6"/>
${coin(84, 79, 30, {shadow: false})}${coin(516, 79, 30, {shadow: false})}
${fancyText(label, 300, 104 + sz * 0.05, sz, {font, weight: font === ZH ? '900' : 'bold', fill: gold ? 'url(#gDeepRed)' : 'url(#gGold)', stroke: gold ? '#fff8ea' : DARK_RED, sw: sz * 0.07, shadow: false})}`;
    await render(name, svg(w, h, body));
}
await button('btn-start-en.png', 'START', 'gold', EN, 70);
await button('btn-start-cn.png', '开始游戏', 'gold', ZH, 66);
await button('btn-receive-en.png', 'ACCEPT', 'red', EN, 70);
await button('btn-receive-cn.png', '开心收下', 'red', ZH, 66);
await render('btn-mask.png', buttonMask());
await render('button-highlight.png', buttonHighlight());
await render('btn-close.png', svg(100, 100, `<circle cx="50" cy="50" r="42" fill="${DARK_RED}" fill-opacity=".6" stroke="#ffd84a" stroke-width="6"/>
<path d="M 34 34 L 66 66 M 66 34 L 34 66" stroke="#ffd84a" stroke-width="8" stroke-linecap="round"/>`));

// countdown texts
await render('countdown-ready.png', bigText(['GET', 'READY'], 260), {fit: true, pad: 4});
await render('countdown-03.png', bigText(['3'], 520), {fit: true, pad: 4});
await render('countdown-02.png', bigText(['2'], 520), {fit: true, pad: 4});
await render('countdown-01.png', bigText(['1'], 520), {fit: true, pad: 4});
await render('countdown-go.png', bigText(['GO!'], 420), {fit: true, pad: 4});
await render('text-time-up.png', bigText(['TIME’S', 'UP'], 260), {fit: true, pad: 4});
await render('plus_one.png', bigText(['+1'], 300, {font: EN}), {fit: true, pad: 4});

// countdown decoration layers
const envDraw = (x, y, r, i, m) => envelope(x, y, m * (0.12 + r() * 0.05), m * (0.16 + r() * 0.06), {rot: -30 + r() * 60, color: i % 4 === 3 ? 'gold' : 'red'});
const goldDraw = (x, y, r, i, m) => (i % 3 === 2 ? ingot(x, y, m * 0.075, {rot: -20 + r() * 40}) : coin(x, y, m * (0.05 + r() * 0.025), {rot: r() * 90}));
const lineDraw = (x, y, r, i, m) => streak(x, y, m * (0.25 + r() * 0.2), -40 + r() * 10, 5 + r() * 3);
const starDraw = (x, y, r, i, m) => (i % 2 ? sparkle(x, y, m * (0.04 + r() * 0.03)) : blossom(x, y, m * (0.03 + r() * 0.02), {glow: false}));
await render('countdown-angpao-num.png', scatter('countdown-angpao-num.png', 11, 5, envDraw));
await render('countdown-angpao-text.png', scatter('countdown-angpao-text.png', 12, 6, envDraw, {inner: 0.68, outer: 0.92}));
await render('countdown-coin-num.png', scatter('countdown-coin-num.png', 21, 6, goldDraw));
await render('countdown-coin-text.png', scatter('countdown-coin-text.png', 22, 7, goldDraw, {inner: 0.68, outer: 0.9}));
await render('countdown-line-num.png', scatter('countdown-line-num.png', 31, 5, lineDraw, {inner: 0.4, outer: 0.8}));
await render('countdown-line-text.png', scatter('countdown-line-text.png', 32, 6, lineDraw, {inner: 0.45, outer: 0.85}));
await render('countdown-star-num.png', scatter('countdown-star-num.png', 41, 9, starDraw, {inner: 0.5, outer: 0.92}));
await render('countdown-star-text.png', scatter('countdown-star-text.png', 42, 11, starDraw, {inner: 0.55, outer: 0.92}));

// gold ring behind the countdown, with coins and a knot
{
    const [w, h] = size('countdown-blue-ring.png');
    const cx = w / 2;
    const cy = 222;
    let coins = '';
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        if (i === 4) continue; // the knot hangs at the bottom
        coins += coin(cx + Math.cos(a) * 168, cy + Math.sin(a) * 168, 24, {shadow: false, rot: i * 20});
    }
    await render('countdown-blue-ring.png', svg(w, h, `<g filter="url(#fShadow)">
<circle cx="${cx}" cy="${cy}" r="${190}" fill="none" stroke="#ffe680" stroke-width="5" stroke-dasharray="2 14" stroke-linecap="round"/>
<circle cx="${cx}" cy="${cy}" r="168" fill="none" stroke="url(#gGold)" stroke-width="26"/>
<circle cx="${cx}" cy="${cy}" r="168" fill="none" stroke="${DARK_GOLD}" stroke-width="3" stroke-opacity=".6"/>
<circle cx="${cx}" cy="${cy}" r="146" fill="none" stroke="url(#gGold)" stroke-width="4"/></g>
${coins}${knot(cx, cy + 150, 44)}`));
}

// hourglass
await render('countdown-funnel.png', svg(200, 267, `<g filter="url(#fShadow)">
<path d="M 46 40 C 46 100 92 118 92 133 C 92 148 46 166 46 226 L 154 226 C 154 166 108 148 108 133 C 108 118 154 100 154 40 Z" fill="#fff4d6" fill-opacity=".5" stroke="#ffffff" stroke-width="5"/>
<path d="M 56 214 C 70 180 92 170 100 168 C 108 170 130 180 144 214 Z" fill="#ffd84a"/>
<path d="M 64 62 C 70 92 92 106 100 116 C 108 106 130 92 136 62 Z" fill="#ffd84a"/>
<line x1="100" y1="118" x2="100" y2="168" stroke="#ffd84a" stroke-width="4" stroke-dasharray="6 5"/>
<rect x="24" y="18" width="152" height="26" rx="10" fill="url(#gRed)" stroke="#ffd84a" stroke-width="3"/>
<rect x="24" y="222" width="152" height="26" rx="10" fill="url(#gRed)" stroke="#ffd84a" stroke-width="3"/>
<rect x="30" y="40" width="14" height="184" rx="6" fill="url(#gGoldH)" stroke="${DARK_GOLD}" stroke-width="2"/>
<rect x="156" y="40" width="14" height="184" rx="6" fill="url(#gGoldH)" stroke="${DARK_GOLD}" stroke-width="2"/></g>`));

// timer + loading bars
await render('timer-bar-bottom.png', svg(570, 50, `<rect x="3" y="3" width="564" height="44" rx="22" fill="#3d0808" fill-opacity=".6" stroke="#ffd84a" stroke-width="4"/>`));
await render('timer-bar-top.png', svg(570, 50, `<rect x="9" y="9" width="552" height="32" rx="16" fill="url(#gGold)"/>
<rect x="9" y="9" width="552" height="32" rx="16" fill="none" stroke="${DARK_GOLD}" stroke-width="2"/>
<rect x="20" y="13" width="530" height="8" rx="4" fill="#fff" fill-opacity=".6"/>`));
await render('timer-icon.png', svg(300, 340, `<g filter="url(#fShadow)">
<circle cx="80" cy="80" r="44" fill="url(#gGold)" stroke="${DARK_GOLD}" stroke-width="6"/><circle cx="220" cy="80" r="44" fill="url(#gGold)" stroke="${DARK_GOLD}" stroke-width="6"/>
<circle cx="150" cy="190" r="120" fill="url(#gRed)"/><circle cx="150" cy="190" r="92" fill="#fff8ea"/>
<path d="M 150 190 L 150 124 M 150 190 L 196 214" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><circle cx="150" cy="190" r="12" fill="#d62839"/>
<path d="M 82 300 L 60 330 M 218 300 L 240 330" stroke="#8e1020" stroke-width="16" stroke-linecap="round"/></g>`), {fit: true, pad: 1});
await render('loadingbar_bg.png', svg(650, 50, `<rect x="3" y="3" width="644" height="44" rx="22" fill="${DARK_RED}" stroke="#ffd84a" stroke-width="4"/>`));
await render('loadingbar_fill.png', svg(650, 50, `<rect x="9" y="9" width="632" height="32" rx="16" fill="url(#pGoldStripe)"/>
<rect x="20" y="13" width="610" height="8" rx="4" fill="#fff" fill-opacity=".6"/>`));

// player
await render('player.png', svg(390, 517, mascot()));
await render('player-bag.png', svg(390, 517, sackFront()));
await render('player-bag-glow.png', svg(390, 517, `<g filter="url(#fBlur8)"><path d="${SACK_BODY}" fill="#ffe680" fill-opacity=".55" stroke="#fff3b0" stroke-width="22"/></g>`));
await render('player-glow.png', glow('player-glow.png'));
{
    // 2 running frames, 400 x 490 each: sack over the shoulder, thumb up
    const frame = (legs) => `<g transform="translate(14 0) scale(0.94)">${mascot({legs, sack: 'shoulder', armL: 'up'})}</g>`;
    await render('player-run.png', svg(800, 490, `${frame('runA')}<g transform="translate(400 0)">${frame('runB')}</g>`));
}
{
    // 3 sweating frames, 390 x 593 each: full sack, tired eyes
    let body = '';
    for (let i = 0; i < 3; i++) {
        body += `<g transform="translate(${i * 390} 38)">${mascot({eyes: 'tired', mouth: 'tired', sackFull: true, sweat: i})}${sackFront()}</g>`;
    }
    await render('player-sweat.png', svg(1170, 593, body));
}

// result screen
await render('result-box-bg.png', svg(600, 800, `<g filter="url(#fShadow)">
<rect x="14" y="40" width="572" height="740" rx="42" fill="url(#gGold)"/>
<rect x="30" y="56" width="540" height="708" rx="32" fill="#fff8ea"/>
<rect x="44" y="70" width="512" height="680" rx="24" fill="none" stroke="#d62839" stroke-width="4" stroke-dasharray="14 10"/></g>
${blossom(110, 690, 22, {glow: false})}${blossom(490, 690, 22, {glow: false})}${coin(300, 712, 16, {shadow: false})}
${coin(46, 72, 30)}${coin(554, 72, 30)}`));
{
    const r = rng(9);
    let body = `<ellipse cx="270" cy="200" rx="230" ry="150" fill="url(#gGlowGold)"/>`;
    for (let i = 0; i < 11; i++) {
        const a = Math.PI * (1.02 + (i / 10) * 0.96);
        const x = 270 + Math.cos(a) * 220;
        const y = 210 + Math.sin(a) * 150;
        if (i % 3 === 0) body += envelope(x, y, 52, 70, {rot: -25 + r() * 50, color: i === 6 ? 'gold' : 'red'});
        else if (i % 3 === 1) body += coin(x, y, 26, {rot: r() * 90});
        else body += ingot(x, y, 34, {rot: -15 + r() * 30});
    }
    body += sparkle(120, 300, 22) + sparkle(430, 290, 26) + blossom(60, 250, 20, {glow: false}) + blossom(480, 240, 20, {glow: false});
    await render('result-angpao-bg.png', svg(540, 343, body));
}
await render('result-congratulations.png', svg(900, 280, `<g filter="url(#fShadow)">
<path d="M 40 150 L 140 150 L 140 250 L 40 250 L 80 200 Z" fill="#8e1020"/><path d="M 860 150 L 760 150 L 760 250 L 860 250 L 820 200 Z" fill="#8e1020"/>
<path d="M 120 140 L 780 140 L 780 230 L 120 230 Z" fill="url(#gRed)"/>
<path d="M 120 230 L 150 252 L 150 230 Z M 780 230 L 750 252 L 750 230 Z" fill="#5a0812"/>
<path d="M 130 150 L 770 150" stroke="#ffd84a" stroke-width="5" stroke-dasharray="4 10" stroke-linecap="round"/></g>
${fancyText('恭喜您！', 450, 120, 120, {font: ZH, weight: '900', sw: 11, outer: '#fff7d6', outerW: 6})}
${fancyText('CONGRATULATIONS', 450, 207, 54, {fill: 'url(#gGold)', stroke: DARK_RED, sw: 5, shadow: false})}
${coin(150, 110, 38)}${coin(750, 110, 38)}`), {fit: true, pad: 2});
await render('result-text-received-en.png', receivedText('en'), {fit: true});
await render('result-text-received-cn.png', receivedText('cn'), {fit: true});
{
    const r = rng(18);
    let deco = '';
    for (let i = 0; i < 6; i++) deco += sparkle(80 + r() * 1140, 60 + r() * 640, 24 + r() * 18);
    for (let i = 0; i < 4; i++) deco += blossom(80 + r() * 1140, 60 + r() * 640, 16 + r() * 10, {glow: false});
    const body = deco
        + fancyText('红包结算', 650, 330, 220, {font: ZH, weight: '900', sw: 20, outer: '#fff7d6', outerW: 10})
        + fancyText('RESULT', 650, 540, 170, {sw: 16, outer: '#ffffff', outerW: 8})
        + lantern(110, 300, 110, {rot: -8}) + lantern(1190, 300, 110, {rot: 8})
        + coin(240, 560, 50, {rot: -10}) + ingot(1060, 560, 60, {rot: 10});
    await render('result-title.png', svg(1300, 720, body), {fit: true, pad: 4});
}

// prize envelopes: red for small amounts, gold for big ones, silver for 0
const PRIZE_COLORS = ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'gold', 'gold', 'gold', 'grey'];
for (const [i, [name, value]] of PRIZES.entries()) {
    const color = PRIZE_COLORS[i];
    const halo = color === 'gold' ? `<circle cx="150" cy="150" r="146" fill="url(#gGlowGold)"/>` : '';
    await render(name, svg(300, 297, `${halo}${envelope(150, 150, 196, 262, {rot: -6, shadow: false, color, seal: 'RM', sealFont: EN, value})}`));
}

finish();

await launcher(svg(500, 540, `<circle cx="250" cy="250" r="230" fill="url(#gGlowGold)"/>`
    + envelope(250, 240, 220, 300, {rot: -8})
    + coin(95, 120, 40, {rot: 20}) + sparkle(420, 110, 36) + coin(415, 380, 34, {rot: -15})
    + fancyText('ANGPAO', 250, 480, 96, {sw: 10, outer: '#ffffff', outerW: 6})));
