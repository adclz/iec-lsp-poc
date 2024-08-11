#include "tree_sitter/parser.h"

#if defined(__GNUC__) || defined(__clang__)
#pragma GCC diagnostic ignored "-Wmissing-field-initializers"
#endif

#define LANGUAGE_VERSION 14
#define STATE_COUNT 22
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 133
#define ALIAS_COUNT 0
#define TOKEN_COUNT 127
#define EXTERNAL_TOKEN_COUNT 0
#define FIELD_COUNT 0
#define MAX_ALIAS_SEQUENCE_LENGTH 4
#define PRODUCTION_ID_COUNT 1

enum ts_symbol_identifiers {
  aux_sym_letter_token1 = 1,
  sym_digit = 2,
  sym_bit = 3,
  sym_octal_digit = 4,
  sym_hex_digit = 5,
  anon_sym_SLASH_SLASH = 6,
  aux_sym_comment_token1 = 7,
  anon_sym_CR = 8,
  anon_sym_LF = 9,
  anon_sym_LPAREN_STAR = 10,
  aux_sym_comment_token2 = 11,
  aux_sym_comment_token3 = 12,
  anon_sym_STAR_RPAREN = 13,
  anon_sym_SLASH_STAR = 14,
  aux_sym_comment_token4 = 15,
  anon_sym_STAR_SLASH = 16,
  sym_WS = 17,
  anon_sym_LBRACE = 18,
  anon_sym_RBRACE = 19,
  anon_sym_POUND = 20,
  anon_sym__ = 21,
  anon_sym_PLUS = 22,
  anon_sym_DASH = 23,
  anon_sym_DOT = 24,
  anon_sym_E = 25,
  anon_sym_SQUOTE = 26,
  anon_sym_DQUOTE = 27,
  anon_sym_DOLLAR_SQUOTE = 28,
  anon_sym_DOLLAR = 29,
  anon_sym_DOLLAR_DQUOTE = 30,
  anon_sym_BANG = 31,
  anon_sym_PERCENT = 32,
  anon_sym_AMP = 33,
  anon_sym_LPAREN = 34,
  anon_sym_RPAREN = 35,
  anon_sym_STAR = 36,
  anon_sym_COMMA = 37,
  anon_sym_SLASH = 38,
  anon_sym_0 = 39,
  anon_sym_1 = 40,
  anon_sym_2 = 41,
  anon_sym_3 = 42,
  anon_sym_4 = 43,
  anon_sym_5 = 44,
  anon_sym_6 = 45,
  anon_sym_7 = 46,
  anon_sym_8 = 47,
  anon_sym_9 = 48,
  anon_sym_COLON = 49,
  anon_sym_SEMI = 50,
  anon_sym_LT = 51,
  anon_sym_EQ = 52,
  anon_sym_GT = 53,
  anon_sym_QMARK = 54,
  anon_sym_AT = 55,
  anon_sym_A = 56,
  anon_sym_B = 57,
  anon_sym_C = 58,
  anon_sym_D = 59,
  anon_sym_F = 60,
  anon_sym_G = 61,
  anon_sym_H = 62,
  anon_sym_I = 63,
  anon_sym_J = 64,
  anon_sym_K = 65,
  anon_sym_L = 66,
  anon_sym_M = 67,
  anon_sym_N = 68,
  anon_sym_O = 69,
  anon_sym_P = 70,
  anon_sym_Q = 71,
  anon_sym_R = 72,
  anon_sym_S = 73,
  anon_sym_T = 74,
  anon_sym_U = 75,
  anon_sym_V = 76,
  anon_sym_W = 77,
  anon_sym_X = 78,
  anon_sym_Y = 79,
  anon_sym_Z = 80,
  anon_sym_LBRACK = 81,
  anon_sym_BSLASH = 82,
  anon_sym_RBRACK = 83,
  anon_sym_CARET = 84,
  anon_sym_BQUOTE = 85,
  anon_sym_a = 86,
  anon_sym_b = 87,
  anon_sym_c = 88,
  anon_sym_d = 89,
  anon_sym_e = 90,
  anon_sym_f = 91,
  anon_sym_g = 92,
  anon_sym_h = 93,
  anon_sym_i = 94,
  anon_sym_j = 95,
  anon_sym_k = 96,
  anon_sym_l = 97,
  anon_sym_m = 98,
  anon_sym_n = 99,
  anon_sym_o = 100,
  anon_sym_p = 101,
  anon_sym_q = 102,
  anon_sym_r = 103,
  anon_sym_s = 104,
  anon_sym_t = 105,
  anon_sym_u = 106,
  anon_sym_v = 107,
  anon_sym_w = 108,
  anon_sym_x = 109,
  anon_sym_y = 110,
  anon_sym_z = 111,
  anon_sym_PIPE = 112,
  anon_sym_TILDE = 113,
  anon_sym_DOLLAR_DOLLAR = 114,
  anon_sym_DOLLARL = 115,
  anon_sym_DOLLARN = 116,
  anon_sym_DOLLARP = 117,
  anon_sym_DOLLARR = 118,
  anon_sym_DOLLART = 119,
  anon_sym_COLON_EQ = 120,
  anon_sym_DOT_DOT = 121,
  anon_sym_EQ_GT = 122,
  anon_sym_LT_GT = 123,
  anon_sym_LT_EQ = 124,
  anon_sym_GT_EQ = 125,
  anon_sym_QMARK_EQ = 126,
  sym_letter = 127,
  sym_comment = 128,
  sym_EOL = 129,
  aux_sym_comment_repeat1 = 130,
  aux_sym_comment_repeat2 = 131,
  aux_sym_comment_repeat3 = 132,
};

