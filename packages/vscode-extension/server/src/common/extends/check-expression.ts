import { Diagnostic } from 'vscode-languageserver';

export const TypesPromotions: Record<string, Record<string, Record<string, string>>> = {
    // Arithmetic Operators
    "+": {
        "ANY_INT": {
            "ANY_INT": "ANY_INT",
            "ANY_REAL": "ANY_REAL",
        },
        "ANY_REAL": {
            "ANY_INT": "ANY_REAL",
            "ANY_REAL": "ANY_REAL",
        }
    },
    "-": {
        "ANY_INT": {
            "ANY_INT": "ANY_INT",
            "ANY_REAL": "ANY_REAL",
        },
        "ANY_REAL": {
            "ANY_INT": "ANY_REAL",
            "ANY_REAL": "ANY_REAL",
        }
    },
    "*": {
        "ANY_INT": {
            "ANY_INT": "ANY_INT",
            "ANY_REAL": "ANY_REAL",
        },
        "ANY_REAL": {
            "ANY_INT": "ANY_REAL",
            "ANY_REAL": "ANY_REAL",
        }
    },
    "/": {
        "ANY_INT": {
            "ANY_INT": "ANY_REAL",
            "ANY_REAL": "ANY_REAL",
        },
        "ANY_REAL": {
            "ANY_INT": "ANY_REAL",
            "ANY_REAL": "ANY_REAL",
        }
    },

    // Relational Operators
    "==": {
        "ANY_INT": {
            "ANY_INT": "BOOL",
            "ANY_REAL": "BOOL",
        },
        "ANY_REAL": {
            "ANY_INT": "BOOL",
            "ANY_REAL": "BOOL",
        },
        "ANY_BIT": {
            "ANY_BIT": "BOOL",
        }
    },
    "!=": {
        "ANY_INT": {
            "ANY_INT": "BOOL",
            "ANY_REAL": "BOOL",
        },
        "ANY_REAL": {
            "ANY_INT": "BOOL",
            "ANY_REAL": "BOOL",
        },
        "ANY_BIT": {
            "ANY_BIT": "BOOL",
        }
    },
    "<": {
        "ANY_INT": {
            "ANY_INT": "BOOL",
            "ANY_REAL": "BOOL",
        },
        "ANY_REAL": {
            "ANY_INT": "BOOL",
            "ANY_REAL": "BOOL",
        }
    },
    "<=": {
        "ANY_INT": {
            "ANY_INT": "BOOL",
            "ANY_REAL": "BOOL",
        },
        "ANY_REAL": {
            "ANY_INT": "BOOL",
            "ANY_REAL": "BOOL",
        }
    },
    ">": {
        "ANY_INT": {
            "ANY_INT": "BOOL",
            "ANY_REAL": "BOOL",
        },
        "ANY_REAL": {
            "ANY_INT": "BOOL",
            "ANY_REAL": "BOOL",
        }
    },
    ">=": {
        "ANY_INT": {
            "ANY_INT": "BOOL",
            "ANY_REAL": "BOOL",
        },
        "ANY_REAL": {
            "ANY_INT": "BOOL",
            "ANY_REAL": "BOOL",
        }
    },

    // Logical Operators
    "&&": {
        "ANY_BIT": {
            "ANY_BIT": "ANY_BIT",
        }
    },
    "||": {
        "ANY_BIT": {
            "ANY_BIT": "ANY_BIT",
        }
    },
    "!": {
        "ANY_BIT": {
            "ANY_BIT": "ANY_BIT",
        }
    },

    // Bitwise Operators
    "&": {
        "ANY_INT": {
            "ANY_INT": "ANY_INT",
        }
    },
    "|": {
        "ANY_INT": {
            "ANY_INT": "ANY_INT",
        }
    },
    "^": {
        "ANY_INT": {
            "ANY_INT": "ANY_INT",
        }
    }
}

export const AnyValueToGeneric = (value: string) => {
    if (!(isNaN(Number(value)))) {
        if (Number.isInteger(Number(value))) return "ANY_INT"
        return "ANY_REAL"
    }
    if (/^true$/i.test(value) || /^false$/i.test(value)) return "ANY_BIT"
    if (/^"(.*)"$/i.test(value)) return "ANY_STRING"
    if (value.startsWith(("D"))) return "ANY_DATE"
    return null
}

export const AnyTypeToGeneric: Record<string, string> = {
    "REAL": "ANY_REAL",
    "LREAL": "ANY_REAL",
    "LINT": "ANY_INT",
    "DINT": "ANY_INT",
    "INT": "ANY_INT",
    "SINT": "ANY_INT",
    "ULINT": "ANY_INT",
    "UDINT": "ANY_INT",
    "UINT": "ANY_INT",
    "USINT": "ANY_INT",
    "LWORD": "ANY_BIT",
    "DWORD": "ANY_BIT",
    "WORD": "ANY_BIT",
    "BYTE": "ANY_BIT",
    "BOOL": "ANY_BIT",
    "STRING": "ANY_STRING",
    "WSTRING": "ANY_STRING"
}