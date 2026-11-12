/* eslint-disable quotes -- kept as valid JSON, see below */
/**
 * Every image a theme must provide: file name → size in pixels.
 * Sprite sheets also list their frames (laid out left to right).
 * Images of a different size still load, but the game places and scales them for these sizes.
 *
 * Keep this object valid JSON (quoted keys, no trailing commas): scripts/themes reads it too.
 */
export const THEME_IMAGE_SPEC = {
    "angpao.png": {
        "width": 150,
        "height": 195
    },
    "btn-close.png": {
        "width": 100,
        "height": 100
    },
    "btn-mask.png": {
        "width": 600,
        "height": 158
    },
    "btn-receive-cn.png": {
        "width": 600,
        "height": 158
    },
    "btn-receive-en.png": {
        "width": 600,
        "height": 158
    },
    "btn-start-cn.png": {
        "width": 600,
        "height": 158
    },
    "btn-start-en.png": {
        "width": 600,
        "height": 158
    },
    "button-highlight.png": {
        "width": 200,
        "height": 277
    },
    "countdown-01.png": {
        "width": 280,
        "height": 613
    },
    "countdown-02.png": {
        "width": 301,
        "height": 445
    },
    "countdown-03.png": {
        "width": 380,
        "height": 554
    },
    "countdown-angpao-num.png": {
        "width": 680,
        "height": 793
    },
    "countdown-angpao-text.png": {
        "width": 680,
        "height": 788
    },
    "countdown-blue-ring.png": {
        "width": 450,
        "height": 471
    },
    "countdown-coin-num.png": {
        "width": 700,
        "height": 653
    },
    "countdown-coin-text.png": {
        "width": 700,
        "height": 910
    },
    "countdown-funnel.png": {
        "width": 200,
        "height": 267
    },
    "countdown-go.png": {
        "width": 630,
        "height": 526
    },
    "countdown-line-num.png": {
        "width": 620,
        "height": 729
    },
    "countdown-line-text.png": {
        "width": 839,
        "height": 926
    },
    "countdown-ready.png": {
        "width": 640,
        "height": 493
    },
    "countdown-star-num.png": {
        "width": 500,
        "height": 524
    },
    "countdown-star-text.png": {
        "width": 770,
        "height": 808
    },
    "glare_v2.png": {
        "width": 1000,
        "height": 1007
    },
    "icon-score.png": {
        "width": 80,
        "height": 85
    },
    "loadingbar_bg.png": {
        "width": 650,
        "height": 50
    },
    "loadingbar_fill.png": {
        "width": 650,
        "height": 50
    },
    "player-bag-glow.png": {
        "width": 390,
        "height": 517
    },
    "player-bag.png": {
        "width": 390,
        "height": 517
    },
    "player-glow.png": {
        "width": 800,
        "height": 768
    },
    "player-run.png": {
        "width": 800,
        "height": 490,
        "frameWidth": 400,
        "frameHeight": 490,
        "frames": 2
    },
    "player-sweat.png": {
        "width": 1170,
        "height": 593,
        "frameWidth": 390,
        "frameHeight": 593,
        "frames": 3
    },
    "player.png": {
        "width": 390,
        "height": 517
    },
    "plus_one.png": {
        "width": 200,
        "height": 140
    },
    "result-angpao-01-0.png": {
        "width": 300,
        "height": 297
    },
    "result-angpao-01-1.png": {
        "width": 300,
        "height": 297
    },
    "result-angpao-01-2.png": {
        "width": 300,
        "height": 297
    },
    "result-angpao-01-3.png": {
        "width": 300,
        "height": 297
    },
    "result-angpao-02.png": {
        "width": 300,
        "height": 297
    },
    "result-angpao-03.png": {
        "width": 300,
        "height": 297
    },
    "result-angpao-04.png": {
        "width": 300,
        "height": 297
    },
    "result-angpao-05.png": {
        "width": 300,
        "height": 297
    },
    "result-angpao-06.png": {
        "width": 300,
        "height": 297
    },
    "result-angpao-07.png": {
        "width": 300,
        "height": 297
    },
    "result-angpao-08.png": {
        "width": 300,
        "height": 297
    },
    "result-angpao-09.png": {
        "width": 300,
        "height": 297
    },
    "result-angpao-10.png": {
        "width": 300,
        "height": 297
    },
    "result-angpao-bg.png": {
        "width": 540,
        "height": 343
    },
    "result-box-bg.png": {
        "width": 600,
        "height": 800
    },
    "result-congratulations.png": {
        "width": 720,
        "height": 224
    },
    "result-text-received-cn.png": {
        "width": 240,
        "height": 60
    },
    "result-text-received-en.png": {
        "width": 360,
        "height": 36
    },
    "result-title.png": {
        "width": 1010,
        "height": 643
    },
    "star-01.png": {
        "width": 200,
        "height": 264
    },
    "text-time-up.png": {
        "width": 649,
        "height": 618
    },
    "timer-bar-bottom.png": {
        "width": 570,
        "height": 50
    },
    "timer-bar-top.png": {
        "width": 570,
        "height": 50
    },
    "timer-icon.png": {
        "width": 75,
        "height": 85
    },
    "title-angpao.png": {
        "width": 500,
        "height": 504
    },
    "title-coin-01.png": {
        "width": 200,
        "height": 155
    },
    "title-coin-02.png": {
        "width": 150,
        "height": 263
    },
    "title-coin-03.png": {
        "width": 200,
        "height": 178
    },
    "title-glow.png": {
        "width": 1080,
        "height": 857
    },
    "title-line.png": {
        "width": 400,
        "height": 400
    },
    "title-masthead.png": {
        "width": 1082,
        "height": 595
    }
} as const;
