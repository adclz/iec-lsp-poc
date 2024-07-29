import type { CodeMapping, LanguagePlugin, Mapping, VirtualCode } from "@volar/language-core";
import type { URI } from "vscode-uri";
import type ts from "typescript";
import Parser, { Query } from "tree-sitter";
import iec61331 from "iec61331-tree-sitter"; 

export const language = {
  getLanguageId(uri) {
    if (uri.path.endsWith('.st')) {
      return 'st';
    }
  },
  createVirtualCode(uri, languageId, snapshot) {
    if (languageId === "html1") {
        return new Iec61331Code(snapshot);
    }
  },
  updateVirtualCode(uri, languageCode, snapshot) {
    return {} as any
  },
} satisfies LanguagePlugin<URI>;

export class Iec61331Code implements VirtualCode {
    id = "root";
    languageId = "st";
    embeddedCodes: VirtualCode[] = [];
    mappings: CodeMapping[];
    associatedScriptMappings?: Map<unknown, CodeMapping[]>;
    linkedCodeMappings?: Mapping<unknown>[];
  
    constructor(public snapshot: ts.IScriptSnapshot) {
      this.onSnapshotUpdated();
    }
  
    public update(newSnapshot: ts.IScriptSnapshot) {
      this.snapshot = newSnapshot;
      this.onSnapshotUpdated();
    }
  
    public onSnapshotUpdated() {
      
    }
  }