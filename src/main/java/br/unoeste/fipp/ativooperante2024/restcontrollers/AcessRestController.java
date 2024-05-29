package br.unoeste.fipp.ativooperante2024.restcontrollers;

import br.unoeste.fipp.ativooperante2024.db.entities.Usuario;
import br.unoeste.fipp.ativooperante2024.security.JWTTokenProvider;
import br.unoeste.fipp.ativooperante2024.services.UsuarioService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("apis/security/")
public class AcessRestController {

    @Autowired
    private UsuarioService userService; // Supondo que você tenha um serviço de usuário
    @PostMapping("logar/")
    public ResponseEntity<Object> logar(@RequestBody Usuario usuario) {
        // Verifica se o usuário existe no banco de dados
        Usuario userFromDb = userService.findUserByEmail(usuario.getEmail());

        if (userFromDb == null) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }

        // Verifica se a senha está correta
        if (!String.valueOf(userFromDb.getSenha()).equals(String.valueOf(usuario.getSenha()))) {
            return ResponseEntity.badRequest().body("Senha incorreta");
        }

        // Se chegou aqui, o usuário foi autenticado com sucesso, então podemos gerar o token JWT
        String token = JWTTokenProvider.getToken(userFromDb.getEmail(), String.valueOf(userFromDb.getNivel()));
        return ResponseEntity.ok(token);
    }
    //nivel
    @GetMapping("verificar-papel/")
    public ResponseEntity<Object> verificarPapelUsuario(@RequestHeader("Authorization") String token) {
        if (token == null || !JWTTokenProvider.verifyToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido");
        }

        // Decodificar o token JWT para obter as informações do usuário, como seu papel
        Claims claims = JWTTokenProvider.decodeJWT(token);
        String papel = (String) claims.get("nivel");

        // Retornar o papel do usuário
        return ResponseEntity.ok(papel);
    }

}