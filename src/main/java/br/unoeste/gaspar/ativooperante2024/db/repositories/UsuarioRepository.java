package br.unoeste.gaspar.ativooperante2024.db.repositories;

import br.unoeste.gaspar.ativooperante2024.db.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario,Long> {
}
