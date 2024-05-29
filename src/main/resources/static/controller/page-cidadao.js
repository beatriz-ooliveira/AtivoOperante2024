document.addEventListener("DOMContentLoaded", function () {
  carregarDenuncias();
});



const token = localStorage.getItem("authToken");
const user = localStorage.getItem("user");
const feedback = document.getElementById("feedback")
const visualizar = document.getElementById("visualizar")

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

// Função para carregar as denúncias da API
function carregarDenuncias() {
  fetch(`http://localhost:8080/apis/cidadao/minhas-denuncias?userEmail=${user}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Authorization': token,
    }
  })
    .then(response => {
      if (response.status === 401) {
        Toast.fire({
          icon: 'info',
          title: 'Token expirado. Por favor, faça o login novamente.'
        });
      }
      return response.json();
    })
    .then(denuncias => {
      preencherTabela(denuncias);
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

// Função para preencher a tabela com as denúncias
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
              <button id="visualizar" class="btn btn-primary" onclick="verDenuncia(${denuncia.id})"><span class="material-symbols-outlined">visibility</span></button>
              <button id="feedback" class="btn btn-primary" onclick="verFeedbackDenuncia(${denuncia.id})"><span class="material-symbols-outlined">feedback</span></button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

function verDenuncia(id) {
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

      const myModal = new bootstrap.Modal(document.getElementById('visualizarDenunciaModal'));
      myModal.show();
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao carregar denúncia. Por favor, tente novamente.');
    });
}


async function abrirModalCadastrarDenuncia() {
  try {
    const orgaosResponse = await fetch('http://localhost:8080/apis/cidadao/listar-orgaos');
    const orgaos = await orgaosResponse.json();
    const tiposResponse = await fetch('http://localhost:8080/apis/cidadao/listar-tipos');
    const tipos = await tiposResponse.json();

    const orgaoSelect = document.getElementById('orgao');
    orgaoSelect.innerHTML += orgaos.map(orgao => `<option value="${orgao.id}">${orgao.nome}</option>`).join('');

    const tipoSelect = document.getElementById('tipo');
    tipoSelect.innerHTML += tipos.map(tipo => `<option value="${tipo.id}">${tipo.nome}</option>`).join('');

    const modal = new bootstrap.Modal(document.getElementById('modalCadastrarDenuncia'));
    modal.show();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

function enviarDenuncia() {
  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;
  const urgencia = document.getElementById("urgencia").value;
  const orgaoId = document.getElementById("orgao").value;
  const tipoId = document.getElementById("tipo").value;
  const data = new Date().toISOString().split('T')[0]; // Obtém a data atual no formato 'YYYY-MM-DD'

  // Verificar se o token está definido
  if (!token) {
    console.error('Token não está definido');
    Toast.fire({
      icon: 'error',
      title: 'Token não encontrado. Por favor, faça login novamente.'
    });
    return;
  }

  // Função para decodificar token
  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  let usuarioId;
  try {
    usuarioId = parseJwt(token).sub; // Pega o ID do usuário a partir do token
  } catch (e) {
    console.error('Erro ao decodificar o token', e);
    Toast.fire({
      icon: 'error',
      title: 'Erro ao processar a autenticação. Por favor, faça login novamente.'
    });
    return;
  }

  const denuncia = {
    titulo: titulo,
    descricao: descricao,
    urgencia: parseInt(urgencia, 10),
    orgaoId: parseInt(orgaoId, 10),
    tipoId: parseInt(tipoId, 10),
    data: data,
    usuarioId: usuarioId
  };

  fetch('http://localhost:8080/apis/cidadao/enviar-denuncias', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(denuncia)
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.message || 'Erro ao enviar denúncia.');
        });
      }
      return response.json();
    })
    .then(data => {
      Toast.fire({
        icon: 'success',
        title: 'Denúncia enviada com sucesso!'
      });
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalCadastrarDenuncia'));
      modal.hide();
      document.getElementById('formCadastrarDenuncia').reset();
      carregarDenuncias();
    })
    .catch(error => {
      console.error('Erro ao enviar denúncia:', error);
      Toast.fire({
        icon: 'error',
        title: error.message || 'Erro ao enviar denúncia.'
      });
    });
}



window.verFeedbackDenuncia = function (id) {
  fetch(`http://localhost:8080/apis/adm/feedback/denuncia/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': token
    }
  })
    .then(response => {
      if (response.status === 404) {
        Toast.fire({
          icon: 'info',
          title: 'Ainda não houve feedback para esta denúncia.'
        });
      }
      return response.json();
    })
    .then(data => {
      const feedbackModal = new bootstrap.Modal(document.getElementById('modalFeedback'), {
        backdrop: 'static',
        keyboard: false
      });
      feedbackModal.show();
      document.getElementById('feedbackDenuncia').value = data.texto;
      document.getElementById('feedbackDenuncia').disabled = true;
    })
}

document.addEventListener('DOMContentLoaded', function () {
  // Adicionando evento de submissão ao formulário para validação
  const form = document.getElementById('formCadastrarDenuncia');
  form.addEventListener('submit', function (event) {
    const titulo = document.getElementById('titulo');
    const descricao = document.getElementById('descricao');

  

    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      enviarDenuncia();
    }

    form.classList.add('was-validated');
  })
})