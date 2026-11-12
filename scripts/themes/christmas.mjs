// Christmas theme: Santa, gift boxes, ornaments, snowflakes. Output: src/themes/christmas
import {
    FONT, PILL, PRIZES, bigText, buttonHighlight, buttonMask, createRenderer, f, fancyText, glare, glow,
    receivedText, rng, scatter, size, sparkle, streak, svg, sweatDrops,
} from './lib.mjs';

const {render, launcher, finish} = createRenderer('christmas');
const {en: EN, num: NUM, zh: ZH} = FONT;
const SKIN = '#ffd9bd';
const INK = '#2b1a12';

/* ---------------- motifs ---------------- */

function gift(cx, cy, w, h, {box = 'url(#gRed)', ribbon = 'url(#gGold)', rot = 0, shadow = true} = {}) {
    const bodyY = -h / 2 + h * 0.3;
    const lidH = h * 0.2;
    const rb = w * 0.17;
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})"${shadow ? ' filter="url(#fShadow)"' : ''}>
<rect x="${f(-w / 2)}" y="${f(bodyY)}" width="${f(w)}" height="${f(h / 2 - bodyY)}" rx="${f(w * 0.06)}" fill="${box}"/>
<rect x="${f(-w / 2)}" y="${f(bodyY)}" width="${f(w * 0.22)}" height="${f(h / 2 - bodyY)}" rx="${f(w * 0.06)}" fill="#fff" fill-opacity=".14"/>
<rect x="${f(-rb / 2)}" y="${f(bodyY)}" width="${f(rb)}" height="${f(h / 2 - bodyY)}" fill="${ribbon}"/>
<rect x="${f(-w / 2)}" y="${f(bodyY + (h / 2 - bodyY) * 0.42)}" width="${f(w)}" height="${f(rb * 0.8)}" fill="${ribbon}"/>
<rect x="${f(-w * 0.56)}" y="${f(bodyY - lidH * 0.55)}" width="${f(w * 1.12)}" height="${f(lidH)}" rx="${f(w * 0.05)}" fill="${box}"/>
<rect x="${f(-w * 0.56)}" y="${f(bodyY - lidH * 0.55 + lidH * 0.62)}" width="${f(w * 1.12)}" height="${f(lidH * 0.38)}" rx="${f(w * 0.04)}" fill="#000" fill-opacity=".18"/>
<rect x="${f(-rb / 2)}" y="${f(bodyY - lidH * 0.55)}" width="${f(rb)}" height="${f(lidH)}" fill="${ribbon}"/>
<g transform="translate(0 ${f(bodyY - lidH * 0.55)})">
<ellipse cx="${f(-w * 0.2)}" cy="${f(-h * 0.08)}" rx="${f(w * 0.22)}" ry="${f(h * 0.1)}" transform="rotate(-25 ${f(-w * 0.2)} ${f(-h * 0.08)})" fill="${ribbon}" stroke="#b86a00" stroke-width="${f(w * 0.025)}"/>
<ellipse cx="${f(w * 0.2)}" cy="${f(-h * 0.08)}" rx="${f(w * 0.22)}" ry="${f(h * 0.1)}" transform="rotate(25 ${f(w * 0.2)} ${f(-h * 0.08)})" fill="${ribbon}" stroke="#b86a00" stroke-width="${f(w * 0.025)}"/>
<ellipse cx="${f(-w * 0.2)}" cy="${f(-h * 0.08)}" rx="${f(w * 0.1)}" ry="${f(h * 0.04)}" transform="rotate(-25 ${f(-w * 0.2)} ${f(-h * 0.08)})" fill="#9c5600" fill-opacity=".45"/>
<ellipse cx="${f(w * 0.2)}" cy="${f(-h * 0.08)}" rx="${f(w * 0.1)}" ry="${f(h * 0.04)}" transform="rotate(25 ${f(w * 0.2)} ${f(-h * 0.08)})" fill="#9c5600" fill-opacity=".45"/>
<circle cx="0" cy="${f(-h * 0.03)}" r="${f(w * 0.09)}" fill="${ribbon}" stroke="#b86a00" stroke-width="${f(w * 0.025)}"/>
</g></g>`;
}

const BAUBLE = {red: 'url(#gRed)', green: 'url(#gGreen)', gold: 'url(#gGold)', silver: 'url(#gSilver)', blue: 'url(#gBlue)'};

function bauble(cx, cy, r, color = 'red', {rot = 0, shadow = true} = {}) {
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})"${shadow ? ' filter="url(#fShadow)"' : ''}>
<circle cx="0" cy="${f(-r * 1.2)}" r="${f(r * 0.12)}" fill="none" stroke="url(#gGold)" stroke-width="${f(r * 0.06)}"/>
<rect x="${f(-r * 0.24)}" y="${f(-r * 1.12)}" width="${f(r * 0.48)}" height="${f(r * 0.26)}" rx="${f(r * 0.05)}" fill="url(#gGoldH)" stroke="#b86a00" stroke-width="${f(r * 0.03)}"/>
<circle r="${f(r)}" fill="${BAUBLE[color]}"/>
<path d="M ${f(-r * 0.97)} ${f(-r * 0.12)} Q ${f(-r * 0.5)} ${f(r * 0.08)} 0 ${f(-r * 0.12)} T ${f(r * 0.97)} ${f(-r * 0.12)}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="${f(r * 0.09)}" stroke-linecap="round"/>
<path d="M ${f(-r * 0.92)} ${f(r * 0.3)} Q ${f(-r * 0.5)} ${f(r * 0.5)} 0 ${f(r * 0.3)} T ${f(r * 0.92)} ${f(r * 0.3)}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="${f(r * 0.05)}" stroke-linecap="round"/>
<circle r="${f(r)}" fill="url(#gShine)"/>
</g>`;
}

