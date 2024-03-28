// convert snake dict to camel dict
export function snakeToCamel(obj: object | string): any {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(v => snakeToCamel(v));
    }
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k.replace(/(_\w)/g, m => m[1].toUpperCase()), snakeToCamel(v)])
    );
}
