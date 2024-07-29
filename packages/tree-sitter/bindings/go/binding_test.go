package tree_sitter_IEC61131_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-IEC61131"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_IEC61131.Language())
	if language == nil {
		t.Errorf("Error loading Iec61131 grammar")
	}
}
