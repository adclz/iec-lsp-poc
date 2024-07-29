[
    "PROGRAM"
    "TASK"
    "CONFIGURATION"
    "RESOURCE"
    "END_CONFIGURATION"
    "END_RESOURCE"
] @keyword.function

[
    "RETAIN"
    "NON_RETAIN"
    "CONSTANT"
] @keyword.modifier

[
    "ON"
    "WITH"
] @keyword.coroutine

[
    ":="
    ":"
] @keyword.operator

[
    (single_line_comment)
    (multi_line_comment)
] @comment

[
    "VAR_GLOBAL"
    "VAR_INPUT"
    "VAR_OUTPUT"
    "VAR_TEMP"
    "VAR_GLOBAL"
    "VAR_ACCESS"
    "VAR_EXTERNAL"
    "STRUCT"
    "END_VAR"
    "END_STRUCT"
] @type.definition

[
    "BYTE"
    "WORD"
    "DWORD"
    "LWORD"
    "SINT"
    "INT"
    "DINT"
    "LINT"
    "USINT"
    "UINT"
    "UDINT"
    "ULINT"
    "REAL"
    "LREAL"
    "TIME"
    "DATE"
    "TIME_OF_DAY"
    "TOD"
    "DATE_AND_TIME"
    "DT"
    "STRING"
    "WSTRING"
] @type.builtin

[
    "INTERVAL"
    "PRIORITY"
] @variable.parameter 

[
    ","
    ";"
] @punctuation.separator

[
    "("
    ")"
    "["
    "]"
] @punctuation.bracket

[ 
    (integer)
    (signed_integer)
    (hex_integer)
    (binary_integer) 
    (octal_integer)
] @number

(real_literal) @number.float

(identifier) @variable