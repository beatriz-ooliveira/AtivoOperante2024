package br.unoeste.fipp.ativooperante2024.restcontrollers;

import br.unoeste.fipp.ativooperante2024.db.entities.Denuncia;
import br.unoeste.fipp.ativooperante2024.db.entities.Orgao;
import br.unoeste.fipp.ativooperante2024.db.entities.Tipo;
import br.unoeste.fipp.ativooperante2024.db.entities.Usuario;
import br.unoeste.fipp.ativooperante2024.db.repositories.DenunciaRepository;
import br.unoeste.fipp.ativooperante2024.db.repositories.UsuarioRepository;
import br.unoeste.fipp.ativooperante2024.services.DenunciaService;
import br.unoeste.fipp.ativooperante2024.services.OrgaoService;
import br.unoeste.fipp.ativooperante2024.services.TipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("apis/adm/")
public class AdminRestController {

    @Autowired
    private DenunciaService denunciaService;

    @Autowired
    private OrgaoService orgaoService;

    @Autowired
    private TipoService tipoService;

    @Autowired
    UsuarioRepository usuRepo;

    @Autowired
    private DenunciaRepository denunciaRepo;

    @GetMapping("teste-conexao")
    public String testeConexao() {
        return "conectado";
    }

    @GetMapping("/delete-orgao")
    public ResponseEntity<Object> excluirOrgao(@RequestParam(value = "id") Long id) {
        if (orgaoService.delete(id))
            return new ResponseEntity<>("", HttpStatus.OK);
        else
            return new ResponseEntity<>("", HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/add-orgao")
    public ResponseEntity<Object> salvarOrgao(@RequestBody Orgao orgao) {
        Orgao novo = orgaoService.save(orgao);
        return new ResponseEntity<>(novo, HttpStatus.OK);
    }

    @PostMapping("/add-tipo")
    public ResponseEntity<Object> salvarTipo(@RequestBody Tipo tipo) {
        Tipo novo = tipoService.save(tipo);
        return new ResponseEntity<>(novo, HttpStatus.OK);
    }

    @GetMapping("/listar-tipos")
    public ResponseEntity<Object> listarTipo() {
        return new ResponseEntity<>(tipoService.getAll(), HttpStatus.OK);
    }


    @GetMapping("/get-orgao")
    public ResponseEntity<Object> buscarUmOrgao(@RequestParam(value = "id") Long id) {
        Orgao orgao = orgaoService.getById(id);
        return new ResponseEntity<>(orgao, HttpStatus.OK);
    }

    @GetMapping("/get-all-orgaos")
    public ResponseEntity<Object> buscarTodosOrgaos() {
        return new ResponseEntity<>(orgaoService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/get-denuncia")
    public ResponseEntity<Object> buscarUmaDenuncia(@RequestParam(value = "id") Long id) {
        Denuncia denuncia = denunciaService.getById(id);
        if (denuncia != null) {
            DenunciaResponse denunciaResponse = new DenunciaResponse(
                    denuncia.getId(),
                    denuncia.getTitulo(),
                    denuncia.getTexto(),
                    denuncia.getUrgencia(),
                    denuncia.getData(),
                    denuncia.getOrgao().getNome(),
                    denuncia.getTipo().getNome(),
                    denuncia.getUsuario().getEmail(),
                    denuncia.getImagem()
            );
            return ResponseEntity.ok(denunciaResponse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/get-all-denuncias")
    public ResponseEntity<Object> getAllDenuncias() {
        List<Denuncia> denuncias = denunciaService.getAll();
        if (!denuncias.isEmpty()) {
            List<DenunciaResponse> denunciaResponses = denuncias.stream()
                    .map(denuncia -> new DenunciaResponse(
                            denuncia.getId(),
                            denuncia.getTitulo(),
                            denuncia.getTexto(),
                            denuncia.getUrgencia(),
                            denuncia.getData(),
                            denuncia.getOrgao().getNome(),
                            denuncia.getTipo().getNome(),
                            denuncia.getUsuario().getEmail(),
                            denuncia.getImagem()
                    ))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(denunciaResponses);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/listar-minhas-denuncias")
    public ResponseEntity<Object> listarMinhasDenuncias(@RequestParam(value = "userEmail") String userEmail) {
        Usuario usuario = usuRepo.findByEmail(userEmail);

        if (usuario != null) {
            List<Denuncia> denuncias = denunciaRepo.findAllByUsuario(usuario);
            List<DenunciaResponse> denunciaResponses = denuncias.stream()
                    .map(denuncia -> new DenunciaResponse(
                            denuncia.getId(),
                            denuncia.getTitulo(),
                            denuncia.getTexto(),
                            denuncia.getUrgencia(),
                            denuncia.getData(),
                            denuncia.getOrgao().getNome(),
                            denuncia.getTipo().getNome(),
                            denuncia.getUsuario().getEmail(),
                            denuncia.getImagem()
                    ))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(denunciaResponses);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/editar-denuncia")
    public ResponseEntity<Object> editarDenuncia(@RequestBody Denuncia denuncia) {
        Denuncia denunciaAtualizada = denunciaService.save(denuncia);
        return new ResponseEntity<>(denunciaAtualizada, HttpStatus.OK);
    }

    @DeleteMapping("/delete-denuncia")
    public ResponseEntity<Object> excluirDenuncia(@RequestParam(value = "id") Long id) {
        if (denunciaService.delete(id)) {
            return new ResponseEntity<>("Denúncia excluída com sucesso.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Erro ao excluir a denúncia.", HttpStatus.BAD_REQUEST);
        }
    }

}
