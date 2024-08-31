import XCTest
import SwiftTreeSitter
import TreeSitterIec61131

final class TreeSitterIec61131Tests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_iec61131())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Iec61131 grammar")
    }
}