static const char * const ts_symbol_names[] = {
  [ts_builtin_sym_end] = "end",
  [aux_sym_letter_token1] = "letter_token1",
  [sym_digit] = "digit",
  [sym_bit] = "bit",
  [sym_octal_digit] = "octal_digit",
  [sym_hex_digit] = "hex_digit",
  [anon_sym_SLASH_SLASH] = "//",
  [aux_sym_comment_token1] = "comment_token1",
  [anon_sym_CR] = "\r",
  [anon_sym_LF] = "\n",
  [anon_sym_LPAREN_STAR] = "(*",
  [aux_sym_comment_token2] = "comment_token2",
  [aux_sym_comment_token3] = "comment_token3",
  [anon_sym_STAR_RPAREN] = "*)",
  [anon_sym_SLASH_STAR] = "/*",
  [aux_sym_comment_token4] = "comment_token4",
  [anon_sym_STAR_SLASH] = "*/",
  [sym_WS] = "WS",
  [anon_sym_LBRACE] = "{",
  [anon_sym_RBRACE] = "}",
  [anon_sym_POUND] = "#",
  [anon_sym__] = "_",
  [anon_sym_PLUS] = "+",
  [anon_sym_DASH] = "-",
  [anon_sym_DOT] = ".",
  [anon_sym_E] = "E",
  [anon_sym_SQUOTE] = "'",
  [anon_sym_DQUOTE] = "\"",
  [anon_sym_DOLLAR_SQUOTE] = "$'",
  [anon_sym_DOLLAR] = "$",
  [anon_sym_DOLLAR_DQUOTE] = "$\"",
  [anon_sym_BANG] = "!",
  [anon_sym_PERCENT] = "%",
  [anon_sym_AMP] = "&",
  [anon_sym_LPAREN] = "(",
  [anon_sym_RPAREN] = ")",
  [anon_sym_STAR] = "*",
  [anon_sym_COMMA] = ",",
  [anon_sym_SLASH] = "/",
  [anon_sym_0] = "0",
  [anon_sym_1] = "1",
  [anon_sym_2] = "2",
  [anon_sym_3] = "3",
  [anon_sym_4] = "4",
  [anon_sym_5] = "5",
  [anon_sym_6] = "6",
  [anon_sym_7] = "7",
  [anon_sym_8] = "8",
  [anon_sym_9] = "9",
  [anon_sym_COLON] = ":",
  [anon_sym_SEMI] = ";",
  [anon_sym_LT] = "<",
  [anon_sym_EQ] = "=",
  [anon_sym_GT] = ">",
  [anon_sym_QMARK] = "\?",
  [anon_sym_AT] = "@",
  [anon_sym_A] = "A",
  [anon_sym_B] = "B",
  [anon_sym_C] = "C",
  [anon_sym_D] = "D",
  [anon_sym_F] = "F",
  [anon_sym_G] = "G",
  [anon_sym_H] = "H",
  [anon_sym_I] = "I",
  [anon_sym_J] = "J",
  [anon_sym_K] = "K",
  [anon_sym_L] = "L",
  [anon_sym_M] = "M",
  [anon_sym_N] = "N",
  [anon_sym_O] = "O",
  [anon_sym_P] = "P",
  [anon_sym_Q] = "Q",
  [anon_sym_R] = "R",
  [anon_sym_S] = "S",
  [anon_sym_T] = "T",
  [anon_sym_U] = "U",
  [anon_sym_V] = "V",
  [anon_sym_W] = "W",
  [anon_sym_X] = "X",
  [anon_sym_Y] = "Y",
  [anon_sym_Z] = "Z",
  [anon_sym_LBRACK] = "[",
  [anon_sym_BSLASH] = "\\",
  [anon_sym_RBRACK] = "]",
  [anon_sym_CARET] = "^",
  [anon_sym_BQUOTE] = "`",
  [anon_sym_a] = "a",
  [anon_sym_b] = "b",
  [anon_sym_c] = "c",
  [anon_sym_d] = "d",
  [anon_sym_e] = "e",
  [anon_sym_f] = "f",
  [anon_sym_g] = "g",
  [anon_sym_h] = "h",
  [anon_sym_i] = "i",
  [anon_sym_j] = "j",
  [anon_sym_k] = "k",
  [anon_sym_l] = "l",
  [anon_sym_m] = "m",
  [anon_sym_n] = "n",
  [anon_sym_o] = "o",
  [anon_sym_p] = "p",
  [anon_sym_q] = "q",
  [anon_sym_r] = "r",
  [anon_sym_s] = "s",
  [anon_sym_t] = "t",
  [anon_sym_u] = "u",
  [anon_sym_v] = "v",
  [anon_sym_w] = "w",
  [anon_sym_x] = "x",
  [anon_sym_y] = "y",
  [anon_sym_z] = "z",
  [anon_sym_PIPE] = "|",
  [anon_sym_TILDE] = "~",
  [anon_sym_DOLLAR_DOLLAR] = "$$",
  [anon_sym_DOLLARL] = "$L",
  [anon_sym_DOLLARN] = "$N",
  [anon_sym_DOLLARP] = "$P",
  [anon_sym_DOLLARR] = "$R",
  [anon_sym_DOLLART] = "$T",
  [anon_sym_COLON_EQ] = ":=",
  [anon_sym_DOT_DOT] = "..",
  [anon_sym_EQ_GT] = "=>",
  [anon_sym_LT_GT] = "<>",
  [anon_sym_LT_EQ] = "<=",
  [anon_sym_GT_EQ] = ">=",
  [anon_sym_QMARK_EQ] = "\?=",
  [sym_letter] = "letter",
  [sym_comment] = "comment",
  [sym_EOL] = "EOL",
  [aux_sym_comment_repeat1] = "comment_repeat1",
  [aux_sym_comment_repeat2] = "comment_repeat2",
  [aux_sym_comment_repeat3] = "comment_repeat3",
};