function snowflake(cx, cy, r, {color = '#ffffff', sw = r * 0.09, rot = 0, glow: withGlow = true} = {}) {
    let arms = '';
    for (let i = 0; i < 6; i++) {
        arms += `<g transform="rotate(${i * 60})"><line x1="0" y1="0" x2="0" y2="${f(-r)}"/>
<polyline points="${f(-r * 0.22)},${f(-r * 0.72)} 0,${f(-r * 0.5)} ${f(r * 0.22)},${f(-r * 0.72)}" fill="none"/>
<polyline points="${f(-r * 0.15)},${f(-r * 0.95)} 0,${f(-r * 0.8)} ${f(r * 0.15)},${f(-r * 0.95)}" fill="none"/></g>`;
    }
    const g = `<g stroke="${color}" stroke-width="${f(sw)}" stroke-linecap="round" stroke-linejoin="round">${arms}</g><circle r="${f(r * 0.13)}" fill="${color}"/>`;
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})">${withGlow ? `<g filter="url(#fBlur8)" opacity=".8"><g stroke="#bfeaff" stroke-width="${f(sw * 2.5)}" stroke-linecap="round">${arms}</g></g>` : ''}${g}</g>`;
}

function holly(cx, cy, s, rot = 0) {
    const leaf = (a) => `<path transform="rotate(${a})" d="M 0 0 C ${f(s * 0.2)} ${f(-s * 0.25)} ${f(s * 0.75)} ${f(-s * 0.35)} ${f(s * 1.1)} ${f(-s * 0.15)} C ${f(s * 0.95)} ${f(-s * 0.02)} ${f(s * 1)} ${f(s * 0.12)} ${f(s * 0.85)} ${f(s * 0.2)} C ${f(s * 0.6)} ${f(s * 0.15)} ${f(s * 0.45)} ${f(s * 0.28)} ${f(s * 0.3)} ${f(s * 0.22)} C ${f(s * 0.2)} ${f(s * 0.15)} ${f(s * 0.05)} ${f(s * 0.1)} 0 0 Z" fill="url(#gGreen)" stroke="#063a1a" stroke-width="${f(s * 0.03)}"/>
<path transform="rotate(${a})" d="M ${f(s * 0.05)} 0 Q ${f(s * 0.5)} ${f(-s * 0.08)} ${f(s * 1)} ${f(-s * 0.08)}" stroke="#7be39d" stroke-width="${f(s * 0.03)}" fill="none"/>`;
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})" filter="url(#fShadow)">${leaf(-20)}${leaf(200)}
<circle cx="${f(-s * 0.08)}" cy="${f(-s * 0.1)}" r="${f(s * 0.15)}" fill="url(#gRed)"/><circle cx="${f(s * 0.14)}" cy="${f(-s * 0.04)}" r="${f(s * 0.15)}" fill="url(#gRed)"/><circle cx="0" cy="${f(s * 0.14)}" r="${f(s * 0.15)}" fill="url(#gRed)"/>
<circle cx="${f(-s * 0.12)}" cy="${f(-s * 0.15)}" r="${f(s * 0.04)}" fill="#fff" fill-opacity=".8"/></g>`;
}

function candyCane(cx, cy, s, rot = 0) {
    const d = `M 0 ${f(s * 1.2)} L 0 ${f(-s * 0.4)} A ${f(s * 0.35)} ${f(s * 0.35)} 0 0 1 ${f(s * 0.7)} ${f(-s * 0.4)} L ${f(s * 0.7)} ${f(-s * 0.2)}`;
    const w = s * 0.24;
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})" filter="url(#fShadow)">
<path d="${d}" fill="none" stroke="#9e1020" stroke-width="${f(w + s * 0.05)}" stroke-linecap="round"/>
<path d="${d}" fill="none" stroke="#ffffff" stroke-width="${f(w)}" stroke-linecap="round"/>
<path d="${d}" fill="none" stroke="#e0283a" stroke-width="${f(w)}" stroke-dasharray="${f(w * 0.6)} ${f(w * 0.6)}"/>
<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="${f(w * 0.25)}" stroke-linecap="round" transform="translate(${f(-w * 0.2)} 0)"/></g>`;
}

