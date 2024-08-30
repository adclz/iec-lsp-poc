; Type declarations

(type_declaration) @type

; Simple type

(simple_spec_init
  (simple_specification) @lazy.type) ; lazy the simple type declaration

(simple_type_declaration   
	(simple_type_name) @name)    
; Enum

(enumerated_spec_init) @enum
(enumerated_type_name) @name
          
(enumerated_value) @enumMember

; Structure type

(structure_type_declaration 
	(structure_type_name) @name)
    
(structure_declaration) @struct 
(structure_element_declaration
	((structure_element_name) @name)) @field  
    
(initialized_structure
	(structure_type_name) @lazy.type)
    
(structure_initialization) @signature  
(structure_element_initialization
 	(structure_element_name) @lazy.reference)

; Array type

(array_spec_init) @array
(array_type_name) @name

(subrange
	  . (signed_integer) @array.min
    ".."
    . (signed_integer) @array.max)
    
(non_generic_type_name) @lazy.type ; OF Type

(array_initialization) @fill
(array_initial_element) @fill.value

; Function

(function_declaration
  (derived_function_name) @name
  . (_) @lazy.type) @function

; Function block

(function_block_declaration
  (derived_function_block_name) @name) @function

; Variable fields

(var2_init_decl) @variable

(var1_list
 (variable_name)) @name

; ST

(symbolic_variable
 (variable_name)) @lazy.reference ; single element reference
(multi_element_variable) @lazy.reference.multi ; multi elements reference
(field_selector) @lazy.reference ; field part of a multi elements referenc

; Fn invocation

(fb_invocation
	(fb_name)@name) @invocation

(param_assignment) @parameter

; Expressions

(expression) @expression
[
  (add_operator) 
  (multiply_operator) 
  (comparison_operator) 
  "=" "<>" "&" "AND" "OR" "XOR"
] @operator
 
(constant) @value

; Assign

(assignment_statement) @assign