static const TSSymbol ts_symbol_map[] = {
  [ts_builtin_sym_end] = ts_builtin_sym_end,
  [aux_sym_letter_token1] = aux_sym_letter_token1,
  [sym_digit] = sym_digit,
  [sym_bit] = sym_bit,
  [sym_octal_digit] = sym_octal_digit,
  [sym_hex_digit] = sym_hex_digit,
  [anon_sym_SLASH_SLASH] = anon_sym_SLASH_SLASH,
  [aux_sym_comment_token1] = aux_sym_comment_token1,
  [anon_sym_CR] = anon_sym_CR,
  [anon_sym_LF] = anon_sym_LF,
  [anon_sym_LPAREN_STAR] = anon_sym_LPAREN_STAR,
  [aux_sym_comment_token2] = aux_sym_comment_token2,
  [aux_sym_comment_token3] = aux_sym_comment_token3,
  [anon_sym_STAR_RPAREN] = anon_sym_STAR_RPAREN,
  [anon_sym_SLASH_STAR] = anon_sym_SLASH_STAR,
  [aux_sym_comment_token4] = aux_sym_comment_token4,
  [anon_sym_STAR_SLASH] = anon_sym_STAR_SLASH,
  [sym_WS] = sym_WS,
  [anon_sym_LBRACE] = anon_sym_LBRACE,
  [anon_sym_RBRACE] = anon_sym_RBRACE,
  [anon_sym_POUND] = anon_sym_POUND,
  [anon_sym__] = anon_sym__,
  [anon_sym_PLUS] = anon_sym_PLUS,
  [anon_sym_DASH] = anon_sym_DASH,
  [anon_sym_DOT] = anon_sym_DOT,
  [anon_sym_E] = anon_sym_E,
  [anon_sym_SQUOTE] = anon_sym_SQUOTE,
  [anon_sym_DQUOTE] = anon_sym_DQUOTE,
  [anon_sym_DOLLAR_SQUOTE] = anon_sym_DOLLAR_SQUOTE,
  [anon_sym_DOLLAR] = anon_sym_DOLLAR,
  [anon_sym_DOLLAR_DQUOTE] = anon_sym_DOLLAR_DQUOTE,
  [anon_sym_BANG] = anon_sym_BANG,
  [anon_sym_PERCENT] = anon_sym_PERCENT,
  [anon_sym_AMP] = anon_sym_AMP,
  [anon_sym_LPAREN] = anon_sym_LPAREN,
  [anon_sym_RPAREN] = anon_sym_RPAREN,
  [anon_sym_STAR] = anon_sym_STAR,
  [anon_sym_COMMA] = anon_sym_COMMA,
  [anon_sym_SLASH] = anon_sym_SLASH,
  [anon_sym_0] = anon_sym_0,
  [anon_sym_1] = anon_sym_1,
  [anon_sym_2] = anon_sym_2,
  [anon_sym_3] = anon_sym_3,
  [anon_sym_4] = anon_sym_4,
  [anon_sym_5] = anon_sym_5,
  [anon_sym_6] = anon_sym_6,
  [anon_sym_7] = anon_sym_7,
  [anon_sym_8] = anon_sym_8,
  [anon_sym_9] = anon_sym_9,
  [anon_sym_COLON] = anon_sym_COLON,
  [anon_sym_SEMI] = anon_sym_SEMI,
  [anon_sym_LT] = anon_sym_LT,
  [anon_sym_EQ] = anon_sym_EQ,
  [anon_sym_GT] = anon_sym_GT,
  [anon_sym_QMARK] = anon_sym_QMARK,
  [anon_sym_AT] = anon_sym_AT,
  [anon_sym_A] = anon_sym_A,
  [anon_sym_B] = anon_sym_B,
  [anon_sym_C] = anon_sym_C,
  [anon_sym_D] = anon_sym_D,
  [anon_sym_F] = anon_sym_F,
  [anon_sym_G] = anon_sym_G,
  [anon_sym_H] = anon_sym_H,
  [anon_sym_I] = anon_sym_I,
  [anon_sym_J] = anon_sym_J,
  [anon_sym_K] = anon_sym_K,
  [anon_sym_L] = anon_sym_L,
  [anon_sym_M] = anon_sym_M,
  [anon_sym_N] = anon_sym_N,
  [anon_sym_O] = anon_sym_O,
  [anon_sym_P] = anon_sym_P,
  [anon_sym_Q] = anon_sym_Q,
  [anon_sym_R] = anon_sym_R,
  [anon_sym_S] = anon_sym_S,
  [anon_sym_T] = anon_sym_T,
  [anon_sym_U] = anon_sym_U,
  [anon_sym_V] = anon_sym_V,
  [anon_sym_W] = anon_sym_W,
  [anon_sym_X] = anon_sym_X,
  [anon_sym_Y] = anon_sym_Y,
  [anon_sym_Z] = anon_sym_Z,
  [anon_sym_LBRACK] = anon_sym_LBRACK,
  [anon_sym_BSLASH] = anon_sym_BSLASH,
  [anon_sym_RBRACK] = anon_sym_RBRACK,
  [anon_sym_CARET] = anon_sym_CARET,
  [anon_sym_BQUOTE] = anon_sym_BQUOTE,
  [anon_sym_a] = anon_sym_a,
  [anon_sym_b] = anon_sym_b,
  [anon_sym_c] = anon_sym_c,
  [anon_sym_d] = anon_sym_d,
  [anon_sym_e] = anon_sym_e,
  [anon_sym_f] = anon_sym_f,
  [anon_sym_g] = anon_sym_g,
  [anon_sym_h] = anon_sym_h,
  [anon_sym_i] = anon_sym_i,
  [anon_sym_j] = anon_sym_j,
  [anon_sym_k] = anon_sym_k,
  [anon_sym_l] = anon_sym_l,
  [anon_sym_m] = anon_sym_m,
  [anon_sym_n] = anon_sym_n,
  [anon_sym_o] = anon_sym_o,
  [anon_sym_p] = anon_sym_p,
  [anon_sym_q] = anon_sym_q,
  [anon_sym_r] = anon_sym_r,
  [anon_sym_s] = anon_sym_s,
  [anon_sym_t] = anon_sym_t,
  [anon_sym_u] = anon_sym_u,
  [anon_sym_v] = anon_sym_v,
  [anon_sym_w] = anon_sym_w,
  [anon_sym_x] = anon_sym_x,
  [anon_sym_y] = anon_sym_y,
  [anon_sym_z] = anon_sym_z,
  [anon_sym_PIPE] = anon_sym_PIPE,
  [anon_sym_TILDE] = anon_sym_TILDE,
  [anon_sym_DOLLAR_DOLLAR] = anon_sym_DOLLAR_DOLLAR,
  [anon_sym_DOLLARL] = anon_sym_DOLLARL,
  [anon_sym_DOLLARN] = anon_sym_DOLLARN,
  [anon_sym_DOLLARP] = anon_sym_DOLLARP,
  [anon_sym_DOLLARR] = anon_sym_DOLLARR,
  [anon_sym_DOLLART] = anon_sym_DOLLART,
  [anon_sym_COLON_EQ] = anon_sym_COLON_EQ,
  [anon_sym_DOT_DOT] = anon_sym_DOT_DOT,
  [anon_sym_EQ_GT] = anon_sym_EQ_GT,
  [anon_sym_LT_GT] = anon_sym_LT_GT,
  [anon_sym_LT_EQ] = anon_sym_LT_EQ,
  [anon_sym_GT_EQ] = anon_sym_GT_EQ,
  [anon_sym_QMARK_EQ] = anon_sym_QMARK_EQ,
  [sym_letter] = sym_letter,
  [sym_comment] = sym_comment,
  [sym_EOL] = sym_EOL,
  [aux_sym_comment_repeat1] = aux_sym_comment_repeat1,
  [aux_sym_comment_repeat2] = aux_sym_comment_repeat2,
  [aux_sym_comment_repeat3] = aux_sym_comment_repeat3,
};