function bell(cx, cy, s, rot = 0) {
    return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot})" filter="url(#fShadow)">
<circle cx="0" cy="${f(s * 0.62)}" r="${f(s * 0.16)}" fill="url(#gGold)" stroke="#b86a00" stroke-width="${f(s * 0.03)}"/>
<path d="M ${f(-s * 0.15)} ${f(-s * 0.62)} C ${f(-s * 0.5)} ${f(-s * 0.55)} ${f(-s * 0.48)} ${f(s * 0.05)} ${f(-s * 0.62)} ${f(s * 0.42)} Q ${f(-s * 0.7)} ${f(s * 0.58)} ${f(-s * 0.5)} ${f(s * 0.58)} L ${f(s * 0.5)} ${f(s * 0.58)} Q ${f(s * 0.7)} ${f(s * 0.58)} ${f(s * 0.62)} ${f(s * 0.42)} C ${f(s * 0.48)} ${f(s * 0.05)} ${f(s * 0.5)} ${f(-s * 0.55)} ${f(s * 0.15)} ${f(-s * 0.62)} Z" fill="url(#gGold)" stroke="#b86a00" stroke-width="${f(s * 0.03)}"/>
<path d="M ${f(-s * 0.3)} ${f(-s * 0.35)} C ${f(-s * 0.36)} ${f(-s * 0.05)} ${f(-s * 0.36)} ${f(s * 0.2)} ${f(-s * 0.45)} ${f(s * 0.4)}" stroke="#fff" stroke-opacity=".7" stroke-width="${f(s * 0.07)}" fill="none" stroke-linecap="round"/>
<rect x="${f(-s * 0.62)}" y="${f(s * 0.38)}" width="${f(s * 1.24)}" height="${f(s * 0.1)}" rx="${f(s * 0.05)}" fill="#c76f00" fill-opacity=".5"/>
</g>${holly(cx, cy - s * 0.65, s * 0.42, rot)}`;
}

/** white wavy snow cap along the top of a rect, with drips */
function snowCap(x, y, w, h, seed = 1) {
    const r = rng(seed);
    let d = `M ${x} ${y + h * 0.5} Q ${x} ${y} ${f(x + h * 0.5)} ${y}`;
    d += ` L ${f(x + w - h * 0.5)} ${y} Q ${x + w} ${y} ${x + w} ${f(y + h * 0.5)}`;
    let px = x + w;
    const step = w / 9;
    for (let i = 0; i < 9; i++) {
        const nx = px - step;
        const drip = r() < 0.45 ? h * (0.9 + r() * 0.8) : h * (0.55 + r() * 0.2);
        d += ` Q ${f(px - step * 0.25)} ${f(y + drip)} ${f(px - step * 0.5)} ${f(y + drip * 0.92)} Q ${f(nx + step * 0.2)} ${f(y + drip * 0.85)} ${f(nx)} ${f(y + h * 0.5)}`;
        px = nx;
    }
    return `<path d="${d} Z" fill="#ffffff" stroke="#cfe3f0" stroke-width="3" filter="url(#fShadow)"/><path d="M ${f(x + h * 0.6)} ${f(y + h * 0.18)} L ${f(x + w - h * 0.6)} ${f(y + h * 0.18)}" stroke="#ffffff" stroke-width="${f(h * 0.12)}" stroke-linecap="round" opacity=".7"/>`;
}

/* ---------------- Santa (390 x 517 base frame) ---------------- */

const SACK_BODY = 'M 212 300 C 186 365 196 470 236 500 Q 290 522 346 500 C 384 468 390 362 362 300 Z';

function santa({eyes = 'open', mouth = 'smile', legs = 'stand', sack = 'side', sackFull = false, armL = 'hip', sweat = -1} = {}) {
    let s = '';
    if (sack === 'shoulder') {
        s += `<g filter="url(#fShadow)"><path d="M 30 120 C 0 160 10 270 70 300 C 120 320 170 300 175 250 C 182 190 150 120 100 100 C 75 92 48 100 30 120 Z" fill="url(#gSack)"/>
${gift(70, 85, 70, 80, {box: 'url(#gGreen)', rot: -18, shadow: false})}${gift(130, 80, 60, 70, {box: 'url(#gBlue)', rot: 14, shadow: false})}
<path d="M 40 120 Q 100 140 160 115" stroke="url(#gGold)" stroke-width="12" fill="none" stroke-linecap="round"/></g>`;
    }
    if (sack === 'side') {
        s += `<g filter="url(#fShadow)"><path d="${SACK_BODY}" fill="url(#gSack)"/>
<ellipse cx="287" cy="300" rx="77" ry="24" fill="#3a2410"/>
<ellipse cx="287" cy="300" rx="77" ry="24" fill="none" stroke="#c98a4b" stroke-width="7"/></g>`;
        if (sackFull) {
            s += gift(255, 282, 58, 62, {box: 'url(#gGreen)', rot: -16, shadow: false})
                + gift(318, 276, 52, 58, {box: 'url(#gBlue)', rot: 12, shadow: false})
                + gift(288, 268, 46, 52, {box: 'url(#gRed)', ribbon: '#fff', rot: 2, shadow: false});
        }
    }

    const leg = (x, dy, lift) => `<g transform="translate(0 ${dy})"><rect x="${x}" y="415" width="34" height="${55 - lift}" rx="12" fill="#b81d2e"/>
<path d="M ${x - 4} ${452 - lift} h 42 v 16 q 20 0 22 20 v 8 h -64 z" fill="#2a2222"/><rect x="${x - 4}" y="${452 - lift}" width="42" height="8" rx="3" fill="#4a3c3c"/><rect x="${x - 4}" y="${494 - lift}" width="64" height="7" rx="3" fill="#1a1414"/></g>`;
    if (legs === 'stand') s += leg(112, 0, 0) + leg(160, 0, 0);
    if (legs === 'runA') s += leg(108, -26, 0) + leg(166, 0, 18);
    if (legs === 'runB') s += leg(108, 0, 18) + leg(166, -26, 0);

    s += `<g filter="url(#fShadow)"><path d="M 84 262 Q 74 340 88 438 Q 150 458 214 438 Q 228 340 218 262 Q 150 232 84 262 Z" fill="url(#gRed)"/>
<rect x="84" y="424" width="132" height="28" rx="14" fill="#ffffff"/>
<rect x="141" y="262" width="20" height="170" rx="9" fill="#ffffff"/>
<rect x="80" y="362" width="142" height="28" rx="6" fill="#2a2222"/>
<rect x="134" y="358" width="34" height="36" rx="6" fill="none" stroke="url(#gGold)" stroke-width="7"/></g>`;

    if (armL === 'hip') {
        s += `<path d="M 96 278 C 62 300 52 345 72 378" stroke="#c42234" stroke-width="34" fill="none" stroke-linecap="round"/>
<rect x="52" y="362" width="42" height="14" rx="7" fill="#fff" transform="rotate(20 73 369)"/><circle cx="76" cy="390" r="19" fill="url(#gGreen)"/>`;
    } else if (armL === 'up') {
        s += `<path d="M 96 280 C 60 260 48 220 58 180" stroke="#c42234" stroke-width="34" fill="none" stroke-linecap="round"/>
<rect x="38" y="178" width="42" height="14" rx="7" fill="#fff"/><circle cx="58" cy="162" r="21" fill="url(#gGreen)"/><rect x="52" y="128" width="12" height="26" rx="6" fill="url(#gGreen)"/>`;
    }
    if (sack === 'side') {
        s += `<path d="M 206 282 C 226 290 236 296 238 306" stroke="#c42234" stroke-width="34" fill="none" stroke-linecap="round"/>
<circle cx="236" cy="306" r="19" fill="url(#gGreen)"/>`;
    } else {
        s += `<path d="M 206 280 C 238 300 248 340 236 380" stroke="#c42234" stroke-width="34" fill="none" stroke-linecap="round"/>
<circle cx="234" cy="392" r="19" fill="url(#gGreen)"/>`;
    }

    s += `<circle cx="92" cy="178" r="14" fill="#f2c2a2"/><circle cx="208" cy="178" r="14" fill="#f2c2a2"/>
<circle cx="150" cy="172" r="62" fill="${SKIN}"/>
<circle cx="113" cy="186" r="13" fill="#ff8c8c" fill-opacity=".45"/><circle cx="187" cy="186" r="13" fill="#ff8c8c" fill-opacity=".45"/>`;
    s += `<g fill="#ffffff" stroke="#dfe9f0" stroke-width="3"><ellipse cx="150" cy="232" rx="70" ry="52"/>
<circle cx="96" cy="222" r="26"/><circle cx="204" cy="222" r="26"/><circle cx="112" cy="262" r="26"/><circle cx="188" cy="262" r="26"/><circle cx="150" cy="276" r="28"/></g>
<ellipse cx="150" cy="232" rx="58" ry="40" fill="#ffffff"/>`;
    if (mouth === 'smile') s += `<path d="M 136 218 Q 150 234 164 218 Z" fill="#9c2030"/>`;
    else s += `<path d="M 136 226 Q 143 218 150 226 Q 157 234 164 226" fill="none" stroke="#9c2030" stroke-width="5" stroke-linecap="round"/>`;
    s += `<g fill="#ffffff" stroke="#dfe9f0" stroke-width="3"><path d="M 150 200 C 130 190 106 198 100 214 C 120 214 136 212 150 206 Z"/><path d="M 150 200 C 170 190 194 198 200 214 C 180 214 164 212 150 206 Z"/></g>
<circle cx="150" cy="190" r="12" fill="#f4a29a"/><circle cx="146" cy="186" r="4" fill="#fff" fill-opacity=".7"/>`;
    if (eyes === 'open') {
        s += `<ellipse cx="128" cy="160" rx="8" ry="10" fill="${INK}"/><ellipse cx="172" cy="160" rx="8" ry="10" fill="${INK}"/>
<circle cx="131" cy="156" r="3" fill="#fff"/><circle cx="175" cy="156" r="3" fill="#fff"/>`;
    } else {
        s += `<path d="M 118 164 Q 128 154 138 164" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="M 162 164 Q 172 154 182 164" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    }
    s += `<path d="M 114 142 Q 128 132 142 140" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M 158 140 Q 172 132 186 142" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    s += `<g filter="url(#fShadow)"><path d="M 92 122 C 100 58 160 26 212 44 C 246 56 264 84 270 112 L 252 120 C 242 98 226 84 208 82 C 210 98 212 112 214 122 Z" fill="url(#gRed)"/>
