package com.talentpath.chess.controllers;

import com.talentpath.chess.daos.UserRepository;
import com.talentpath.chess.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @GetMapping("/")
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }


    @GetMapping( "/{id}")
    public User getUserById(@PathVariable Integer id){
        return userRepository.getOne(id);
    }

    @PostMapping( "/")
    public User addUser( @RequestBody User toAdd ){
        return userRepository.saveAndFlush( toAdd );
    }

    @PutMapping( "/")
    public User editUser( @RequestBody User edited ){
        return userRepository.saveAndFlush( edited );
    }

    @DeleteMapping("/{id}")
    public void delete( @PathVariable Integer id ){
        userRepository.deleteById( id );
    }
}
