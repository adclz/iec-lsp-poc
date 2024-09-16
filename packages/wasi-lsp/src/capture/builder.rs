use tree_sitter::{QueryCursor, Query, Range, Node};

#[derive(Clone, Copy)]
pub struct MetaItem {
    range: Range,
    query_name_index: usize
}

impl MetaItem {
    fn new(query_name_index: u32, range: Range) -> Self {
        Self {
            range,
            query_name_index: query_name_index as usize,
        }
    }
}

#[derive(Clone)]
pub struct MetaTree {
    is_root: bool,
    root: MetaItem,
    childrens: Vec<MetaTree>
}

impl MetaTree {
    fn new(root: MetaItem, is_root: bool) -> Self {
        Self {
            is_root,
            root,
            childrens: vec!()
        }
    }
}

fn overlapping_ranges(range1: &Range, range2: &Range) -> bool {
    range1.start_byte <= range2.start_byte && range1.end_byte >= range2.end_byte
}

/// Execute a tree sitter query and returns a recursive tree of all captures
pub fn builder<'tree>(query: &Query, root_node: Node<'tree>, source_code: &[u8]) -> MetaTree {
    let mut query_cursor = QueryCursor::new();
    let matches = query_cursor.matches(&query, root_node, source_code);

    let mut root = MetaTree::new(MetaItem::new(0, root_node.range()), true);
    let mut current_tree = None;
    for m in matches {
        for capture in m.captures {
            let item = MetaTree::new(MetaItem::new(capture.index, capture.node.range()), false);
            match current_tree {
                None => current_tree = Some(item),
                Some(ref mut tree) => {
                    if let true = overlapping_ranges(&tree.root.range, &capture.node.range()) {
                        tree.childrens.push(item)
                    } else {
                        root.childrens.push(current_tree.take().unwrap());
                        current_tree = Some(item)
                    }
                }
            }
        }
    }

    if let Some(tree) = current_tree {
        root.childrens.push(tree);
    }

    binder(&root, query, source_code);
    root
}

/// Iterate recursively throughout the whole meta tree
pub fn binder(tree: &MetaTree, query: &Query, source_code: &[u8]) {
    if !tree.is_root {
        let capture_name = query.capture_names()[tree.root.query_name_index as usize];
        let node_text = std::str::from_utf8(&source_code[tree.root.range.start_byte..tree.root.range.end_byte])
        .expect("[Invalid UTF-8]");
        println!("Name: {}", capture_name);
        println!("Node: {}", node_text);
    }

    tree
    .childrens
    .iter()
    .for_each(|item| {
        binder(&item, query, source_code);
    });
}