static const TSSymbolMetadata ts_symbol_metadata[] = {
  [ts_builtin_sym_end] = {
    .visible = false,
    .named = true,
  },
  [aux_sym_letter_token1] = {
    .visible = false,
    .named = false,
  },
  [sym_digit] = {
    .visible = true,
    .named = true,
  },
  [sym_bit] = {
    .visible = true,
    .named = true,
  },
  [sym_octal_digit] = {
    .visible = true,
    .named = true,
  },
  [sym_hex_digit] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_SLASH_SLASH] = {
    .visible = true,
    .named = false,
  },
  [aux_sym_comment_token1] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_CR] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LF] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LPAREN_STAR] = {
    .visible = true,
    .named = false,
  },
  [aux_sym_comment_token2] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_comment_token3] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_STAR_RPAREN] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_SLASH_STAR] = {
    .visible = true,
    .named = false,
  },
  [aux_sym_comment_token4] = {
    .visible = false,
    .named = false,
  },
  [anon_sym_STAR_SLASH] = {
    .visible = true,
    .named = false,
  },
  [sym_WS] = {
    .visible = true,
    .named = true,
  },
  [anon_sym_LBRACE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RBRACE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_POUND] = {
    .visible = true,
    .named = false,
  },
  [anon_sym__] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_PLUS] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DASH] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DOT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_E] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_SQUOTE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DQUOTE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DOLLAR_SQUOTE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DOLLAR] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DOLLAR_DQUOTE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_BANG] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_PERCENT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_AMP] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LPAREN] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RPAREN] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_STAR] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_COMMA] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_SLASH] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_0] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_1] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_2] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_3] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_4] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_5] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_6] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_7] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_8] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_9] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_COLON] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_SEMI] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_EQ] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_GT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_QMARK] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_AT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_A] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_B] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_C] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_D] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_F] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_G] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_H] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_I] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_J] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_K] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_L] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_M] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_N] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_O] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_P] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_Q] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_R] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_S] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_T] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_U] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_V] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_W] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_X] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_Y] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_Z] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LBRACK] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_BSLASH] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_RBRACK] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_CARET] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_BQUOTE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_a] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_b] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_c] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_d] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_e] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_f] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_g] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_h] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_i] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_j] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_k] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_l] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_m] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_n] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_o] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_p] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_q] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_r] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_s] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_t] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_u] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_v] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_w] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_x] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_y] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_z] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_PIPE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_TILDE] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DOLLAR_DOLLAR] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DOLLARL] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DOLLARN] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DOLLARP] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DOLLARR] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DOLLART] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_COLON_EQ] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_DOT_DOT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_EQ_GT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LT_GT] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_LT_EQ] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_GT_EQ] = {
    .visible = true,
    .named = false,
  },
  [anon_sym_QMARK_EQ] = {
    .visible = true,
    .named = false,
  },
  [sym_letter] = {
    .visible = true,
    .named = true,
  },
  [sym_comment] = {
    .visible = true,
    .named = true,
  },
  [sym_EOL] = {
    .visible = true,
    .named = true,
  },
  [aux_sym_comment_repeat1] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_comment_repeat2] = {
    .visible = false,
    .named = false,
  },
  [aux_sym_comment_repeat3] = {
    .visible = false,
    .named = false,
  },
};

static const TSSymbol ts_alias_sequences[PRODUCTION_ID_COUNT][MAX_ALIAS_SEQUENCE_LENGTH] = {
  [0] = {0},
};

static const uint16_t ts_non_terminal_alias_map[] = {
  0,
};

static const TSStateId ts_primary_state_ids[STATE_COUNT] = {
  [0] = 0,
  [1] = 1,
  [2] = 2,
  [3] = 3,
  [4] = 4,
  [5] = 5,
  [6] = 6,
  [7] = 7,
  [8] = 8,
  [9] = 9,
  [10] = 10,
  [11] = 11,
  [12] = 12,
  [13] = 13,
  [14] = 14,
  [15] = 15,
  [16] = 16,
  [17] = 17,
  [18] = 18,
  [19] = 19,
  [20] = 20,
  [21] = 21,
};

