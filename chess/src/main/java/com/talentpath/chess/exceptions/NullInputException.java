package com.talentpath.chess.exceptions;

public class NullInputException extends Exception {
    public NullInputException(String message){
        super(message);
    }
    public NullInputException(String message, Throwable innerException){
        super(message, innerException);
    }
}
