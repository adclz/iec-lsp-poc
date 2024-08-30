import IntervalTree from '@flatten-js/interval-tree';
import { ScopeOrSymbol } from '../symbols/definitions';

export const search = (ranges: IntervalTree<ScopeOrSymbol>, range: [number, number], exactRange = false): ScopeOrSymbol | null => {
    // Perform the search and find the smallest interval
    const results = ranges.search([range[0], range[1]], (value, interval) => {
        return { node: value, start: interval.low, end: interval.high }
    });

    if (exactRange) {
        const nodes = results.filter((node) => {
            return node.start === range[0] && node.end === range[1];
        });
        if (nodes.length) { return nodes[0].node; }
        else return null
    }

    const nodes = results.sort((a, b) => {
        const aSize = a.end - a.start;
        const bSize = b.end - b.start;
        return aSize - bSize;
    })
    if (nodes.length) { return nodes[0].node; }
    else return null
};
