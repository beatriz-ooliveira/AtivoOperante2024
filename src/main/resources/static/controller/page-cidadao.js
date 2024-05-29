document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('formCadastrarDenuncia');
    if (form) {
        form.addEventListener('submit', enviarDenuncia);
    }
    carregarDenuncias();
});


function enviarDenuncia(event) {
    event.preventDefault();
    const token = localStorage.getItem("authToken");

    const formData = new FormData(event.target);
    formData.append('usuarioId', localStorage.getItem("user"));
    formData.append('data', new Date().toISOString().split('T')[0]); // Adiciona a data atual

    fetch("http://localhost:8080/apis/cidadao/enviar-denuncias", {
        method: 'POST',
        headers: {
            'Authorization': token
        },
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error('Erro ao enviar denúncia: ' + text);
                });
            }
            return response.json();
        })
        .then(data => {
            Swal.fire('Sucesso', 'Denúncia enviada com sucesso!', 'success');
            document.getElementById('formCadastrarDenuncia').reset();
            var myModalEl = document.getElementById('modalCadastrarDenuncia');
            var modal = bootstrap.Modal.getInstance(myModalEl);
            modal.hide();
        })
        .catch(error => {
            console.error('Erro ao enviar denúncia:', error);
            Swal.fire('Erro', 'Houve um problema ao enviar a denúncia: ' + error.message, 'error');
        });
}

function carregarDenuncias() {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    fetch(`http://localhost:8080/apis/cidadao/minhas-denuncias?userEmail=${user}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': token,
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar denúncias: ' + response.statusText);
            }
            return response.json();
        })
        .then(denuncias => {
            preencherTabela(denuncias);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar denúncias. Por favor, tente novamente.');
        });
}
function preencherTabela(denuncias) {
    const tbody = document.querySelector(".minha-tabela tbody");
    tbody.innerHTML = ""; // Limpa o conteúdo atual da tabela

    denuncias.forEach(function (denuncia) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${denuncia.titulo}</td>
            <td>${denuncia.texto}</td>
            <td>${denuncia.urgencia}</td>
            <td>${new Date(denuncia.data).toLocaleDateString()}</td>
            <td>
                <img src="${denuncia.imagemUrl}" alt="Imagem da Denúncia" style="width: 100px; height: auto;">
            </td>
            <td>
                <button id="visualizar" class="btn btn-primary" onclick="verDenuncia(${denuncia.id})"><span class="material-symbols-outlined">visibility</span></button>
                <button id="feedback" class="btn btn-primary" onclick="verFeedbackDenuncia(${denuncia.id})"><span class="material-symbols-outlined">feedback</span></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function verDenuncia(id) {
    const token = localStorage.getItem("authToken");

    fetch(`http://localhost:8080/apis/adm/get-denuncia?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar denúncia: ' + response.statusText);
            }
            return response.json();
        })
        .then(denuncia => {
            document.getElementById('denunciaId').textContent = denuncia.id;
            document.getElementById('denunciaTitulo').textContent = denuncia.titulo;
            document.getElementById('denunciaDescricao').textContent = denuncia.texto;
            document.getElementById('denunciaData').textContent = new Date(denuncia.data).toLocaleDateString();
            document.getElementById('denunciaOrgao').textContent = denuncia.orgao.nome;
            document.getElementById('denunciaTipo').textContent = denuncia.tipo.nome;
            document.getElementById('denunciaUrgencia').textContent = denuncia.urgencia;
            document.getElementById('denunciaUsuario').textContent = `${denuncia.usuario.email} (CPF: ${denuncia.usuario.cpf})`;

            var myModal = new bootstrap.Modal(document.getElementById('visualizarDenunciaModal'));
            myModal.show();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar denúncia. Por favor, tente novamente.');
        });
}

async function abrirModalCadastrarDenuncia() {
    const token = localStorage.getItem("authToken");

    try {
        const orgaosResponse = await fetch('http://localhost:8080/apis/cidadao/listar-orgaos', {
            headers: {
                'Authorization': token
            }
        });
        const orgaos = await orgaosResponse.json();

        const tiposResponse = await fetch('http://localhost:8080/apis/cidadao/listar-tipos', {
            headers: {
                'Authorization': token
            }
        });
        const tipos = await tiposResponse.json();

        const orgaoSelect = document.getElementById('orgao');
        orgaoSelect.innerHTML = orgaos.map(orgao => `<option value="${orgao.id}">${orgao.nome}</option>`).join('');

        const tipoSelect = document.getElementById('tipo');
        tipoSelect.innerHTML = tipos.map(tipo => `<option value="${tipo.id}">${tipo.nome}</option>`).join('');

        const modal = new bootstrap.Modal(document.getElementById('modalCadastrarDenuncia'));
        modal.show();
    } catch (error) {
        console.error('Erro ao abrir modal de cadastro de denúncia:', error);
        Swal.fire('Erro', 'Houve um problema ao carregar os dados para cadastro de denúncia.', 'error');
    }
}

function verFeedbackDenuncia(id) {
    const token = localStorage.getItem("authToken");

    fetch(`http://localhost:8080/apis/cidadao/get-feedback?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar feedback: ' + response.statusText);
            }
            return response.json();
        })
        .then(feedback => {
            document.getElementById('feedbackTitulo').textContent = feedback.denuncia.titulo;
            document.getElementById('feedbackDescricao').textContent = feedback.denuncia.texto;
            document.getElementById('feedbackResposta').textContent = feedback.resposta;

            var myModal = new bootstrap.Modal(document.getElementById('visualizarFeedbackModal'));
            myModal.show();
        })
        .catch(error => {
            console.error('Erro:', error);
            Swal.fire('Erro', 'Houve um problema ao carregar o feedback.', 'error');
        });
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("formCadastrarDenuncia").addEventListener("submit", enviarDenuncia);
});