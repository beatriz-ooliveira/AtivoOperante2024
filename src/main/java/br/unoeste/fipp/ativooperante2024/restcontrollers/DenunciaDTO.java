package br.unoeste.fipp.ativooperante2024.restcontrollers;

import br.unoeste.fipp.ativooperante2024.db.entities.Denuncia;

import java.util.List;

public class DenunciaDTO {
    private List<Denuncia> denuncias;

    public DenunciaDTO(List<Denuncia> denuncias) {
        this.denuncias = denuncias;
    }

    public List<Denuncia> getDenuncias() {
        return denuncias;
    }

    public void setDenuncias(List<Denuncia> denuncias) {
        this.denuncias = denuncias;
    }
}
