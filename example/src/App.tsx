import {useCallback, useState} from 'react';
import {
    AngpaoRain,
    AngpaoRainLauncher,
    type AngpaoRainLocale,
    type AngpaoRainTheme,
    christmasTheme,
    defaultTheme,
    type DrawRequest,
} from 'react-angpao-rain';

import {mockDraw} from './mockDraw';

interface ILogEntry {
    id: number
    time: string
    message: string
}

let logId = 0;

const THEMES: Record<string, AngpaoRainTheme> = {
    default: defaultTheme,
    christmas: christmasTheme,
};

const App = () => {
    const [locale, setLocale] = useState<AngpaoRainLocale>('en-US');
    const [duration, setDuration] = useState(10);
    const [fail, setFail] = useState(false);
    const [themeName, setThemeName] = useState('default');
    const [round, setRound] = useState(0);
    const [logs, setLogs] = useState<ILogEntry[]>([]);

    const log = useCallback((message: string) => {
        setLogs(prev => [{id: ++logId, time: new Date().toLocaleTimeString(), message}, ...prev].slice(0, 30));
    }, []);

    const handleDraw = useCallback((request: DrawRequest) => {
        log(`onDraw → score ${request.score}`);
        return mockDraw(request, {fail});
    }, [fail, log]);

    const sharedProps = {
        locale,
        duration,
        theme: THEMES[themeName],
        onDraw: handleDraw,
        onGameOver: (info: {score: number, time: number}) => log(`onGameOver → score ${info.score}, ${info.time}s`),
        onClaim: (result: {result: number | string}) => log(`onClaim → total ${result.result}`),
        onClose: () => log('onClose'),
        onError: (error: unknown) => log(`onError → ${error instanceof Error ? error.message : String(error)}`),
    };

    return (
        <div className="page">
            <header className="header">
                <h1>react-angpao-rain</h1>
                <p>This app installs the package with <code>link:..</code>, the same way another project would after <code>npm install</code>.</p>
            </header>

            <section className="controls" aria-label="Options">
                <label>
                    Locale
                    <select value={locale} onChange={e => setLocale(e.target.value as AngpaoRainLocale)}>
                        <option value="en-US">en-US</option>
                        <option value="zh-CN">zh-CN (中文)</option>
                    </select>
                </label>
                <label>
                    Theme
                    <select value={themeName} onChange={e => setThemeName(e.target.value)}>
                        {Object.keys(THEMES).map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                </label>
                <label>
                    Duration
                    <select value={duration} onChange={e => setDuration(Number(e.target.value))}>
                        {[5, 10, 20, 30].map(value => <option key={value} value={value}>{value}s</option>)}
                    </select>
                </label>
                <label className="checkbox">
                    <input type="checkbox" checked={fail} onChange={e => setFail(e.target.checked)}/>
                    Simulate API failure
                </label>
            </section>

            <div className="layout">
                <section className="card">
                    <div className="card-head">
                        <h2>&lt;AngpaoRain /&gt;</h2>
                        <button type="button" onClick={() => setRound(value => value + 1)}>Restart</button>
                    </div>
                    <p className="hint">Inline: the game fills its parent element.</p>
                    <div className={`phone phone-${themeName}`}>
                        <AngpaoRain key={round} {...sharedProps}/>
                    </div>
                </section>

                <section className="card">
                    <h2>&lt;AngpaoRainLauncher /&gt;</h2>
                    <p className="hint">The floating button in the bottom-right corner opens the game in a full-screen overlay.</p>

                    <h3>Event log</h3>
                    <ol className="log">
                        {logs.length === 0 && <li className="empty">Play a round to see the callbacks.</li>}
                        {logs.map(entry => (
                            <li key={entry.id}><time>{entry.time}</time>{entry.message}</li>
                        ))}
                    </ol>
                </section>
            </div>

            <AngpaoRainLauncher {...sharedProps}/>
        </div>
    );
};

export default App;