<rect x="80" y="110" width="142" height="34" rx="17" fill="#ffffff" stroke="#dfe9f0" stroke-width="3"/>
<circle cx="264" cy="122" r="20" fill="#ffffff" stroke="#dfe9f0" stroke-width="3"/></g>`;
    if (sweat >= 0) s += sweatDrops(sweat);
    return s;
}

/** front of the sack, drawn above caught gifts */
function sackFront() {
    return `<defs><clipPath id="below"><rect x="0" y="300" width="390" height="230"/></clipPath></defs>
<g clip-path="url(#below)"><path d="${SACK_BODY}" fill="url(#gSack)"/>
<ellipse cx="287" cy="300" rx="77" ry="24" fill="none" stroke="#c98a4b" stroke-width="7"/></g>
<path d="M 214 318 Q 287 342 360 318" stroke="url(#gGold)" stroke-width="12" fill="none" stroke-linecap="round"/>
<circle cx="214" cy="322" r="9" fill="url(#gGold)"/>
<g transform="rotate(-8 300 420)"><rect x="262" y="392" width="74" height="60" rx="8" fill="#6f4019" fill-opacity=".55"/>
<rect x="262" y="392" width="74" height="60" rx="8" fill="none" stroke="#ffe0a8" stroke-width="3" stroke-dasharray="7 6"/></g>
${snowflake(299, 422, 20, {glow: false, sw: 3.5})}`;
}

/* ---------------- images ---------------- */

const giftColors = ['url(#gRed)', 'url(#gGreen)', 'url(#gBlue)'];

// falling gift + title gift
await render('angpao.png', svg(300, 360, gift(150, 190, 220, 240)), {fit: true, pad: 2});
await render('title-angpao.png', svg(700, 700, gift(350, 380, 420, 440, {rot: -14})), {fit: true, pad: 90});
await render('icon-score.png', svg(300, 320, gift(150, 170, 220, 230, {shadow: false})), {fit: true, pad: 2});

// title decorations
await render('title-coin-01.png', svg(400, 400, bauble(200, 220, 140, 'red', {rot: 28})), {fit: true, pad: 4});
await render('title-coin-02.png', svg(300, 520, candyCane(110, 230, 190, 8)), {fit: true, pad: 4});
await render('title-coin-03.png', svg(420, 420, bell(210, 230, 150, -12)), {fit: true, pad: 4});
await render('star-01.png', svg(...size('star-01.png'), snowflake(100, 132, 78, {sw: 9})));
await render('title-glow.png', glow('title-glow.png', 'url(#gGlowIce)'));
await render('title-line.png', svg(400, 400, streak(200, 200, 360, -40, 7) + sparkle(200, 200, 30, {glow: false})));
await render('glare_v2.png', glare());

// masthead
{
    const r = rng(7);
    let deco = '';
    for (let i = 0; i < 10; i++) deco += snowflake(80 + r() * 1240, 60 + r() * 640, 14 + r() * 22, {sw: 3.5});
    for (let i = 0; i < 6; i++) deco += sparkle(80 + r() * 1240, 60 + r() * 640, 26 + r() * 20);
    const body = deco
        + holly(270, 132, 80, -10) + holly(1130, 132, 80, 190)
        + fancyText('MERRY CHRISTMAS', 700, 160, 78, {fill: '#ffffff', stroke: '#0b4a23', sw: 9})
        + fancyText('圣诞礼物雨', 700, 410, 215, {font: ZH, weight: '900', sw: 20, outer: '#fff7d6', outerW: 10})
        + fancyText('GIFT RAIN', 700, 600, 150, {sw: 15, fill: 'url(#gGold)', stroke: '#0b4a23', outer: '#ffffff', outerW: 7})
        + gift(95, 560, 130, 140, {rot: -16}) + bauble(1310, 580, 62, 'green', {rot: 14}) + candyCane(1300, 210, 70, 20);
    await render('title-masthead.png', svg(1400, 760, body), {fit: true, pad: 4});
}

// buttons
async function button(name, label, grad, font, sz) {
    const [w, h] = size(name);
    const body = `<path d="${PILL}" fill="#000" fill-opacity=".25" transform="translate(0 6)"/>
