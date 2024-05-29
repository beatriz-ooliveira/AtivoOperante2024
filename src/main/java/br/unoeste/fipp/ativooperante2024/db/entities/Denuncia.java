package br.unoeste.fipp.ativooperante2024.db.entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name="denuncia")
public class Denuncia {

    private static Long proximoId = 2L;


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="den_id")
    private Long Id;
    @Column(name="den_titulo")
    private String titulo;
    @Column(name="den_texto")
    private String texto;
    @Column(name="den_urgencia")
    private int urgencia;
    @Column(name="den_data")
    private LocalDate data;
    @Column(name="den_imagem")
    private String imagem;

    @ManyToOne
    @JoinColumn(name="org_id",nullable = false)
    private Orgao orgao;
    @ManyToOne
    @JoinColumn(name="tip_id",nullable = false)
    private Tipo tipo;
    @ManyToOne
    @JoinColumn(name="usu_id",nullable = false)
    private Usuario usuario;
    @OneToOne(mappedBy = "denuncia")
    private Feedback feedback;

    public Denuncia() {
        this("","",0,null,null,null,null,"");
    }

    public Denuncia(String titulo, String texto, int urgencia, LocalDate data, Orgao orgao, Tipo tipo, Usuario usuario,String imagem) {
        Id = proximoId++;
        this.titulo = titulo;
        this.texto = texto;
        this.urgencia = urgencia;
        this.data = data;
        this.orgao = orgao;
        this.tipo = tipo;
        this.usuario = usuario;
        this.imagem= imagem;
    }

    public Denuncia(Long id, String titulo, String descricao, int urgencia, LocalDate data, String orgaoNome, String tipoNome, String usuarioEmail, String imagemUrl) {
        Id = proximoId++;
        this.titulo = titulo;
        this.texto = texto;
        this.urgencia = urgencia;
        this.data = data;
        this.orgao = orgao;
        this.tipo = tipo;
        this.usuario = usuario;
        this.imagem = imagemUrl != null ? "/imagens/" + imagemUrl : null; // Aqui está a linha corrigida
    }

    public Long getId() {
        return Id;
    }

    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public int getUrgencia() {
        return urgencia;
    }

    public void setUrgencia(int urgencia) {
        this.urgencia = urgencia;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public Orgao getOrgao() {
        return orgao;
    }

    public void setOrgao(Orgao orgao) {
        this.orgao = orgao;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
