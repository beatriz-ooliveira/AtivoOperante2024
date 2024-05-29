package br.unoeste.fipp.ativooperante2024.restcontrollers;

import br.unoeste.fipp.ativooperante2024.db.entities.Denuncia;

import java.time.LocalDate;

public class DenunciaResponse {
    private Long id;
    private String titulo;
    private String descricao;
    private int urgencia;
    private String orgaoNome;
    private String tipoNome;
    private String usuarioEmail;
    private String imagemUrl;
    private LocalDate data;

    public DenunciaResponse(Long id, String titulo, String descricao, int urgencia, LocalDate data, String orgaoNome, String tipoNome, String usuarioEmail, String imagemUrl) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.urgencia = urgencia;
        this.data = data;
        this.orgaoNome = orgaoNome;
        this.tipoNome = tipoNome;
        this.usuarioEmail = usuarioEmail;
        this.imagemUrl = imagemUrl != null ? "/imagens/" + imagemUrl : null; // Aqui está a linha corrigida
    }


    public DenunciaResponse(Denuncia denuncia) {
        this.id = denuncia.getId();
        this.titulo = denuncia.getTitulo();
        this.descricao = denuncia.getTexto();
        this.urgencia = denuncia.getUrgencia();
        this.data = denuncia.getData();
        this.orgaoNome = denuncia.getOrgao().getNome();
        this.tipoNome = denuncia.getTipo().getNome();
        this.usuarioEmail = denuncia.getUsuario().getEmail();
        this.imagemUrl = denuncia.getImagem();
    }

    // Getters e setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public int getUrgencia() {
        return urgencia;
    }

    public void setUrgencia(int urgencia) {
        this.urgencia = urgencia;
    }

    public String getOrgaoNome() {
        return orgaoNome;
    }

    public void setOrgaoNome(String orgaoNome) {
        this.orgaoNome = orgaoNome;
    }

    public String getTipoNome() {
        return tipoNome;
    }

    public void setTipoNome(String tipoNome) {
        this.tipoNome = tipoNome;
    }

    public String getUsuarioEmail() {
        return usuarioEmail;
    }

    public void setUsuarioEmail(String usuarioEmail) {
        this.usuarioEmail = usuarioEmail;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }
}
