package br.unoeste.fipp.ativooperante2024.restcontrollers;

import br.unoeste.fipp.ativooperante2024.db.entities.Denuncia;
import br.unoeste.fipp.ativooperante2024.db.entities.Feedback;
import br.unoeste.fipp.ativooperante2024.services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/apis/adm/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @Autowired
    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/denuncia/{denunciaId}")
    @ResponseBody
    public Feedback salvarFeedback(@PathVariable Long denunciaId, @RequestParam String texto) {
        // Aqui você deve buscar a denúncia pelo ID (pode ser através do serviço de denúncia)
        Denuncia denuncia = new Denuncia(); // Supondo que você já tenha um serviço de denúncia
        denuncia.setId(denunciaId);
        return feedbackService.salvarFeedback(texto, denuncia);
    }

    @GetMapping("/denuncia/{denunciaId}")
    @ResponseBody
    public ResponseEntity<FeedbackDTO> buscarFeedbackPorDenuncia(@PathVariable Denuncia denunciaId) {
        Feedback feedback = feedbackService.buscarFeedbackPorDenuncia(denunciaId);
        if (feedback == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        FeedbackDTO feedbackDTO = new FeedbackDTO();
        feedbackDTO.setTexto(feedback.getTexto());
        // Outros mapeamentos conforme necessário
        return new ResponseEntity<>(feedbackDTO, HttpStatus.OK);
    }
}
