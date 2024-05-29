document.addEventListener("DOMContentLoaded", function () {
    carregarDenuncias();
  });
  
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");
  const feedback = document.getElementById("feedback");
  const visualizar = document.getElementById("visualizar");
  
  // Função para carregar as denúncias da API
  function carregarDenuncias() {
    fetch(`http://localhost:8080/apis/cidadao/minhas-denuncias?userEmail=${user}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Adiciona o prefixo 'Bearer' ao token
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
          <button id="visualizar" class="btn btn-primary" onclick="verDenuncia(${denuncia.id})">
            <span class="material-symbols-outlined">visibility</span>
          </button>
          <button id="feedback" class="btn btn-primary" onclick="verFeedbackDenuncia(${denuncia.id})">
            <span class="material-symbols-outlined">feedback</span>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  
  function verDenuncia(id) {
    fetch(`http://localhost:8080/apis/adm/get-denuncia?id=${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`  // Adiciona o prefixo 'Bearer' ao token
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
      orgaoSelect.innerHTML = orgaos.map(orgao => `<option value="${orgao.id}">${orgao.nome}</option>`).join('');
  
      const tipoSelect = document.getElementById('tipo');
      tipoSelect.innerHTML = tipos.map(tipo => `<option value="${tipo.id}">${tipo.nome}</option>`).join('');
  
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
  
    // Função para decodificar token
    function parseJwt(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
    }
  
    const usuarioId = parseJwt(token).sub; // pegue o ID desse email para enviar o ID para o backend
  
    const denuncia = {
      titulo: titulo,
      descricao: descricao,
      urgencia: parseInt(urgencia),
      orgaoId: parseInt(orgaoId),
      tipoId: parseInt(tipoId),
      data: data,
      usuarioId: usuarioId
    };
  
    fetch('http://localhost:8080/apis/cidadao/enviar-denuncias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Adiciona o prefixo 'Bearer' ao token
      },
      body: JSON.stringify(denuncia)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        Swal.fire('Sucesso', 'Denúncia enviada com sucesso!', 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalCadastrarDenuncia'));
        modal.hide();
        document.getElementById('formCadastrarDenuncia').reset();
        carregarDenuncias();  // Recarrega a lista de denúncias após o envio
      })
      .catch(error => {
        console.error('Erro ao enviar denúncia:', error);
        Swal.fire('Erro', 'Houve um problema ao enviar a denúncia.', 'error');
      });
  }
  
  window.verFeedbackDenuncia = function (id) {
    const feedbackModal = new bootstrap.Modal(document.getElementById('modalFeedback'), {
      backdrop: 'static',
      keyboard: false
    });
    feedbackModal.show();
  
    // Verifica se já existe um feedback salvo
    fetch(`http://localhost:8080/apis/adm/feedback/denuncia/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`  // Adiciona o prefixo 'Bearer' ao token
      }
    }).then(response => response.json())
      .then(data => {
        if (data) {
          document.getElementById('feedbackDenuncia').value = data.texto;
          document.getElementById('feedbackDenuncia').disabled = true;
        }
      })
      .catch(error => console.error('Erro ao obter feedback:', error));
  };
  
  // Event listener para o formulário de denúncia
  document.getElementById('formCadastrarDenuncia').addEventListener('submit', function (e) {
    e.preventDefault();
    enviarDenuncia();
  });
  