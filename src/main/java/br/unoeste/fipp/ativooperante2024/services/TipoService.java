package br.unoeste.fipp.ativooperante2024.services;

import br.unoeste.fipp.ativooperante2024.db.entities.Tipo;
import br.unoeste.fipp.ativooperante2024.db.repositories.TipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipoService {

    @Autowired
    private TipoRepository tipoRepository;

    public Tipo save(Tipo tipo) {
        return tipoRepository.save(tipo);
    }

    public Tipo getById(Long id) {
        Optional<Tipo> optionalTipo = tipoRepository.findById(id);
        return optionalTipo.orElse(null);
    }

    public List<Tipo> getAll() {
        return tipoRepository.findAll();
    }

    public boolean delete(Long id) {
        try {
            tipoRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
