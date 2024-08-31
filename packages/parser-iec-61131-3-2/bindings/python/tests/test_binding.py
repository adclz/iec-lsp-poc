from unittest import TestCase

import tree_sitter, tree_sitter_iec61131


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            tree_sitter.Language(tree_sitter_iec61131.language())
        except Exception:
            self.fail("Error loading Iec61131 grammar")
