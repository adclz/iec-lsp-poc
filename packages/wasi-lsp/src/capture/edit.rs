use std::collections::HashMap;

use lsp_types::{DidChangeTextDocumentParams, Position, Uri};
use lsp_textdocument::FullTextDocument;
use tree_sitter::{InputEdit, Parser, Point, Tree};

pub fn edit_tree(documents: &mut HashMap<Uri, FullTextDocument>, tree: &mut Tree, parser: &mut Parser, event: &DidChangeTextDocumentParams) {
    let doc = documents.get_mut(&event.text_document.uri).unwrap();

    event.content_changes
    .iter()
    .for_each(|edit| {
        let edit_range = edit.range.unwrap();
        
        let range_offset = doc.offset_at(edit_range.start) as usize;
        let start_byte = range_offset;
        let old_end_byte = range_offset + edit.range_length.unwrap() as usize;
        let new_end_byte = range_offset + edit.text.len();
        let start_position = doc.position_at(start_byte as u32);
        let old_end_position = doc.position_at(old_end_byte as u32);
        let new_end_position = doc.position_at(new_end_byte as u32);

        tree.edit(&InputEdit {
            start_byte,
            old_end_byte,
            new_end_byte,
            start_position: Point { row: start_position.line as usize, column: start_position.character as usize },
            old_end_position: Point { row: old_end_position.line as usize, column: old_end_position.character as usize },
            new_end_position: Point { row: new_end_position.line as usize, column: new_end_position.character as usize }
        });
    });

    doc.update(&event.content_changes, event.text_document.version);
    let new_tree = parser.parse(doc.get_content(None), Some(tree));
}