static bool ts_lex(TSLexer *lexer, TSStateId state) {
  START_LEXER();
  eof = lexer->eof(lexer);
  switch (state) {
    case 0:
      ACCEPT_TOKEN(sym_WS);
      if (eof) ADVANCE(1);
      if (lookahead == '\n') ADVANCE(9);
      if (lookahead == '\t' ||
          lookahead == '\r') ADVANCE(18);
      END_STATE();
    case 1:
      ACCEPT_TOKEN(ts_builtin_sym_end);
      END_STATE();
    case 2:
      ACCEPT_TOKEN(anon_sym_SLASH_SLASH);
      END_STATE();
    case 3:
      ACCEPT_TOKEN(anon_sym_SLASH_SLASH);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '(' &&
          lookahead != ')' &&
          lookahead != '|') ADVANCE(6);
      END_STATE();
    case 4:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead == '\t') ADVANCE(4);
      if (lookahead == '\n') ADVANCE(8);
      if (lookahead == '\r') ADVANCE(7);
      if (lookahead == '/') ADVANCE(5);
      if (lookahead == 0x0b ||
          lookahead == '\f' ||
          lookahead == ' ') ADVANCE(4);
      if (lookahead != 0 &&
          lookahead != '(' &&
          lookahead != ')' &&
          lookahead != '|') ADVANCE(6);
      END_STATE();
    case 5:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead == '*') ADVANCE(17);
      if (lookahead == '/') ADVANCE(3);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          (lookahead < '(' || '*' < lookahead) &&
          lookahead != '|') ADVANCE(6);
      END_STATE();
    case 6:
      ACCEPT_TOKEN(aux_sym_comment_token1);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '(' &&
          lookahead != ')' &&
          lookahead != '|') ADVANCE(6);
      END_STATE();
    case 7:
      ACCEPT_TOKEN(anon_sym_CR);
      if (lookahead == '\t') ADVANCE(4);
      if (lookahead == '\n') ADVANCE(8);
      if (lookahead == '\r') ADVANCE(7);
      if (lookahead == 0x0b ||
          lookahead == '\f' ||
          lookahead == ' ') ADVANCE(4);
      END_STATE();
    case 8:
      ACCEPT_TOKEN(anon_sym_LF);
      if (lookahead == '\t') ADVANCE(4);
      if (lookahead == '\n') ADVANCE(8);
      if (lookahead == '\r') ADVANCE(7);
      if (lookahead == 0x0b ||
          lookahead == '\f' ||
          lookahead == ' ') ADVANCE(4);
      END_STATE();
    case 9:
      ACCEPT_TOKEN(anon_sym_LF);
      if (lookahead == '\n') ADVANCE(9);
      if (lookahead == '\t' ||
          lookahead == '\r') ADVANCE(18);
      END_STATE();
    case 10:
      ACCEPT_TOKEN(anon_sym_LF);
      if (lookahead == '\n') ADVANCE(10);
      if (lookahead == '\t' ||
          lookahead == '\r') ADVANCE(13);
      if (lookahead == 0x0b ||
          lookahead == '\f' ||
          lookahead == ' ') ADVANCE(13);
      END_STATE();
    case 11:
      ACCEPT_TOKEN(anon_sym_LPAREN_STAR);
      END_STATE();
    case 12:
      ACCEPT_TOKEN(aux_sym_comment_token2);
      END_STATE();
    case 13:
      ACCEPT_TOKEN(aux_sym_comment_token2);
      if (lookahead == '\n') ADVANCE(10);
      if (lookahead == '(') ADVANCE(14);
      if (lookahead == '/') ADVANCE(15);
      if (lookahead == '\t' ||
          lookahead == '\r') ADVANCE(13);
      if (lookahead == 0x0b ||
          lookahead == '\f' ||
          lookahead == ' ') ADVANCE(13);
      if (lookahead != 0 &&
          lookahead != '*') ADVANCE(12);
      END_STATE();
    case 14:
      ACCEPT_TOKEN(aux_sym_comment_token2);
      if (lookahead == '*') ADVANCE(11);
      END_STATE();
    case 15:
      ACCEPT_TOKEN(aux_sym_comment_token2);
      if (lookahead == '*') ADVANCE(16);
      if (lookahead == '/') ADVANCE(2);
      END_STATE();
    case 16:
      ACCEPT_TOKEN(anon_sym_SLASH_STAR);
      END_STATE();
    case 17:
      ACCEPT_TOKEN(anon_sym_SLASH_STAR);
      if (lookahead != 0 &&
          lookahead != '\n' &&
          lookahead != '\r' &&
          lookahead != '(' &&
          lookahead != ')' &&
          lookahead != '|') ADVANCE(6);
      END_STATE();
    case 18:
      ACCEPT_TOKEN(sym_WS);
      if (lookahead == '\n') ADVANCE(9);
      if (lookahead == '\t' ||
          lookahead == '\r') ADVANCE(18);
      END_STATE();
    case 19:
      ACCEPT_TOKEN(sym_WS);
      if (lookahead == '\n') ADVANCE(10);
      if (lookahead == '\t' ||
          lookahead == '\r') ADVANCE(13);
      if (lookahead == 0x0b ||
          lookahead == '\f' ||
          lookahead == ' ') ADVANCE(13);
      END_STATE();
    case 20:
      ACCEPT_TOKEN(sym_WS);
      if (eof) ADVANCE(1);
      if (lookahead == '\n') ADVANCE(9);
      if (lookahead == '\t' ||
          lookahead == '\r') ADVANCE(18);
      END_STATE();
    default:
      return false;
  }
}

static const TSLexMode ts_lex_modes[STATE_COUNT] = {
  [0] = {.lex_state = 0},
  [1] = {.lex_state = 20},
  [2] = {.lex_state = 19},
  [3] = {.lex_state = 19},
  [4] = {.lex_state = 19},
  [5] = {.lex_state = 19},
  [6] = {.lex_state = 19},
  [7] = {.lex_state = 19},
  [8] = {.lex_state = 4},
  [9] = {.lex_state = 19},
  [10] = {.lex_state = 19},
  [11] = {.lex_state = 4},
  [12] = {.lex_state = 4},
  [13] = {.lex_state = 4},
  [14] = {.lex_state = 20},
  [15] = {.lex_state = 20},
  [16] = {.lex_state = 20},
  [17] = {.lex_state = 20},
  [18] = {(TSStateId)(-1)},
  [19] = {(TSStateId)(-1)},
  [20] = {(TSStateId)(-1)},
  [21] = {(TSStateId)(-1)},
};

