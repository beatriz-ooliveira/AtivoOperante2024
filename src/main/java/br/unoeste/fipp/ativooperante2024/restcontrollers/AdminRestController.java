package br.unoeste.fipp.ativooperante2024.restcontrollers;

import br.unoeste.fipp.ativooperante2024.db.entities.Denuncia;
import br.unoeste.fipp.ativooperante2024.db.entities.Feedback;
import br.unoeste.fipp.ativooperante2024.db.entities.Orgao;
import br.unoeste.fipp.ativooperante2024.db.entities.Tipo;
import br.unoeste.fipp.ativooperante2024.services.DenunciaService;
import br.unoeste.fipp.ativooperante2024.services.FeedbackService;
import br.unoeste.fipp.ativooperante2024.services.OrgaoService;
import br.unoeste.fipp.ativooperante2024.services.TipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    private FeedbackService feedbackService;

    @GetMapping("teste-conexao")
    public String testeConexao() {
        return "conectado";
    }

    @DeleteMapping("/delete-orgao")
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

    @PutMapping("/alterar-orgao")
    public ResponseEntity<Object> alterarOrgao(@RequestBody Orgao orgao) {
        Orgao orgaoAtualizado = orgaoService.save(orgao);
        return new ResponseEntity<>(orgaoAtualizado, HttpStatus.OK);
    }

    @PostMapping("/add-tipo")
    public ResponseEntity<Object> salvarTipo(@RequestBody Tipo tipo) {
        Tipo novo = tipoService.save(tipo);
        return new ResponseEntity<>(novo, HttpStatus.OK);
    }

    @GetMapping("/listar-problemas")
    public ResponseEntity<List<Tipo>> listarProblemas() {
        List<Tipo> tipos = tipoService.getAll();
        return new ResponseEntity<>(tipos, HttpStatus.OK);
    }

    @DeleteMapping("/excluir-problema")
    public ResponseEntity<Object> excluirProblema(@RequestParam(value = "id") Long id) {
        if (tipoService.delete(id))
            return new ResponseEntity<>("Problema excluído com sucesso.", HttpStatus.OK);
        else
            return new ResponseEntity<>("Erro ao excluir o problema.", HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/editar-problema")
    public ResponseEntity<Object> editarProblema(@RequestBody Tipo tipo) {
        Tipo tipoAtualizado = tipoService.save(tipo);
        return new ResponseEntity<>(tipoAtualizado, HttpStatus.OK);
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
        return new ResponseEntity<>(denuncia, HttpStatus.OK);
    }

    @GetMapping("/get-all-denuncias")
    public ResponseEntity<List<Denuncia>> getAllDenuncias() {
        List<Denuncia> denuncias = denunciaService.getAll();
        return ResponseEntity.ok(denuncias);
    }

    @PutMapping("/editar-denuncia")
    public ResponseEntity<Object> editarDenuncia(@RequestBody Denuncia denuncia) {
        Denuncia denunciaAtualizada = denunciaService.save(denuncia);
        return new ResponseEntity<>(denunciaAtualizada, HttpStatus.OK);
    }

    @DeleteMapping("/delete-denuncia")
    public ResponseEntity<Object> excluirDenuncia(@RequestParam(value = "id") Long id) {
        try {
            // Verificar se existe feedback associado
            Feedback feedback = feedbackService.buscarFeedbackPorDenuncia(new Denuncia(id));
            if (feedback != null) {
                // Excluir feedback
                feedbackService.excluirFeedback(feedback.getId());
            }
            // Excluir denúncia
            if (denunciaService.delete(id)) {
                return new ResponseEntity<>("Denúncia excluída com sucesso.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Erro ao excluir a denúncia.", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Erro ao processar a exclusão.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