<path d="${PILL}" fill="${grad}"/>
<path d="M 92 24 H 508 A 50 50 0 0 1 540 36 Q 300 64 60 36 A 50 50 0 0 1 92 24 Z" fill="#fff" fill-opacity=".3"/>
<path d="${PILL}" fill="none" stroke="#ffffff" stroke-opacity=".85" stroke-width="5"/>
${snowCap(72, 8, 456, 26, name.length)}
${fancyText(label, 300, 104 + sz * 0.05, sz, {font, weight: font === ZH ? '900' : 'bold', fill: '#ffffff', stroke: grad === 'url(#gGreen)' ? '#063a1a' : '#6e0a14', sw: sz * 0.08, shadow: false})}`;
    await render(name, svg(w, h, body));
}
await button('btn-start-en.png', 'START', 'url(#gGreen)', EN, 70);
await button('btn-start-cn.png', '开始游戏', 'url(#gGreen)', ZH, 66);
await button('btn-receive-en.png', 'ACCEPT', 'url(#gRed)', EN, 70);
await button('btn-receive-cn.png', '开心收下', 'url(#gRed)', ZH, 66);
await render('btn-mask.png', buttonMask());
await render('button-highlight.png', buttonHighlight());
await render('btn-close.png', svg(100, 100, `<circle cx="50" cy="50" r="42" fill="#0b4a23" fill-opacity=".55" stroke="#ffffff" stroke-width="6"/>
<path d="M 34 34 L 66 66 M 66 34 L 34 66" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>`));

// countdown texts
await render('countdown-ready.png', bigText(['GET', 'READY'], 260), {fit: true, pad: 4});
await render('countdown-03.png', bigText(['3'], 520), {fit: true, pad: 4});
await render('countdown-02.png', bigText(['2'], 520), {fit: true, pad: 4});
await render('countdown-01.png', bigText(['1'], 520), {fit: true, pad: 4});
await render('countdown-go.png', bigText(['GO!'], 420), {fit: true, pad: 4});
await render('text-time-up.png', bigText(['TIME’S', 'UP'], 260), {fit: true, pad: 4});
await render('plus_one.png', bigText(['+1'], 300, {font: EN}), {fit: true, pad: 4});

// countdown decoration layers
const giftDraw = (x, y, r, i, m) => gift(x, y, m * (0.13 + r() * 0.06), m * (0.15 + r() * 0.06), {box: giftColors[i % 3], rot: -30 + r() * 60});
const ornDraw = (x, y, r, i, m) => (i % 3 === 2 ? bell(x, y, m * 0.07, -20 + r() * 40) : bauble(x, y, m * (0.05 + r() * 0.025), ['red', 'gold', 'green', 'silver'][i % 4], {rot: -25 + r() * 50}));
const lineDraw = (x, y, r, i, m) => streak(x, y, m * (0.25 + r() * 0.2), -40 + r() * 10, 5 + r() * 3);
const starDraw = (x, y, r, i, m) => (i % 2 ? sparkle(x, y, m * (0.04 + r() * 0.03)) : snowflake(x, y, m * (0.035 + r() * 0.025), {sw: m * 0.007}));
await render('countdown-angpao-num.png', scatter('countdown-angpao-num.png', 11, 5, giftDraw));
await render('countdown-angpao-text.png', scatter('countdown-angpao-text.png', 12, 6, giftDraw, {inner: 0.68, outer: 0.92}));
await render('countdown-coin-num.png', scatter('countdown-coin-num.png', 21, 6, ornDraw));
await render('countdown-coin-text.png', scatter('countdown-coin-text.png', 22, 7, ornDraw, {inner: 0.68, outer: 0.9}));
await render('countdown-line-num.png', scatter('countdown-line-num.png', 31, 5, lineDraw, {inner: 0.4, outer: 0.8}));
await render('countdown-line-text.png', scatter('countdown-line-text.png', 32, 6, lineDraw, {inner: 0.45, outer: 0.85}));
await render('countdown-star-num.png', scatter('countdown-star-num.png', 41, 9, starDraw, {inner: 0.5, outer: 0.92}));
await render('countdown-star-text.png', scatter('countdown-star-text.png', 42, 11, starDraw, {inner: 0.55, outer: 0.92}));

// wreath (the ring behind the countdown)
{
    const [w, h] = size('countdown-blue-ring.png');
    const cx = w / 2;
    const cy = 222;
    const r = rng(5);
    let leaves = '';
    for (let i = 0; i < 70; i++) {
        const a = (i / 70) * 360;
        const rad = 160 + (r() - 0.5) * 40;
        const x = cx + Math.cos((a * Math.PI) / 180) * rad;
        const y = cy + Math.sin((a * Math.PI) / 180) * rad;
        leaves += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="34" ry="13" transform="rotate(${f(a + 60 + r() * 60)} ${f(x)} ${f(y)})" fill="${r() < 0.5 ? '#1f8a45' : '#0f6a33'}" stroke="#063a1a" stroke-width="2"/>`;
    }
    let berries = '';
    for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2 + 0.2;
        const x = cx + Math.cos(a) * 160;
        const y = cy + Math.sin(a) * 160;
        berries += `<circle cx="${f(x)}" cy="${f(y)}" r="12" fill="url(#gRed)"/><circle cx="${f(x + 14)}" cy="${f(y + 8)}" r="10" fill="url(#gRed)"/>`;
    }
    let snow = '';
    for (let i = 0; i < 30; i++) {
        const a = Math.PI + r() * Math.PI;
        snow += `<circle cx="${f(cx + Math.cos(a) * (150 + r() * 40))}" cy="${f(cy + Math.sin(a) * (150 + r() * 40))}" r="${f(3 + r() * 5)}" fill="#fff" fill-opacity=".9"/>`;
    }
    const bow = `<g transform="translate(${cx} ${cy + 175})" filter="url(#fShadow)">
<path d="M 0 0 L -40 80 L -18 74 L -6 96 Z" fill="url(#gRed)"/><path d="M 0 0 L 40 80 L 18 74 L 6 96 Z" fill="url(#gRed)"/>
<ellipse cx="-44" cy="-6" rx="48" ry="26" transform="rotate(-18 -44 -6)" fill="url(#gRed)" stroke="#6e0a14" stroke-width="4"/>
<ellipse cx="44" cy="-6" rx="48" ry="26" transform="rotate(18 44 -6)" fill="url(#gRed)" stroke="#6e0a14" stroke-width="4"/>
<circle r="20" fill="url(#gRed)" stroke="#6e0a14" stroke-width="4"/></g>`;
    await render('countdown-blue-ring.png', svg(w, h, `<g filter="url(#fShadow)">${leaves}</g>${berries}${snow}${bow}`));
}

