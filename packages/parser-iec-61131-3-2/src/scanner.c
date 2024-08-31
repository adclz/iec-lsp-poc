#include <tree_sitter/parser.h>

#include <wctype.h>

enum TokenType {
    FIELD_SELECTOR,
};

void *tree_sitter_IEC61131_external_scanner_create() { return NULL; }

void tree_sitter_IEC61131_external_scanner_destroy(void *p) {}

unsigned tree_sitter_IEC61131_external_scanner_serialize(void *payload, char *buffer) { return 0; }

void tree_sitter_IEC61131_external_scanner_deserialize(void *p, const char *b, unsigned n) {}

static inline void advance(TSLexer *lexer) { lexer->advance(lexer, false); }

static inline void skip(TSLexer *lexer) { lexer->advance(lexer, true); }

static bool is_identifier_char(int32_t c) {
    return iswalnum(c) || c == '_';
}

static bool scan_field_selector(TSLexer *lexer) {
    // Skip initial whitespace
    while (iswspace(lexer->lookahead)) {
        skip(lexer);
    }

    // Continue advancing until EOL or unknown character
    while (lexer->lookahead != '\n' && lexer->lookahead != '\r' && lexer->lookahead != 0 && is_identifier_char(lexer->lookahead)) {
        advance(lexer);
    }

    lexer->result_symbol = FIELD_SELECTOR;
    return true;
}

bool tree_sitter_IEC61131_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
    if (valid_symbols[FIELD_SELECTOR]) {
        return scan_field_selector(lexer);
    }

    return false;
}