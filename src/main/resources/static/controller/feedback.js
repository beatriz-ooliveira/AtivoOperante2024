window.darFeedbackDenuncia = function (id) {
    const feedbackModal = new bootstrap.Modal(document.getElementById('modalFeedback'), {
        backdrop: 'static',
        keyboard: false
    });
    feedbackModal.show();

    // Verifica se já existe um feedback salvo
    fetch(`http://localhost:8080/apis/adm/feedback/denuncia/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    }).then(response => response.json())
        .then(data => {
            if (data) {
                document.getElementById('feedbackDenuncia').value = data.texto;
                document.getElementById('feedbackDenuncia').disabled = true;
                document.getElementById('btnEnviarFeedback').disabled = true;
            }
        })
        .catch(error => console.error('Erro ao obter feedback:', error));

    document.getElementById('btnEnviarFeedback').addEventListener('click', function () {
        const feedback = document.getElementById('feedbackDenuncia').value;
        if (feedback.trim() === '') {
            Toast.fire({
                icon: 'warning',
                title: 'Por favor, insira um feedback.'
            });
            return;
        }

        fetch(`http://localhost:8080/apis/adm/feedback/denuncia/${id}?texto=${feedback}`, {
            method: 'POST',
            headers: {
                'Authorization': token
            }
        })
        .then(response => {
            if (response.ok) {
                Toast.fire({
                    icon: 'success',
                    title: 'Feedback enviado com sucesso!'
                });
                feedbackModal.hide();
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Erro ao enviar feedback.'
                });
            }
        })
        .catch(error => {
            console.error('Erro ao enviar feedback:', error);
            Toast.fire({
                icon: 'error',
                title: 'Erro ao enviar feedback.'
            });
        });
    });
};

