type LogMethod = (...args: any[]) => void;

const isDev = process.env.NODE_ENV !== "production";


// Optional: mask sensitive fields
const sanitize = (arg: any) => {
    if (!arg || typeof arg !== "object") return arg;

    const clone = { ...arg };

    if ("token" in clone) clone.token = "***";
    if ("password" in clone) clone.password = "***";

    return clone;
};

const createLogger = () => {
    const log: LogMethod = (...args) => {
        if (!isDev) return;
        console.log(...args.map(sanitize));
    };

    const info: LogMethod = (...args) => {
        if (!isDev) return;
        console.info(
            "%cINFO:",
            "color: #3b82f6; font-weight: bold;",
            ...args.map(sanitize)
        );
    };

    const warn: LogMethod = (...args) => {
        if (!isDev) return;
        console.warn(
            "%cWARN:",
            "color: #f59e0b; font-weight: bold;",
            ...args.map(sanitize)
        );
    };

    const error: LogMethod = (...args) => {
        if (!isDev) return;
        console.error(
            "%cERROR:",
            "color: #ef4444; font-weight: bold;",
            ...args.map(sanitize)
        );
    };

    const debug: LogMethod = (...args) => {
        if (!isDev) return;
        console.debug(
            "%cDEBUG:",
            "color: #10b981; font-weight: bold;",
            ...args.map(sanitize)
        );
    };

    return { log, info, warn, error, debug };
};

const logger = createLogger();

export default logger;