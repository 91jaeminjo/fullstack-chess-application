package com.talentpath.chess.controllers;

import com.github.bhlangonijr.chesslib.move.MoveGeneratorException;
import com.talentpath.chess.exceptions.InvalidInputException;
import com.talentpath.chess.exceptions.NullInputException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class ExceptionController {

    @ExceptionHandler ( value = NullInputException.class )
    @ResponseStatus ( code = HttpStatus.BAD_REQUEST)
    public String nullInput(NullInputException ex, WebRequest request){
        return request.toString() +" Internal Exception Message: "+ ex.getMessage();
    }

    @ExceptionHandler ( value = InvalidInputException.class)
    @ResponseStatus ( code = HttpStatus.BAD_REQUEST )
    public String invalidInput(InvalidInputException ex, WebRequest request){
        return request.toString() +" Internal Exception Message: "+ ex.getMessage();
    }

    @ExceptionHandler ( value = MoveGeneratorException.class)
    @ResponseStatus ( code = HttpStatus.INTERNAL_SERVER_ERROR)
    public String errorInPostgres(MoveGeneratorException ex, WebRequest request){
        return request.toString() +" Internal Exception Message: "+ ex.getMessage();

    }
}
