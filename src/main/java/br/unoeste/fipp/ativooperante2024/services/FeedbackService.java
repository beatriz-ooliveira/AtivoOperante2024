package br.unoeste.fipp.ativooperante2024.services;

import br.unoeste.fipp.ativooperante2024.db.entities.Denuncia;
import br.unoeste.fipp.ativooperante2024.db.entities.Feedback;
import br.unoeste.fipp.ativooperante2024.db.repositories.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    @Autowired
    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }


    public void excluirFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }
    public Feedback salvarFeedback(String texto, Denuncia denuncia) {
        Feedback feedback = new Feedback(texto, denuncia);
        return feedbackRepository.save(feedback);
    }

    public Feedback buscarFeedbackPorDenuncia(Denuncia denuncia) {
        return feedbackRepository.findByDenuncia(denuncia);
    }
}
