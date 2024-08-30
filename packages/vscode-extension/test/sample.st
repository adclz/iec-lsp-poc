TYPE
  RATE: (SLOW, FAST);
  // ### This is a struct type
  ENGINE: STRUCT
    // ## SPEED
    SPEED: INT;
    // ## RUN comment
    RUN: BOOL;
    // ## BROKEN comment
    BROKEN: BOOL;
  END_STRUCT
END_TYPE

FUNCTION EngineControl : INT
    VAR
      MYENGINE: ENGINE := (
          SPEED := 0, 
          RUN := FALSE, 
          BROKEN := FALSE
      );
      MYENGINE2: ENGINE := (SPEED := 0, RUN := TRUE, BROKEN := FALSE);
    END_VAR 

    IF TRUE THEN  
      MYENGINE.SPEED := 0;
    END_IF

    MYENGINE2 := jkkk;
    
END_FUNCTION 
