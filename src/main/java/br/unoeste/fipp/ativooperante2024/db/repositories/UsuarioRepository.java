package br.unoeste.fipp.ativooperante2024.db.repositories;

import br.unoeste.fipp.ativooperante2024.db.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Encontre um usuário pelo CPF
    Usuario findByCpf(Long cpf);

    // Encontre um usuário pelo email
    Usuario findByEmail(String email);

    // Encontre todos os usuários com um determinado nível de acesso
    List<Usuario> findAllByNivel(int nivel);

    // Encontre todos os usuários com um determinado nível de acesso e com um CPF específico
    List<Usuario> findAllByNivelAndCpf(int nivel, Long cpf);

    // Encontre todos os usuários com um determinado nível de acesso e com um email específico
    List<Usuario> findAllByNivelAndEmail(int nivel, String email);

    // Encontre todos os usuários com um determinado nível de acesso e com uma senha específica
    List<Usuario> findAllByNivelAndSenha(int nivel, int senha);

    // Encontre todos os usuários com um determinado nível de acesso e com um CPF e email específicos
    List<Usuario> findAllByNivelAndCpfAndEmail(int nivel, Long cpf, String email);

    // Encontre todos os usuários com um determinado nível de acesso e com um CPF e senha específicos
    List<Usuario> findAllByNivelAndCpfAndSenha(int nivel, Long cpf, int senha);

    // Encontre todos os usuários com um determinado nível de acesso e com um email e senha específicos
    List<Usuario> findAllByNivelAndEmailAndSenha(int nivel, String email, int senha);

    // Encontre todos os usuários com um determinado nível de acesso e com um CPF, email e senha específicos
    List<Usuario> findAllByNivelAndCpfAndEmailAndSenha(int nivel, Long cpf, String email, int senha);

    Usuario findByEmailAndSenha(String email, int senha);
}