static const uint16_t ts_parse_table[LARGE_STATE_COUNT][SYMBOL_COUNT] = {
  [0] = {
    [sym_comment] = STATE(0),
    [sym_EOL] = STATE(0),
    [ts_builtin_sym_end] = ACTIONS(1),
    [aux_sym_letter_token1] = ACTIONS(1),
    [sym_digit] = ACTIONS(1),
    [sym_bit] = ACTIONS(1),
    [sym_octal_digit] = ACTIONS(1),
    [sym_hex_digit] = ACTIONS(1),
    [anon_sym_SLASH_SLASH] = ACTIONS(3),
    [anon_sym_LF] = ACTIONS(5),
    [anon_sym_LPAREN_STAR] = ACTIONS(7),
    [anon_sym_SLASH_STAR] = ACTIONS(9),
    [sym_WS] = ACTIONS(11),
    [anon_sym_LBRACE] = ACTIONS(1),
    [anon_sym_RBRACE] = ACTIONS(1),
    [anon_sym_POUND] = ACTIONS(1),
    [anon_sym__] = ACTIONS(1),
    [anon_sym_PLUS] = ACTIONS(1),
    [anon_sym_DASH] = ACTIONS(1),
    [anon_sym_DOT] = ACTIONS(1),
    [anon_sym_E] = ACTIONS(1),
    [anon_sym_SQUOTE] = ACTIONS(1),
    [anon_sym_DQUOTE] = ACTIONS(1),
    [anon_sym_DOLLAR_SQUOTE] = ACTIONS(1),
    [anon_sym_DOLLAR] = ACTIONS(1),
    [anon_sym_DOLLAR_DQUOTE] = ACTIONS(1),
    [anon_sym_BANG] = ACTIONS(1),
    [anon_sym_PERCENT] = ACTIONS(1),
    [anon_sym_AMP] = ACTIONS(1),
    [anon_sym_LPAREN] = ACTIONS(1),
    [anon_sym_RPAREN] = ACTIONS(1),
    [anon_sym_STAR] = ACTIONS(1),
    [anon_sym_COMMA] = ACTIONS(1),
    [anon_sym_SLASH] = ACTIONS(1),
    [anon_sym_0] = ACTIONS(1),
    [anon_sym_1] = ACTIONS(1),
    [anon_sym_2] = ACTIONS(1),
    [anon_sym_3] = ACTIONS(1),
    [anon_sym_4] = ACTIONS(1),
    [anon_sym_5] = ACTIONS(1),
    [anon_sym_6] = ACTIONS(1),
    [anon_sym_7] = ACTIONS(1),
    [anon_sym_8] = ACTIONS(1),
    [anon_sym_9] = ACTIONS(1),
    [anon_sym_COLON] = ACTIONS(1),
    [anon_sym_SEMI] = ACTIONS(1),
    [anon_sym_LT] = ACTIONS(1),
    [anon_sym_EQ] = ACTIONS(1),
    [anon_sym_GT] = ACTIONS(1),
    [anon_sym_QMARK] = ACTIONS(1),
    [anon_sym_AT] = ACTIONS(1),
    [anon_sym_A] = ACTIONS(1),
    [anon_sym_B] = ACTIONS(1),
    [anon_sym_C] = ACTIONS(1),
    [anon_sym_D] = ACTIONS(1),
    [anon_sym_F] = ACTIONS(1),
    [anon_sym_G] = ACTIONS(1),
    [anon_sym_H] = ACTIONS(1),
    [anon_sym_I] = ACTIONS(1),
    [anon_sym_J] = ACTIONS(1),
    [anon_sym_K] = ACTIONS(1),
    [anon_sym_L] = ACTIONS(1),
    [anon_sym_M] = ACTIONS(1),
    [anon_sym_N] = ACTIONS(1),
    [anon_sym_O] = ACTIONS(1),
    [anon_sym_P] = ACTIONS(1),
    [anon_sym_Q] = ACTIONS(1),
    [anon_sym_R] = ACTIONS(1),
    [anon_sym_S] = ACTIONS(1),
    [anon_sym_T] = ACTIONS(1),
    [anon_sym_U] = ACTIONS(1),
    [anon_sym_V] = ACTIONS(1),
    [anon_sym_W] = ACTIONS(1),
    [anon_sym_X] = ACTIONS(1),
    [anon_sym_Y] = ACTIONS(1),
    [anon_sym_Z] = ACTIONS(1),
    [anon_sym_LBRACK] = ACTIONS(1),
    [anon_sym_BSLASH] = ACTIONS(1),
    [anon_sym_RBRACK] = ACTIONS(1),
    [anon_sym_CARET] = ACTIONS(1),
    [anon_sym_BQUOTE] = ACTIONS(1),
    [anon_sym_a] = ACTIONS(1),
    [anon_sym_b] = ACTIONS(1),
    [anon_sym_c] = ACTIONS(1),
    [anon_sym_d] = ACTIONS(1),
    [anon_sym_e] = ACTIONS(1),
    [anon_sym_f] = ACTIONS(1),
    [anon_sym_g] = ACTIONS(1),
    [anon_sym_h] = ACTIONS(1),
    [anon_sym_i] = ACTIONS(1),
    [anon_sym_j] = ACTIONS(1),
    [anon_sym_k] = ACTIONS(1),
    [anon_sym_l] = ACTIONS(1),
    [anon_sym_m] = ACTIONS(1),
    [anon_sym_n] = ACTIONS(1),
    [anon_sym_o] = ACTIONS(1),
    [anon_sym_p] = ACTIONS(1),
    [anon_sym_q] = ACTIONS(1),
    [anon_sym_r] = ACTIONS(1),
    [anon_sym_s] = ACTIONS(1),
    [anon_sym_t] = ACTIONS(1),
    [anon_sym_u] = ACTIONS(1),
    [anon_sym_v] = ACTIONS(1),
    [anon_sym_w] = ACTIONS(1),
    [anon_sym_x] = ACTIONS(1),
    [anon_sym_y] = ACTIONS(1),
    [anon_sym_z] = ACTIONS(1),
    [anon_sym_PIPE] = ACTIONS(1),
    [anon_sym_TILDE] = ACTIONS(1),
    [anon_sym_DOLLAR_DOLLAR] = ACTIONS(1),
    [anon_sym_DOLLARL] = ACTIONS(1),
    [anon_sym_DOLLARN] = ACTIONS(1),
    [anon_sym_DOLLARP] = ACTIONS(1),
    [anon_sym_DOLLARR] = ACTIONS(1),
    [anon_sym_DOLLART] = ACTIONS(1),
    [anon_sym_COLON_EQ] = ACTIONS(1),
    [anon_sym_DOT_DOT] = ACTIONS(1),
    [anon_sym_EQ_GT] = ACTIONS(1),
    [anon_sym_LT_GT] = ACTIONS(1),
    [anon_sym_LT_EQ] = ACTIONS(1),
    [anon_sym_GT_EQ] = ACTIONS(1),
    [anon_sym_QMARK_EQ] = ACTIONS(1),
  },
  [1] = {
    [sym_letter] = STATE(15),
    [sym_comment] = STATE(1),
    [sym_EOL] = STATE(1),
    [aux_sym_letter_token1] = ACTIONS(13),
    [anon_sym_SLASH_SLASH] = ACTIONS(3),
    [anon_sym_LF] = ACTIONS(5),
    [anon_sym_LPAREN_STAR] = ACTIONS(7),
    [anon_sym_SLASH_STAR] = ACTIONS(9),
    [sym_WS] = ACTIONS(11),
  },
};

