package com.talentpath.chess.exceptions;

public class ChessDaoException extends Exception {
    public ChessDaoException (String message){
        super(message);
    }
    public ChessDaoException (String message, Throwable innerException){
        super(message, innerException);
    }
}
