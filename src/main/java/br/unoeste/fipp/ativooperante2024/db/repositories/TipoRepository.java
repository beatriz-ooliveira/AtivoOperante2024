package br.unoeste.fipp.ativooperante2024.db.repositories;

import br.unoeste.fipp.ativooperante2024.db.entities.Tipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TipoRepository extends JpaRepository<Tipo, Long> {

    // Encontre um tipo pelo nome
    Tipo findByNome(String nome);

    // Encontre todos os tipos cujo nome começa com um determinado prefixo
    List<Tipo> findAllByNomeStartingWith(String prefix);

    // Encontre todos os tipos cujo nome contém uma determinada substring
    List<Tipo> findAllByNomeContaining(String substring);

    // Encontre todos os tipos cujo nome termina com uma determinada substring
    List<Tipo> findAllByNomeEndingWith(String substring);

    // Encontre todos os tipos cujo ID seja maior que um valor específico
    List<Tipo> findAllByIdGreaterThan(Long id);

    // Encontre todos os tipos cujo ID seja menor que um valor específico
    List<Tipo> findAllByIdLessThan(Long id);

    // Encontre todos os tipos cujo ID esteja dentro de um intervalo específico
    List<Tipo> findAllByIdBetween(Long startId, Long endId);

    Tipo getById(int tipo);
}