// hourglass
await render('countdown-funnel.png', svg(200, 267, `<g filter="url(#fShadow)">
<path d="M 46 40 C 46 100 92 118 92 133 C 92 148 46 166 46 226 L 154 226 C 154 166 108 148 108 133 C 108 118 154 100 154 40 Z" fill="#dff4ff" fill-opacity=".55" stroke="#ffffff" stroke-width="5"/>
<path d="M 56 214 C 70 180 92 170 100 168 C 108 170 130 180 144 214 Z" fill="#ffffff"/>
<path d="M 64 62 C 70 92 92 106 100 116 C 108 106 130 92 136 62 Z" fill="#ffffff"/>
<line x1="100" y1="118" x2="100" y2="168" stroke="#fff" stroke-width="4" stroke-dasharray="6 5"/>
<rect x="24" y="18" width="152" height="26" rx="10" fill="url(#gGold)" stroke="#b86a00" stroke-width="3"/>
<rect x="24" y="222" width="152" height="26" rx="10" fill="url(#gGold)" stroke="#b86a00" stroke-width="3"/>
<rect x="30" y="40" width="14" height="184" rx="6" fill="url(#pCandy)" stroke="#9e1020" stroke-width="2"/>
<rect x="156" y="40" width="14" height="184" rx="6" fill="url(#pCandy)" stroke="#9e1020" stroke-width="2"/>
</g>${holly(100, 24, 34, 0)}`));

