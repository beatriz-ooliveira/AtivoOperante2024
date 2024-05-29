package br.unoeste.fipp.ativooperante2024.db.repositories;

import br.unoeste.fipp.ativooperante2024.db.entities.Orgao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrgaoRepository extends JpaRepository<Orgao, Long> {

    // Encontre um órgão pelo nome
    Orgao findByNome(String nome);

    // Encontre todos os órgãos cujo nome começa com um determinado prefixo
    List<Orgao> findAllByNomeStartingWith(String prefix);

    // Encontre todos os órgãos cujo nome contém uma determinada substring
    List<Orgao> findAllByNomeContaining(String substring);

    // Encontre todos os órgãos cujo nome termina com uma determinada substring
    List<Orgao> findAllByNomeEndingWith(String substring);

    // Encontre todos os órgãos cujo ID seja maior que um valor específico
    List<Orgao> findAllByIdGreaterThan(Long id);

    // Encontre todos os órgãos cujo ID seja menor que um valor específico
    List<Orgao> findAllByIdLessThan(Long id);

    // Encontre todos os órgãos cujo ID esteja dentro de um intervalo específico
    List<Orgao> findAllByIdBetween(Long startId, Long endId);

}
