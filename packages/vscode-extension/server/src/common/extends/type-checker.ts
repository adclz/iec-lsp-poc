import { Diagnostic, Range } from "vscode-languageserver";

export const AnyTypeToGeneric = {
    "BOOL": "BOOL",
    "BYTE": "ANY_BIT",
    "WORD": "ANY_BIT",
    "DWORD": "ANY_BIT",
    "LWORD": "ANY_BIT",
    "USINT": "ANY_INT",
    "UINT": "ANY_INT",
    "UDINT": "ANY_INT",
    "ULINT": "ANY_INT",
    "SINT": "ANY_INT",
    "INT": "ANY_INT",
    "DINT": "ANY_INT",
    "LINT": "ANY_INT",
    "REAL": "ANY_REAL",
    "LREAL": "ANY_REAL",
} as const


export const simpleTypeMap: Record<string, (symbol: string, range: Range) => Diagnostic[] | null> = {
    "BOOL": (symbol, range) => {
        if (symbol === "BOOL") return null
        if (["TRUE", "FALSE", "0", "1"].includes(symbol!)) { return null }
        return [{
            message: `Expected a boolean, but got ${symbol}`,
            range
        } as Diagnostic]
    },
    "BYTE": (symbol, range) => asNumber(symbol, range, 0, 255),
    "WORD": (symbol, range) => asNumber(symbol, range, 0, 65535),
    "DWORD": (symbol, range) => asNumber(symbol, range, 0, 4294967295),
    "LWORD": (symbol, range) => asNumber(symbol, range, 0, 18446744073709551615),
    "USINT": (symbol, range) => asNumber(symbol, range, 0, 255),
    "UINT": (symbol, range) => asNumber(symbol, range, 0, 65535),
    "UDINT": (symbol, range) => asNumber(symbol, range, 0, 4294967295),
    "ULINT": (symbol, range) => asNumber(symbol, range, 0, 18446744073709551615),
    "SINT": (symbol, range) => asNumber(symbol, range, -128, +127),
    "INT": (symbol, range) => asNumber(symbol, range, -32768, +32767),
    "DINT": (symbol, range) => asNumber(symbol, range, -2147483648, +2147483647),
    "LINT": (symbol, range) => asNumber(symbol, range, -9223372036854775808, +9223372036854775807),
    "REAL": (symbol, range) => {
        if (symbol === "ANY_REAL") return null
        const float = parseFloat(symbol!)
        if (isNaN(float)) {
            return [{
                message: `Expected a floating point number, but got ${symbol}`,
                range
            } as Diagnostic]
        }
        return null
    },
    "LREAL": (symbol, range) => {
        if (symbol === "ANY_REAL") return null
        const float = parseFloat(symbol)
        if (isNaN(float)) {
            return [{
                message: `Expected a floating point number, but got ${symbol!}`,
                range
            } as Diagnostic]
        }
        return null
    },
    // generics
    "ANY_INT": (symbol, range) => isNaN(parseInt(symbol!)) ? symbol === "ANY_INT" ? null : [{
        message: `Expected a number, but got ${symbol!}`,
        range
    } as Diagnostic] : null,
    "ANY_REAL": (symbol, range) => isNaN(parseFloat(symbol!)) ? symbol === "ANY_REAL" ? null : [{
        message: `Expected a number, but got ${symbol!}`,
        range
    } as Diagnostic] : null,
}

const asNumber = (symbol: string, range: Range, min: number, max: number) => {
    if (symbol === "ANY_INT") return null
    const int = parseInt(symbol)
    if (isNaN(int)) {
        return [{
            message: `Expected a number, but got ${symbol}`,
            range
        } as Diagnostic]
    }
    if (int < min || int > max) {
        return [{
            message: `Expected a number between ${min} and ${max}, but got ${int}`,
            range
        } as Diagnostic]
    }
    return null
}