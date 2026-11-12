# react-angpao-rain

[English](./README.md) | 繁體中文

React 紅包雨小遊戲，以 [Phaser 3](https://phaser.io/) 開發。

玩家左右拖動角色，在時間結束前盡量接住掉下來的紅包。獎項由你的後端決定，遊戲會在結算畫面和結果畫面上呈現。

- 可以直接用 `<AngpaoRain />` 元件，或是 `<AngpaoRainLauncher />`（浮動按鈕 + 全螢幕 overlay）
- 獎項由你自己的 `onDraw` callback 提供，可以接任何後端
- 主題：換一套圖片就能換掉整個遊戲的美術，內建兩套主題
- 內建英文和簡體中文兩套圖片文字
- 圖片都打包在套件裡，只會載入正在使用的主題（lazy load）
- 不依賴任何 UI 框架，樣式都由套件自己提供

支援 `react >=19 <20`、`phaser ^3.90`


## 安裝

```bash
yarn add react-angpao-rain phaser
# 或
npm install react-angpao-rain phaser
```

`react`、`react-dom`、`phaser` 都是 peer dependencies，需要由你的專案安裝。


## 使用方式

先在入口檔案引入一次樣式：

```tsx
import 'react-angpao-rain/dist/index.css';
```

### Launcher（浮動按鈕 + overlay）

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

畫面右下角會出現浮動按鈕，點下去會用全螢幕 overlay 開啟遊戲。玩家按下標題頁的關閉按鈕，或結果頁的領取按鈕後，overlay 會自動關閉。

### 直接嵌入頁面

`<AngpaoRain />` 會填滿父元素，並自動縮放遊戲畫面，所以父元素需要有尺寸：

```tsx
import {AngpaoRain} from 'react-angpao-rain';

<div style={{width: 360, height: 640, background: '#5a0a0a'}}>
    <AngpaoRain onDraw={draw} onClose={() => setShowGame(false)}/>
</div>
```

遊戲 canvas 是透明的，會透出父元素的背景。要重新開始一局，請重新掛載元件，例如更換它的 `key`。


## 遊戲流程

```
載入 → 標題 → 倒數 → 遊戲（duration 秒）→ 時間到 → 結算（5 秒）→ 結果
        │                                │                    │
     onClose                   onGameOver、onDraw          onClaim
```

時間一到就會呼叫 `onDraw`，同時播放「時間到」動畫，所以通常在進入結算畫面前，請求就已經完成了。


## API

### `<AngpaoRain />`

| Prop | 型別 | 預設值 | 說明 |
|---|---|---|---|
| `onDraw` | `(req: {score}) => Promise<DrawResult>` | **必填** | 一局結束時呼叫，resolve 要顯示的獎項。 |
| `onClaim` | `(result: DrawResult) => void` | | 玩家按下結果頁的領取按鈕。 |
| `onClose` | `() => void` | | 玩家按下標題頁的關閉按鈕。 |
| `onGameOver` | `(info: {score, time}) => void` | | 時間到，在 `onDraw` 之前觸發。 |
| `onError` | `(error: unknown) => void` | | `onDraw` reject，或主題的圖片不齊全、載入失敗。沒有傳入時，圖片錯誤會印在 console。 |
| `theme` | `AngpaoRainTheme` | `defaultTheme` | 遊戲的美術，見[主題](#主題)。 |
| `locale` | `'en-US' \| 'zh-CN'` | `'en-US'` | 遊戲內圖片文字的語言（英文或簡體中文）。 |
| `duration` | `number` | `10` | 每局秒數。 |
| `formatAmount` | `(value) => string` | ``v => `RM ${v}` `` | 結果頁總額的顯示格式。 |
| `width` / `height` | `number` | `450` / `800` | 遊戲的邏輯尺寸，canvas 會縮放到符合父元素。 |
| `className` / `style` | | | 套用在外層元素上。 |

修改 `theme`、`locale`、`duration`、`width`、`height` 會重新開始遊戲；callback 類的 props 可以隨時更換，不會影響遊戲。主題請定義在模組層級，不要直接寫在 JSX 裡：每次 render 都產生新的主題物件，遊戲就會每次 render 都重新開始。

### `<AngpaoRainLauncher />`

接受 `<AngpaoRain />` 除了 `className` / `style` 以外的所有 props，另外還有：

| Prop | 型別 | 預設值 | 說明 |
|---|---|---|---|
| `open` | `boolean` | | 受控的開啟狀態。不傳就由 launcher 自己管理。 |
| `onOpenChange` | `(open: boolean) => void` | | launcher 要開啟或關閉時呼叫。 |
| `defaultOpen` | `boolean` | `false` | 非受控模式下的初始狀態。 |
| `closeOnClaim` | `boolean` | `true` | 按下領取按鈕後是否關閉 overlay。 |
| `hideButton` | `boolean` | `false` | 隱藏浮動按鈕，例如只想透過 `open` 控制開啟時。 |
| `buttonImage` | `string` | 主題的 `launcherImage` | 浮動按鈕的圖片。 |
| `buttonLabel` | `string` | `'Play angpao rain'` | 按鈕和 dialog 的無障礙標籤（aria-label）。 |
| `buttonClassName` | `string` | | 加在按鈕上的額外 class。 |

overlay 開啟期間會鎖定頁面捲動。

### `DrawResult`

```ts
interface DrawResult {
    /** 結算畫面的獎項明細，最多顯示 13 筆 */
    counts: {type: number, amount: number | string}[]
    /** 結果畫面的總額，會經過 formatAmount 格式化 */
    result: number | string
}
```

`type` 是獎項圖片的編號，範圍 `0` 到 `12`（見[獎項圖片](#獎項圖片)），超出範圍的資料會被略過。如果 `onDraw` reject 或回傳格式錯誤，會呼叫 `onError`，並顯示空的結果（`0`），玩家仍然可以走完流程並關閉遊戲。

### `AngpaoRainLocale`

`locale` prop 的型別，值為 `'en-US' | 'zh-CN'`，只支援這兩個值。傳入其他值（例如從沒有型別檢查的 JavaScript 傳進來）時，會使用 `'en-US'`。如果你的專案使用其他語系，請自行轉換：

```tsx
<AngpaoRain locale={i18n.language.startsWith('zh') ? 'zh-CN' : 'en-US'} onDraw={draw}/>
```


## 主題

主題就是一整套遊戲圖片。換主題不需要改任何遊戲程式，只要準備一套檔名和尺寸都相同的新圖片，就是一套新的遊戲外觀。

### 內建主題

| 主題 | 風格 |
|---|---|
| `defaultTheme` | 紅包、金幣、元寶、燈籠和福娃。沒有傳 `theme` 時使用。 |
| `christmasTheme` | 聖誕老人、禮物盒、聖誕彩球和雪花。 |

```tsx
import {AngpaoRainLauncher, christmasTheme} from 'react-angpao-rain';

<AngpaoRainLauncher theme={christmasTheme} onDraw={draw}/>
```

每個主題的圖片都是獨立的 chunk（gzip 後約 1.1 MB），只有掛載使用該主題的遊戲時才會下載。沒用到的主題永遠不會被下載。

### `AngpaoRainTheme`

```ts
interface AngpaoRainTheme {
    /** 顯示在錯誤訊息裡 */
    name: string
    /** 所有圖片，以檔名為 key；也可以是載入圖片的函式 */
    images: Record<AngpaoRainImageFile, string> | (() => Promise<Record<AngpaoRainImageFile, string>>)
    /** launcher 的浮動按鈕圖片 */
    launcherImage?: string | (() => Promise<string>)
    colors?: {
        text?: string   // 載入文字、分數、計時、獎項數量。預設 '#ffffff'
        total?: string  // 結果頁的總額。預設 '#3BAEDD'
    }
}
```

`AngpaoRainImageFile` 是所有檔名組成的型別，檔名打錯 TypeScript 會直接報錯。圖片網址可以是瀏覽器能載入的任何網址：import 進來的檔案、`public/` 資料夾的路徑，或是 CDN。

### 製作新主題

1. 把下方的[圖片規格](#圖片規格)交給設計部門，並附上一套現有主題當參考（[`src/themes/default/img`](./src/themes/default/img)）。每張圖都要維持原本的檔名和像素尺寸。
2. 檢查設計部門交付的資料夾：

    ```bash
    yarn theme:check path/to/delivered/img
    ```

    會列出缺少的檔案、尺寸不符的檔案，以及遊戲沒用到的檔案。
3. 加入主題，三種方式擇一：

    **放進這個套件**（其他專案升級版本後就能使用）：把圖片放到 `src/themes/<name>/img/`，浮動按鈕圖放到 `src/themes/<name>/launcher.png`，從 [`src/themes/christmas`](./src/themes/christmas) 複製 `index.ts`、`images.ts`、`launcher.ts`，改掉匯出的名稱，再從 [`src/themes/index.ts`](./src/themes/index.ts) 匯出。

    **放在你自己的專案**（例如不能公開的品牌素材），以 Vite 為例：

    ```ts
    // themes/brand/index.ts
    import {type AngpaoRainTheme, toThemeImages} from 'react-angpao-rain';

    export const brandTheme: AngpaoRainTheme = {
        name: 'brand',
        // 獨立的 chunk，掛載遊戲時才會下載
        images: () => import('./images').then(module => module.default),
        launcherImage: '/brand/launcher.png',
        colors: {total: '#ffd84a'},
    };

    // themes/brand/images.ts
    export default toThemeImages(import.meta.glob<string>('./img/*.png', {eager: true, import: 'default'}));
    ```

    **放在 CDN**：

    ```ts
    import {type AngpaoRainImageFile, type AngpaoRainTheme, THEME_IMAGE_SPEC} from 'react-angpao-rain';

    const base = 'https://cdn.example.com/angpao-rain/brand';
    export const brandTheme: AngpaoRainTheme = {
        name: 'brand',
        images: Object.fromEntries(Object.keys(THEME_IMAGE_SPEC).map(file => [file, `${base}/${file}`])) as Record<AngpaoRainImageFile, string>,
    };
    ```

    CDN 必須回傳 CORS header，因為遊戲是在 WebGL canvas 上繪製圖片。

遊戲啟動時會檢查主題：

- 缺少檔案：呼叫 `onError` 並列出缺少的檔名，遊戲不會啟動。
- 檔案載入失敗或不是有效的圖片：呼叫 `onError` 並列出檔名，遊戲會用預設的替代圖繼續執行。
- 像素尺寸不符：console 會顯示警告，列出每個檔案的實際尺寸和應有尺寸。圖片仍然會載入，但位置和大小可能會跑掉。

### 圖片規格

| 畫面 | 檔名 | 尺寸 | 用途 |
|---|---|---|---|
| 載入 | `loadingbar_bg.png` | 650 × 50 | 載入條底 |
|  | `loadingbar_fill.png` | 650 × 50 | 載入條，依進度從左邊露出 |
| 標題 | `title-masthead.png` | 1082 × 595 | 標題 logo |
|  | `title-glow.png` | 1080 × 857 | logo 後方的光暈 |
|  | `title-angpao.png` | 500 × 504 | 大紅包 |
|  | `title-coin-01.png`<br>`title-coin-02.png`<br>`title-coin-03.png` | 200 × 155<br>150 × 263<br>200 × 178 | logo 周圍的裝飾 |
|  | `title-line.png` | 400 × 400 | 光線 |
|  | `star-01.png` | 200 × 264 | 閃光；遊戲中也會掉落 |
|  | `btn-start-en.png`<br>`btn-start-cn.png` | 600 × 158 | 開始按鈕 |
|  | `btn-close.png` | 100 × 100 | 關閉按鈕 |
|  | `btn-mask.png` | 600 × 158 | 按鈕形狀，光澤只會出現在白色範圍內 |
|  | `button-highlight.png` | 200 × 277 | 掃過按鈕的光澤 |
| 倒數 | `countdown-ready.png`<br>`countdown-03.png`<br>`countdown-02.png`<br>`countdown-01.png`<br>`countdown-go.png` | 640 × 493<br>380 × 554<br>301 × 445<br>280 × 613<br>630 × 526 | READY、3、2、1、GO |
|  | `countdown-angpao-num.png`<br>`countdown-angpao-text.png`<br>`countdown-coin-num.png`<br>`countdown-coin-text.png`<br>`countdown-line-num.png`<br>`countdown-line-text.png`<br>`countdown-star-num.png`<br>`countdown-star-text.png` | 680 × 793<br>680 × 788<br>700 × 653<br>700 × 910<br>620 × 729<br>839 × 926<br>500 × 524<br>770 × 808 | 在文字周圍散開的裝飾：`-num` 搭配數字，`-text` 搭配 READY / GO |
|  | `countdown-blue-ring.png` | 450 × 471 | 光環 |
|  | `countdown-funnel.png` | 200 × 267 | 沙漏 |
| 遊戲中 | `angpao.png` | 150 × 195 | 掉落的紅包 |
|  | `plus_one.png` | 200 × 140 | 接到時的 +1 |
|  | `player.png` | 390 × 517 | 角色和袋子的後半部。判定接到的位置在袋口，袋子的位置請不要移動 |
|  | `player-bag.png` | 390 × 517 | 袋子的前半部，會蓋在接到的紅包上面 |
|  | `player-bag-glow.png`<br>`player-glow.png` | 390 × 517<br>800 × 768 | 接到時袋子 / 角色的光暈 |
|  | `icon-score.png` | 80 × 85 | 分數圖示 |
|  | `timer-icon.png` | 75 × 85 | 計時圖示 |
|  | `timer-bar-bottom.png` | 570 × 50 | 計時條底 |
|  | `timer-bar-top.png` | 570 × 50 | 計時條，隨時間從右邊縮短 |
|  | `text-time-up.png` | 649 × 618 | 「時間到」 |
|  | `player-sweat.png` | 1170 × 593 | 時間到的動畫：**3 格，每格 390 × 593**，由左到右 |
| 結算 | `result-title.png` | 1010 × 643 | 標題 |
|  | `result-angpao-01-0.png` … `result-angpao-10.png` (13) | 300 × 297 | 獎項 `type` 0 – 12，見下表 |
| 結果 | `glare_v2.png` | 1000 × 1007 | 最後方的光芒 |
|  | `result-angpao-bg.png` | 540 × 343 | 卡片上方的裝飾 |
|  | `player-run.png` | 800 × 490 | 慶祝動畫：**2 格，每格 400 × 490**，由左到右 |
|  | `result-box-bg.png` | 600 × 800 | 卡片 |
|  | `result-congratulations.png` | 720 × 224 | 橫幅 |
|  | `result-text-received-en.png`<br>`result-text-received-cn.png` | 360 × 36<br>240 × 60 | 「您獲得了」 |
|  | `btn-receive-en.png`<br>`btn-receive-cn.png` | 600 × 158 | 領取按鈕 |

尺寸單位都是像素，請使用透明背景的 PNG。文字是畫在圖片裡的，所以 `-en` / `-cn` 的檔案兩種語言都要各畫一張；其餘圖片（包含 logo）兩種語言共用。這些尺寸在程式裡也有一份：`THEME_IMAGE_SPEC`（[`src/themes/spec.ts`](./src/themes/spec.ts)）。

### 獎項圖片

`DrawResult.counts` 裡的 `type` 決定顯示哪張圖，面額是直接畫在圖片上的。遊戲不會自己加總獎項，畫面上的總額就是後端回傳的 `result`。

| `type` | 檔名 | 面額 |
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

### 內建主題的原始檔

兩套內建主題都是用程式畫的（SVG，再用 [sharp](https://sharp.pixelplumbing.com/) 輸出成 PNG），程式在 [`scripts/themes`](./scripts/themes)。修改後執行 `yarn theme:generate` 就會重新產生。這些程式使用的是 macOS 的系統字型。


## 自訂樣式

Launcher 會讀取以下 CSS 變數：

```css
:root {
    --angpao-rain-button-size: 120px;           /* 浮動按鈕尺寸 */
    --angpao-rain-button-offset: 16px;          /* 距離右下角的間距 */
    --angpao-rain-z-index: 1000;                /* 按鈕和 overlay 的 z-index */
    --angpao-rain-backdrop: rgba(0, 0, 0, .85); /* overlay 背景色 */
}
```

所有 class 名稱都以 `angpao-rain__` 開頭。遊戲內的文字使用 [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) 字型，樣式檔會從 Google Fonts 載入。


## 開發

```bash
yarn install
yarn build              # 型別檢查 + 打包到 dist/
yarn dev                # 監聽檔案變更並重新打包
yarn test               # 單元測試
yarn lint:fix
yarn theme:check <dir>  # 依規格檢查一個主題圖片資料夾
yarn theme:generate     # 重新產生內建主題
```

本專案使用 Yarn 1（`packageManager` 固定為 `yarn@1.22.22`）。

### Example 範例專案

[`example/`](./example) 是一個 Vite + React 專案，透過 `link:..` 安裝本套件，模擬其他專案 `npm install` 之後的使用方式。裡面示範了兩個元件，用假的 `onDraw` 模擬 API，並可以切換語系、主題、遊戲秒數，以及模擬 API 失敗。

```bash
yarn build          # 在根目錄執行，example 使用的是 dist/
cd example
yarn install
yarn dev            # http://localhost:3000
```

開發時可以同時在根目錄執行 `yarn dev`，修改套件程式碼後會自動重新打包。

### 專案結構

```
src/
├── index.ts                 對外匯出
├── AngpaoRain.tsx           React 外層：載入主題和字型，建立 / 銷毀 Phaser 遊戲
├── AngpaoRainLauncher.tsx   浮動按鈕 + overlay
├── angpao-rain.module.scss
├── types.ts                 對外型別
├── config.ts                遊戲常數、語系和結果的工具函式
├── themes/
│   ├── spec.ts              每張主題圖片的檔名和尺寸
│   ├── default/             img/、launcher.png、index.ts
│   └── christmas/
└── game/
    ├── assets.ts            texture key 與檔案的對應、主題檢查
    ├── context.ts           同一個遊戲內各 scene 共用的狀態
    ├── createGame.ts
    └── scenes/              Preload → Title → Game → Summary → Result
scripts/themes/              內建主題的產生程式、theme:check
```


## 授權

MIT，涵蓋程式碼和內建主題。