static const uint16_t ts_small_parse_table[] = {
  [0] = 9,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(5), 1,
      anon_sym_LF,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    ACTIONS(17), 1,
      anon_sym_STAR_SLASH,
    STATE(7), 1,
      aux_sym_comment_repeat3,
    ACTIONS(15), 2,
      aux_sym_comment_token2,
      aux_sym_comment_token4,
    STATE(2), 2,
      sym_comment,
      sym_EOL,
  [30] = 9,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(5), 1,
      anon_sym_LF,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    ACTIONS(21), 1,
      anon_sym_STAR_RPAREN,
    STATE(5), 1,
      aux_sym_comment_repeat2,
    ACTIONS(19), 2,
      aux_sym_comment_token2,
      aux_sym_comment_token3,
    STATE(3), 2,
      sym_comment,
      sym_EOL,
  [60] = 9,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(5), 1,
      anon_sym_LF,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    ACTIONS(21), 1,
      anon_sym_STAR_SLASH,
    STATE(2), 1,
      aux_sym_comment_repeat3,
    ACTIONS(15), 2,
      aux_sym_comment_token2,
      aux_sym_comment_token4,
    STATE(4), 2,
      sym_comment,
      sym_EOL,
  [90] = 9,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(5), 1,
      anon_sym_LF,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    ACTIONS(17), 1,
      anon_sym_STAR_RPAREN,
    STATE(6), 1,
      aux_sym_comment_repeat2,
    ACTIONS(19), 2,
      aux_sym_comment_token2,
      aux_sym_comment_token3,
    STATE(5), 2,
      sym_comment,
      sym_EOL,
  [120] = 8,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(5), 1,
      anon_sym_LF,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    ACTIONS(26), 1,
      anon_sym_STAR_RPAREN,
    ACTIONS(23), 2,
      aux_sym_comment_token2,
      aux_sym_comment_token3,
    STATE(6), 3,
      sym_comment,
      sym_EOL,
      aux_sym_comment_repeat2,
  [148] = 8,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(5), 1,
      anon_sym_LF,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    ACTIONS(31), 1,
      anon_sym_STAR_SLASH,
    ACTIONS(28), 2,
      aux_sym_comment_token2,
      aux_sym_comment_token4,
    STATE(7), 3,
      sym_comment,
      sym_EOL,
      aux_sym_comment_repeat3,
  [176] = 9,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    ACTIONS(17), 1,
      anon_sym_LF,
    ACTIONS(33), 1,
      aux_sym_comment_token1,
    ACTIONS(35), 1,
      anon_sym_CR,
    STATE(12), 1,
      aux_sym_comment_repeat1,
    STATE(8), 2,
      sym_comment,
      sym_EOL,
  [205] = 7,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(5), 1,
      anon_sym_LF,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    STATE(9), 2,
      sym_comment,
      sym_EOL,
    ACTIONS(37), 3,
      aux_sym_comment_token2,
      aux_sym_comment_token3,
      anon_sym_STAR_RPAREN,
  [230] = 7,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(5), 1,
      anon_sym_LF,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    STATE(10), 2,
      sym_comment,
      sym_EOL,
    ACTIONS(39), 3,
      aux_sym_comment_token2,
      aux_sym_comment_token4,
      anon_sym_STAR_SLASH,
  [255] = 9,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    ACTIONS(21), 1,
      anon_sym_LF,
    ACTIONS(33), 1,
      aux_sym_comment_token1,
    ACTIONS(41), 1,
      anon_sym_CR,
    STATE(8), 1,
      aux_sym_comment_repeat1,
    STATE(11), 2,
      sym_comment,
      sym_EOL,
  [284] = 7,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    ACTIONS(43), 1,
      aux_sym_comment_token1,
    ACTIONS(46), 2,
      anon_sym_CR,
      anon_sym_LF,
    STATE(12), 3,
      sym_comment,
      sym_EOL,
      aux_sym_comment_repeat1,
  [309] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    STATE(13), 2,
      sym_comment,
      sym_EOL,
    ACTIONS(48), 3,
      aux_sym_comment_token1,
      anon_sym_CR,
      anon_sym_LF,
  [331] = 7,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(5), 1,
      anon_sym_LF,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    ACTIONS(50), 1,
      ts_builtin_sym_end,
    STATE(14), 2,
      sym_comment,
      sym_EOL,
  [354] = 7,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(5), 1,
      anon_sym_LF,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    ACTIONS(52), 1,
      ts_builtin_sym_end,
    STATE(15), 2,
      sym_comment,
      sym_EOL,
  [377] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    ACTIONS(17), 1,
      anon_sym_LF,
    STATE(16), 2,
      sym_comment,
      sym_EOL,
  [397] = 6,
    ACTIONS(3), 1,
      anon_sym_SLASH_SLASH,
    ACTIONS(7), 1,
      anon_sym_LPAREN_STAR,
    ACTIONS(9), 1,
      anon_sym_SLASH_STAR,
    ACTIONS(11), 1,
      sym_WS,
    ACTIONS(54), 1,
      anon_sym_LF,
    STATE(17), 2,
      sym_comment,
      sym_EOL,
  [417] = 1,
    ACTIONS(56), 1,
      ts_builtin_sym_end,
  [421] = 1,
    ACTIONS(58), 1,
      ts_builtin_sym_end,
  [425] = 1,
    ACTIONS(60), 1,
      ts_builtin_sym_end,
  [429] = 1,
    ACTIONS(62), 1,
      ts_builtin_sym_end,
};

