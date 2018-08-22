// TODO 无法打印调用栈
export default {
    prefix: '[CUM]',
    suffix: '',
    log(...args: any[]) {
        console.log(this.prefix, ...args);
    },
    error(...args: any[]) {
        console.error(this.prefix, ...args);
    },
    warn(...args: any[]) {
        console.warn(this.prefix, ...args);
    },
    info(...args: any[]) {
        console.info(this.prefix, ...args);
    }
}