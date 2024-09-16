use lsp_textdocument::TextDocuments;
use lsp_types::{
    CodeLensOptions, CompletionOptions, DocumentLinkOptions, RenameOptions, ServerCapabilities,
    SignatureHelpOptions, TextDocumentSyncCapability, TextDocumentSyncKind, SelectionRangeProviderCapability,
    TypeDefinitionProviderCapability, HoverProviderCapability
};
use std::{collections::HashMap, iter::Map};
use tree_sitter::{Language, Parser, Query, Tree};
use tree_sitter_iec61131_3_2::{LANGUAGE, FOLD_QUERY, COMMENTS_QUERY, OUTLINE_QUERY, HIGHLIGHTS_QUERY};

pub mod capture;
use capture::*;

pub struct Queries {
    comments: Query,
    fold: Query,
    highlights: Query,
    outline: Query,
}

pub struct LspServer {
    documents: HashMap<String, TextDocuments>,
    trees: HashMap<String, Tree>,
    parser: Parser,
    queries: Queries,
}

impl LspServer {
    pub fn new() -> LspServer {
        let mut parser = Parser::new();
        parser
            .set_language(&LANGUAGE.into())
            .expect("Error loading Iec61131 parser");
        let lang = parser.language().unwrap();
        LspServer {
            documents: HashMap::new(),
            trees: HashMap::new(),
            parser,
            queries: Queries {
                comments: Query::new(&lang, COMMENTS_QUERY).unwrap(),
                fold: Query::new(&lang, FOLD_QUERY).unwrap(),
                highlights: Query::new(&lang, HIGHLIGHTS_QUERY).unwrap(),
                outline: Query::new(&lang, OUTLINE_QUERY).unwrap(),
            },
        }
    }

    fn get_capabilities() -> ServerCapabilities {
        ServerCapabilities {
           text_document_sync: Some(TextDocumentSyncCapability::Kind(
                TextDocumentSyncKind::INCREMENTAL,
            )),
            ..Default::default()
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn safe_builder() {
        let code = r#"
FUNCTION TEST : INT
    VAR_INPUT RETAIN
      COMMAND: ENGINE_COMMANDS;
    END_VAR
    
END_FUNCTION
        "#.as_bytes();
        let mut server = LspServer::new();
        let tree = server.parser.parse(code, None).unwrap();

        let tree = builder::builder(&server.queries.outline, tree.root_node(), code);
    }

    fn unsafe_builder() {
        let code = r#"
FUNCTION TEST : INT
    VAR_INPUT RETAIN
      COMMAND: ENGINE_COMMANDS;
    END_VAR
    
END_FUNCTION
        "#.as_bytes();
        let mut server = LspServer::new();
        let tree = server.parser.parse(code, None).unwrap();

        let tree = builder_unsafe::builder(&server.queries.outline, tree.root_node(), code);
    }
}