static const uint32_t ts_small_parse_table_map[] = {
  [SMALL_STATE(2)] = 0,
  [SMALL_STATE(3)] = 30,
  [SMALL_STATE(4)] = 60,
  [SMALL_STATE(5)] = 90,
  [SMALL_STATE(6)] = 120,
  [SMALL_STATE(7)] = 148,
  [SMALL_STATE(8)] = 176,
  [SMALL_STATE(9)] = 205,
  [SMALL_STATE(10)] = 230,
  [SMALL_STATE(11)] = 255,
  [SMALL_STATE(12)] = 284,
  [SMALL_STATE(13)] = 309,
  [SMALL_STATE(14)] = 331,
  [SMALL_STATE(15)] = 354,
  [SMALL_STATE(16)] = 377,
  [SMALL_STATE(17)] = 397,
  [SMALL_STATE(18)] = 417,
  [SMALL_STATE(19)] = 421,
  [SMALL_STATE(20)] = 425,
  [SMALL_STATE(21)] = 429,
};

static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 1, .reusable = false}}, RECOVER(),
  [3] = {.entry = {.count = 1, .reusable = false}}, SHIFT(11),
  [5] = {.entry = {.count = 1, .reusable = false}}, SHIFT(18),
  [7] = {.entry = {.count = 1, .reusable = false}}, SHIFT(3),
  [9] = {.entry = {.count = 1, .reusable = false}}, SHIFT(4),
  [11] = {.entry = {.count = 1, .reusable = false}}, SHIFT_EXTRA(),
  [13] = {.entry = {.count = 1, .reusable = false}}, SHIFT(14),
  [15] = {.entry = {.count = 1, .reusable = false}}, SHIFT(10),
  [17] = {.entry = {.count = 1, .reusable = false}}, SHIFT(20),
  [19] = {.entry = {.count = 1, .reusable = false}}, SHIFT(9),
  [21] = {.entry = {.count = 1, .reusable = false}}, SHIFT(19),
  [23] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_comment_repeat2, 2, 0, 0), SHIFT_REPEAT(9),
  [26] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_comment_repeat2, 2, 0, 0),
  [28] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_comment_repeat3, 2, 0, 0), SHIFT_REPEAT(10),
  [31] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_comment_repeat3, 2, 0, 0),
  [33] = {.entry = {.count = 1, .reusable = false}}, SHIFT(13),
  [35] = {.entry = {.count = 1, .reusable = false}}, SHIFT(17),
  [37] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_comment_repeat2, 1, 0, 0),
  [39] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_comment_repeat3, 1, 0, 0),
  [41] = {.entry = {.count = 1, .reusable = false}}, SHIFT(16),
  [43] = {.entry = {.count = 2, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 2, 0, 0), SHIFT_REPEAT(13),
  [46] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 2, 0, 0),
  [48] = {.entry = {.count = 1, .reusable = false}}, REDUCE(aux_sym_comment_repeat1, 1, 0, 0),
  [50] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_letter, 1, 0, 0),
  [52] = {.entry = {.count = 1, .reusable = true}},  ACCEPT_INPUT(),
  [54] = {.entry = {.count = 1, .reusable = false}}, SHIFT(21),
  [56] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_EOL, 1, 0, 0),
  [58] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comment, 2, 0, 0),
  [60] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comment, 3, 0, 0),
  [62] = {.entry = {.count = 1, .reusable = true}}, REDUCE(sym_comment, 4, 0, 0),
};

#ifdef __cplusplus
extern "C" {
#endif
#ifdef TREE_SITTER_HIDE_SYMBOLS
#define TS_PUBLIC
#elif defined(_WIN32)
#define TS_PUBLIC __declspec(dllexport)
#else
#define TS_PUBLIC __attribute__((visibility("default")))
#endif

TS_PUBLIC const TSLanguage *tree_sitter_IEC61131_rev_3(void) {
  static const TSLanguage language = {
    .version = LANGUAGE_VERSION,
    .symbol_count = SYMBOL_COUNT,
    .alias_count = ALIAS_COUNT,
    .token_count = TOKEN_COUNT,
    .external_token_count = EXTERNAL_TOKEN_COUNT,
    .state_count = STATE_COUNT,
    .large_state_count = LARGE_STATE_COUNT,
    .production_id_count = PRODUCTION_ID_COUNT,
    .field_count = FIELD_COUNT,
    .max_alias_sequence_length = MAX_ALIAS_SEQUENCE_LENGTH,
    .parse_table = &ts_parse_table[0][0],
    .small_parse_table = ts_small_parse_table,
    .small_parse_table_map = ts_small_parse_table_map,
    .parse_actions = ts_parse_actions,
    .symbol_names = ts_symbol_names,
    .symbol_metadata = ts_symbol_metadata,
    .public_symbol_map = ts_symbol_map,
    .alias_map = ts_non_terminal_alias_map,
    .alias_sequences = &ts_alias_sequences[0][0],
    .lex_modes = ts_lex_modes,
    .lex_fn = ts_lex,
    .primary_state_ids = ts_primary_state_ids,
  };
  return &language;
}
#ifdef __cplusplus
}
#endif
