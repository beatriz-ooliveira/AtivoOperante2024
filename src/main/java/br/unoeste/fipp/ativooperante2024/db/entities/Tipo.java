package br.unoeste.fipp.ativooperante2024.db.entities;

import jakarta.persistence.*;

@Entity
@Table(name="tipo")
public class Tipo {

    private static Long proximoId = 5L;


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="tip_id")
    private Long Id;
    @Column(name="tip_nome")
    private String nome;

    public Tipo() {
        this("");
    }

    public Tipo(String nome) {
        Id = proximoId++;
        this.nome = nome;
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
