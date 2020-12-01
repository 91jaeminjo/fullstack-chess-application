package com.talentpath.chess.models;


import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table( name="users")
public class User {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank       //indicates that an empty string or just spaces or tabs is not valid
    @Column(unique=true)
    private String username;


    @NotBlank
    @Email      //validates this field holds a string that conforms to a valid email
    private String email;

    @NotBlank
    private String password;


    @ManyToMany( fetch = FetchType.EAGER )
    @JoinTable( name = "user_roles",
            joinColumns = @JoinColumn( name = "user_id"),
            //tells Hibernate a that foreign key called user_id should link to id
            inverseJoinColumns = @JoinColumn( name = "role_id" )
            //tells Hibernate that a foreign key called role_id should link to the @Id field of the Role entity
    )
    private Set<Role> roles = new HashSet<>();

    public User() {
    }

    public User(
            @NotBlank String username,
            @NotBlank String email,
            @NotBlank String password ){
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;

        User user = (User) o;

        if (getId() != null ? !getId().equals(user.getId()) : user.getId() != null) return false;
        if (getUsername() != null ? !getUsername().equals(user.getUsername()) : user.getUsername() != null)
            return false;
        if (getEmail() != null ? !getEmail().equals(user.getEmail()) : user.getEmail() != null) return false;
        if (getPassword() != null ? !getPassword().equals(user.getPassword()) : user.getPassword() != null)
            return false;
        return getRoles() != null ? getRoles().equals(user.getRoles()) : user.getRoles() == null;
    }

    @Override
    public int hashCode() {
        int result = getId() != null ? getId().hashCode() : 0;
        result = 31 * result + (getUsername() != null ? getUsername().hashCode() : 0);
        result = 31 * result + (getEmail() != null ? getEmail().hashCode() : 0);
        result = 31 * result + (getPassword() != null ? getPassword().hashCode() : 0);
        result = 31 * result + (getRoles() != null ? getRoles().hashCode() : 0);
        return result;
    }
}
