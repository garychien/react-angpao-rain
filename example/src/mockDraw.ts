import type {DrawRequest, DrawResult} from 'react-angpao-rain';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Stand-in for a backend call such as `POST /api/angpao-draw`.
 * Splits the caught angpao into random prize types and sums a random prize per angpao.
 */
export const mockDraw = async ({score}: DrawRequest, options: {fail: boolean}): Promise<DrawResult> => {
    await wait(800);
    if (options.fail) throw new Error('Mock API error');

    const amounts = new Map<number, number>();
    let total = 0;
    for (let i = 0; i < score; i++) {
        const type = Math.floor(Math.random() * 13);
        amounts.set(type, (amounts.get(type) ?? 0) + 1);
        total += (type + 1) * 0.1;
    }

    return {
        counts: [...amounts].map(([type, amount]) => ({type, amount})),
        result: total.toFixed(2),
    };
};
