package br.unoeste.fipp.ativooperante2024.db.repositories;

import br.unoeste.fipp.ativooperante2024.db.entities.Denuncia;
import br.unoeste.fipp.ativooperante2024.db.entities.Orgao;
import br.unoeste.fipp.ativooperante2024.db.entities.Tipo;
import br.unoeste.fipp.ativooperante2024.db.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface DenunciaRepository extends JpaRepository<Denuncia, Long> {

    // Encontre todas as denúncias associadas a um usuário específico
    List<Denuncia> findAllByUsuario(Usuario usuario);

    // Encontre todas as denúncias associadas a um órgão específico
    List<Denuncia> findAllByOrgao(Orgao orgao);

    // Encontre todas as denúncias associadas a um tipo específico
    List<Denuncia> findAllByTipo(Tipo tipo);

    // Encontre todas as denúncias com uma determinada urgência
    List<Denuncia> findAllByUrgencia(int urgencia);

    // Encontre todas as denúncias com uma data posterior a uma determinada data
    List<Denuncia> findAllByDataAfter(LocalDate data);

    // Encontre todas as denúncias com um determinado título
    List<Denuncia> findAllByTituloContaining(String titulo);

    // Encontre todas as denúncias com um determinado texto
    List<Denuncia> findAllByTextoContaining(String texto);

    // Encontre todas as denúncias com um determinado título e texto
    List<Denuncia> findAllByTituloContainingAndTextoContaining(String titulo, String texto);

    // Encontre todas as denúncias com um determinado título e associadas a um usuário específico
    List<Denuncia> findAllByTituloContainingAndUsuario(String titulo, Usuario usuario);

    // Encontre todas as denúncias com um determinado título e associadas a um órgão específico
    List<Denuncia> findAllByTituloContainingAndOrgao(String titulo, Orgao orgao);

    // Encontre todas as denúncias com um determinado título e associadas a um tipo específico
    List<Denuncia> findAllByTituloContainingAndTipo(String titulo, Tipo tipo);

    // Encontre todas as denúncias com um determinado título e associadas a uma urgência específica
    List<Denuncia> findAllByTituloContainingAndUrgencia(String titulo, int urgencia);

    // Encontre todas as denúncias com um determinado título e data posterior a uma determinada data
    List<Denuncia> findAllByTituloContainingAndDataAfter(String titulo, LocalDate data);

    // Encontre todas as denúncias com um determinado texto e associadas a um usuário específico
    List<Denuncia> findAllByTextoContainingAndUsuario(String texto, Usuario usuario);

    // Encontre todas as denúncias com um determinado texto e associadas a um órgão específico
    List<Denuncia> findAllByTextoContainingAndOrgao(String texto, Orgao orgao);

    // Encontre todas as denúncias com um determinado texto e associadas a um tipo específico
    List<Denuncia> findAllByTextoContainingAndTipo(String texto, Tipo tipo);

    // Encontre todas as denúncias com um determinado texto e associadas a uma urgência específica
    List<Denuncia> findAllByTextoContainingAndUrgencia(String texto, int urgencia);

    // Encontre todas as denúncias com um determinado texto e data posterior a uma determinada data
    List<Denuncia> findAllByTextoContainingAndDataAfter(String texto, LocalDate data);

}
