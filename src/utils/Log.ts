const prefix = '[JUI]';
const suffix = '';

export default {
    throw: (...args: any[]) => {
        throw new Error(`${prefix} ${args.join('\n')}`);
    },
    log: console.log.bind(console, prefix),
    error: console.error.bind(console, prefix),
    warn: console.warn.bind(console, prefix),
    info: console.info.bind(console, prefix),
    table: console.table.bind(console, prefix)
}