// timer + loading bars
await render('timer-bar-bottom.png', svg(570, 50, `<rect x="3" y="3" width="564" height="44" rx="22" fill="#0b2a16" fill-opacity=".55" stroke="#ffffff" stroke-width="4"/>`));
await render('timer-bar-top.png', svg(570, 50, `<rect x="9" y="9" width="552" height="32" rx="16" fill="url(#pCandy)"/>
<rect x="9" y="9" width="552" height="32" rx="16" fill="none" stroke="#9e1020" stroke-width="2"/>
<rect x="20" y="13" width="530" height="8" rx="4" fill="#fff" fill-opacity=".55"/>`));
await render('timer-icon.png', svg(300, 340, `<g filter="url(#fShadow)">
<circle cx="80" cy="80" r="44" fill="url(#gGold)" stroke="#b86a00" stroke-width="6"/><circle cx="220" cy="80" r="44" fill="url(#gGold)" stroke="#b86a00" stroke-width="6"/>
<circle cx="150" cy="190" r="120" fill="url(#gRed)"/><circle cx="150" cy="190" r="92" fill="#fff8ea"/>
<path d="M 150 190 L 150 124 M 150 190 L 196 214" stroke="#2b1a12" stroke-width="14" stroke-linecap="round"/><circle cx="150" cy="190" r="12" fill="#d62839"/>
<path d="M 82 300 L 60 330 M 218 300 L 240 330" stroke="#8e1020" stroke-width="16" stroke-linecap="round"/></g>`), {fit: true, pad: 1});
await render('loadingbar_bg.png', svg(650, 50, `<rect x="3" y="3" width="644" height="44" rx="22" fill="#0b4a23" stroke="#ffffff" stroke-width="4"/>`));
await render('loadingbar_fill.png', svg(650, 50, `<rect x="9" y="9" width="632" height="32" rx="16" fill="url(#pGoldStripe)"/>
<rect x="20" y="13" width="610" height="8" rx="4" fill="#fff" fill-opacity=".6"/>`));

// player (Santa)
await render('player.png', svg(390, 517, santa()));
await render('player-bag.png', svg(390, 517, sackFront()));
await render('player-bag-glow.png', svg(390, 517, `<g filter="url(#fBlur8)"><path d="${SACK_BODY}" fill="#ffe680" fill-opacity=".55" stroke="#fff3b0" stroke-width="22"/></g>`));
await render('player-glow.png', glow('player-glow.png'));
{
    // 2 running frames, 400 x 490 each: sack over the shoulder, thumb up
    const frame = (legs) => `<g transform="translate(14 0) scale(0.94)">${santa({legs, sack: 'shoulder', armL: 'up'})}</g>`;
    await render('player-run.png', svg(800, 490, `${frame('runA')}<g transform="translate(400 0)">${frame('runB')}</g>`));
}
{
    // 3 sweating frames, 390 x 593 each: full sack, tired eyes
    let body = '';
    for (let i = 0; i < 3; i++) {
        body += `<g transform="translate(${i * 390} 38)">${santa({eyes: 'tired', mouth: 'tired', sackFull: true, sweat: i})}${sackFront()}</g>`;
    }
    await render('player-sweat.png', svg(1170, 593, body));
}

