package br.unoeste.fipp.ativooperante2024.restcontrollers;

import br.unoeste.fipp.ativooperante2024.db.entities.Denuncia;
import br.unoeste.fipp.ativooperante2024.db.entities.Orgao;
import br.unoeste.fipp.ativooperante2024.db.entities.Tipo;
import br.unoeste.fipp.ativooperante2024.db.entities.Usuario;
import br.unoeste.fipp.ativooperante2024.db.repositories.DenunciaRepository;
import br.unoeste.fipp.ativooperante2024.db.repositories.OrgaoRepository;
import br.unoeste.fipp.ativooperante2024.db.repositories.TipoRepository;
import br.unoeste.fipp.ativooperante2024.db.repositories.UsuarioRepository;
import br.unoeste.fipp.ativooperante2024.services.OrgaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("apis/cidadao/")
public class CidadaoRestController {

    @Autowired
    DenunciaRepository denunciaRepo;

    @Autowired
    OrgaoService orgaoservice;

    @Autowired
    TipoRepository tipoRepo;

    @Autowired
    UsuarioRepository usuRepo;

    @GetMapping("teste-conexao")
    public String testeConexao() {
        return "Conectado";
    }

    @GetMapping("/listar-orgaos")
    public ResponseEntity<List<Orgao>> listarOrgaos() {
        List<Orgao> orgaos = orgaoservice.getAll();
        return ResponseEntity.ok(orgaos);
    }

    @GetMapping("/listar-tipos")
    public ResponseEntity<List<Tipo>> listarTipos() {
        List<Tipo> tipos = tipoRepo.findAll();
        return ResponseEntity.ok(tipos);
    }

    @PostMapping("/enviar-denuncias")
    public ResponseEntity<DenunciaResponse> enviarDenuncia(@RequestBody DenunciaRequest request) {
        Orgao org = orgaoservice.getById(request.getOrgaoId());
        Tipo tip = tipoRepo.getById(request.getTipoId());
        Usuario usuario = usuRepo.findByEmail(request.getUsuarioId());
        Denuncia den = new Denuncia(request.getTitulo(), request.getDescricao(), request.getUrgencia(), request.getData(), org, tip, usuario);
        Denuncia savedDenuncia = denunciaRepo.save(den);

        savedDenuncia.getOrgao().getNome();
        savedDenuncia.getTipo().getNome();
        savedDenuncia.getUsuario().getEmail();

        DenunciaResponse response = new DenunciaResponse(savedDenuncia);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cadastrar")
    public ResponseEntity<Object> cadastrarUsuario(@RequestBody Usuario usuario) {
        try {
            usuario.setNivel(2); // Nível de cidadão
            usuRepo.save(usuario);
            return new ResponseEntity<>("Usuário cadastrado com sucesso.", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace(); // Log detalhado da exceção
            return new ResponseEntity<>("Erro ao cadastrar o usuário: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/minhas-denuncias")
    public ResponseEntity<Object> listarMinhasDenuncias(@RequestParam(value = "userEmail") String userEmail) {
        // Primeiro, você precisará encontrar o usuário pelo e-mail
        Usuario usuario = usuRepo.findByEmail(userEmail);

        if (usuario != null) {
            // Se o usuário for encontrado, busque as denúncias associadas a ele
            List<Denuncia> denuncias = denunciaRepo.findAllByUsuario(usuario);
            return ResponseEntity.ok(denuncias);
        } else {
            // Se o usuário não for encontrado, retorne uma resposta adequada (por exemplo, 404 Not Found)
            return ResponseEntity.notFound().build();
        }
    }

    // Outros endpoints relacionados ao cidadão podem ser adicionados aqui

}
