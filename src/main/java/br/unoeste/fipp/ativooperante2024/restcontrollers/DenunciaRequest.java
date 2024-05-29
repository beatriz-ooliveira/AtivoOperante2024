package br.unoeste.fipp.ativooperante2024.restcontrollers;

import java.time.LocalDate;

public class DenunciaRequest {
    private String titulo;
    private String descricao;
    private int urgencia;
    private long orgaoId;
    private int tipoId;
    private LocalDate data;
    private String usuarioId;

    // Getters and setters

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

    public long getOrgaoId() {
        return orgaoId;
    }

    public void setOrgaoId(long orgaoId) {
        this.orgaoId = orgaoId;
    }

    public int getTipoId() {
        return tipoId;
    }

    public void setTipoId(int tipoId) {
        this.tipoId = tipoId;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public String getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(String usuarioId) {
        this.usuarioId = usuarioId;
    }
}