// result screen
await render('result-box-bg.png', svg(600, 800, `<g filter="url(#fShadow)">
<rect x="14" y="40" width="572" height="740" rx="42" fill="url(#gGold)"/>
<rect x="30" y="56" width="540" height="708" rx="32" fill="#fff8ea"/>
<rect x="44" y="70" width="512" height="680" rx="24" fill="none" stroke="#d62839" stroke-width="4" stroke-dasharray="14 10"/></g>
${snowflake(110, 690, 26, {color: '#f0dcc0', glow: false, sw: 4})}${snowflake(490, 690, 26, {color: '#f0dcc0', glow: false, sw: 4})}
${snowflake(300, 712, 18, {color: '#f0dcc0', glow: false, sw: 3})}
${snowCap(14, 30, 572, 44, 3)}${holly(70, 74, 64, -30)}${holly(530, 74, 64, 210)}`));
{
    const r = rng(9);
    let body = `<ellipse cx="270" cy="200" rx="230" ry="150" fill="url(#gGlowGold)"/>`;
    for (let i = 0; i < 11; i++) {
        const a = Math.PI * (1.02 + (i / 10) * 0.96);
        const x = 270 + Math.cos(a) * 220;
        const y = 210 + Math.sin(a) * 150;
        if (i % 3 === 0) body += gift(x, y, 64, 70, {box: giftColors[i % 3], rot: -25 + r() * 50});
        else if (i % 3 === 1) body += bauble(x, y, 28, ['red', 'gold', 'green', 'blue'][i % 4], {rot: -20 + r() * 40});
        else body += snowflake(x, y, 24, {sw: 4});
    }
    body += sparkle(120, 300, 22) + sparkle(430, 290, 26) + candyCane(60, 240, 46, -25) + candyCane(470, 230, 46, 20);
    await render('result-angpao-bg.png', svg(540, 343, body));
}
await render('result-congratulations.png', svg(900, 280, `<g filter="url(#fShadow)">
<path d="M 40 150 L 140 150 L 140 250 L 40 250 L 80 200 Z" fill="#8e1020"/><path d="M 860 150 L 760 150 L 760 250 L 860 250 L 820 200 Z" fill="#8e1020"/>
<path d="M 120 140 L 780 140 L 780 230 L 120 230 Z" fill="url(#gRed)"/>
<path d="M 120 230 L 150 252 L 150 230 Z M 780 230 L 750 252 L 750 230 Z" fill="#5a0812"/>
<path d="M 130 150 L 770 150" stroke="#ffd84a" stroke-width="5" stroke-dasharray="4 10" stroke-linecap="round"/></g>
${fancyText('恭喜您！', 450, 120, 120, {font: ZH, weight: '900', sw: 11, outer: '#fff7d6', outerW: 6})}
${fancyText('MERRY CHRISTMAS', 450, 207, 58, {fill: '#ffffff', stroke: '#6e0a14', sw: 6, shadow: false})}
${holly(140, 120, 60, -20)}${holly(760, 120, 60, 200)}`), {fit: true, pad: 2});
await render('result-text-received-en.png', receivedText('en'), {fit: true});
await render('result-text-received-cn.png', receivedText('cn'), {fit: true});
{
    const r = rng(17);
    let deco = '';
    for (let i = 0; i < 8; i++) deco += snowflake(80 + r() * 1140, 60 + r() * 640, 16 + r() * 20, {sw: 3.5});
    for (let i = 0; i < 5; i++) deco += sparkle(80 + r() * 1140, 60 + r() * 640, 24 + r() * 18);
    const body = deco
        + fancyText('礼物结算', 650, 330, 220, {font: ZH, weight: '900', sw: 20, outer: '#fff7d6', outerW: 10})
        + fancyText('RESULT', 650, 540, 170, {sw: 16, stroke: '#0b4a23', outer: '#ffffff', outerW: 8})
        + bauble(70, 520, 58, 'red', {rot: -16}) + bauble(1230, 520, 52, 'green', {rot: 14})
        + holly(250, 100, 70, -10) + holly(1050, 100, 70, 190);
    await render('result-title.png', svg(1300, 720, body), {fit: true, pad: 4});
}

// prize ornaments with a price tag
const PRIZE_COLORS = ['red', 'red', 'red', 'red', 'red', 'green', 'green', 'green', 'green', 'gold', 'gold', 'gold', 'silver'];
for (const [i, [name, value]] of PRIZES.entries()) {
    const sz = value.length >= 4 ? 52 : value.length === 3 ? 60 : 72;
    const tag = `<g transform="translate(150 180) rotate(-12)" filter="url(#fShadow)">
<path d="M -96 -40 H 92 Q 104 -40 104 -28 V 28 Q 104 40 92 40 H -96 L -122 0 Z" fill="#fff8ea" stroke="#c98a4b" stroke-width="4"/>
<circle cx="-100" cy="0" r="8" fill="none" stroke="#c98a4b" stroke-width="4"/>
<text x="-62" y="14" font-family="${EN}" font-weight="bold" font-size="30" text-anchor="middle" fill="#8e1020">RM</text>
<text x="26" y="${f(sz * 0.36)}" font-family="${NUM}" font-weight="bold" font-size="${sz}" text-anchor="middle" fill="#8e1020">${value}</text></g>`;
    await render(name, svg(300, 297, `${bauble(150, 162, 116, PRIZE_COLORS[i], {shadow: false})}${tag}`));
}

finish();

await launcher(svg(500, 520, `<circle cx="250" cy="250" r="230" fill="url(#gGlowGold)"/>`
    + gift(250, 250, 250, 260, {rot: -8})
    + snowflake(90, 110, 34, {sw: 6}) + sparkle(420, 120, 36) + snowflake(420, 400, 28, {sw: 5})
    + fancyText('GIFT RAIN', 250, 460, 92, {sw: 10, stroke: '#0b4a23', outer: '#ffffff', outerW: 6})));
