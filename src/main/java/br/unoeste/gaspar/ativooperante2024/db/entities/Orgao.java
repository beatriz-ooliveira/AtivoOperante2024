package br.unoeste.gaspar.ativooperante2024.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="orgaos")
public class Orgao {
    @Id
    @Column(name="org_id")
    private Long id;
    @Column(name="org_nome")
    private String nome;

    public Orgao() {
        this(0L,"");
    }

    public Orgao(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
