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
    })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Feedback não encontrado');
                }
                throw new Error('Erro ao obter feedback');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('feedbackDenuncia').value = data.texto;
            document.getElementById('feedbackDenuncia').disabled = true;
            document.getElementById('btnEnviarFeedback').disabled = true;
        })
        .catch(error => {
            if (error.message === 'Feedback não encontrado') {
                document.getElementById('feedbackDenuncia').value = '';
                document.getElementById('feedbackDenuncia').disabled = false;
                document.getElementById('btnEnviarFeedback').disabled = false;
                Toast.fire({
                    icon: 'info',
                    title: 'Nenhum feedback encontrado. Você pode adicionar um.'
                });
            } else {
                console.error('Erro ao obter feedback:', error);
                Toast.fire({
                    icon: 'error',
                    title: 'Erro ao obter feedback.'
                });
                feedbackModal.hide();
            }
        });

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
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto: feedback })
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
