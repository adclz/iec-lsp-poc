import type { LanguageServiceContext, LanguageServicePlugin, LanguageServicePluginInstance } from '@volar/language-service';

export const languageServicePlugin: LanguageServicePlugin = {
  capabilities: {
    diagnosticProvider: {
      workspaceDiagnostics: true
    },
    semanticTokensProvider: {
      legend: {
        tokenTypes: [
          'comment',
          'keyword.function',
          'keyword.modifier',
          'keyword.coroutine',
          'keyword.operator',
          'type.definition',
          'type.builtin',
          'punctuation.separator',
          'punctuation.bracket',
          'number',
          'number.float',
          'variable',
          'variable.parameter' 
        ],
        tokenModifiers: [],
      },
    }
  },
  create: function (context: LanguageServiceContext): LanguageServicePluginInstance<any> {
    return {
      provideDiagnostics() {
        return [];
      }
    }
  }
}