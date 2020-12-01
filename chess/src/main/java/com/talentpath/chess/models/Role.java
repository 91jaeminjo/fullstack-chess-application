package com.talentpath.chess.models;

import javax.persistence.*;

@Entity
@Table(name="roles")
public class Role {

    @Id //this tells Hibernate this field is involved in the primary key
    @GeneratedValue( strategy= GenerationType.IDENTITY) //tell Hibernate to create this column as a serial
    private Integer id;

    @Enumerated( EnumType.STRING )  //tell Hibernate that the set of allowable values should be constrained
    @Column
    private RoleName name;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public RoleName getName() {
        return name;
    }

    public void setName(RoleName name) {
        this.name = name;
    }

    public Role() {
    }

    public Role(Integer id, RoleName name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Role)) return false;

        Role role = (Role) o;

        if (getId() != null ? !getId().equals(role.getId()) : role.getId() != null) return false;
        return getName() == role.getName();
    }

    @Override
    public int hashCode() {
        int result = getId() != null ? getId().hashCode() : 0;
        result = 31 * result + (getName() != null ? getName().hashCode() : 0);
        return result;
    }

    public enum RoleName {
        ROLE_USER,
        ROLE_ADMIN,
        ROLE_AUTHOR
    }
}
