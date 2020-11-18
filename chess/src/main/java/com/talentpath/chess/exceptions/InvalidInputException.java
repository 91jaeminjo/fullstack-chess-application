package com.talentpath.chess.exceptions;

public class InvalidInputException extends Exception {
    public InvalidInputException(String message){
        super(message);
    }
    public InvalidInputException(String message, Throwable innerException){
        super(message, innerException);
    }
}
