const token = localStorage.getItem("authToken");
const excluir = document.getElementById("deletar")
const feedback = document.getElementById("feedback")
const visualizar = document.getElementById("visualizar")

// Função para carregar as denúncias da API
function carregarDenuncias() {
  fetch('http://localhost:8080/apis/adm/get-all-denuncias', {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Authorization': token,
      'Access-Control-Allow-Origin': 'http://localhost:8080',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
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
              <button id="feedback" class="btn btn-primary" onclick="darFeedbackDenuncia(${denuncia.id})"><span class="material-symbols-outlined">feedback</span></button>
              <button id="deletar" class="btn btn-danger" onclick="excluirDenuncia(${denuncia.id})"><span class="material-symbols-outlined">delete</span></button>
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

      var myModal = new bootstrap.Modal(document.getElementById('visualizarDenunciaModal'));
      myModal.show();
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao carregar denúncia. Por favor, tente novamente.');
    });
}

function excluirDenuncia(id) {
  Swal.fire({
    title: "Deseja excluir esta denúncia?",
    text: "Ao excluir a denúncia todos os dados serão perdidos!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, excluir!"
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8080/apis/adm/delete-denuncia?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      })
        .then(response => {
          if (response.ok) {
            Swal.fire({
              title: "Deletada!",
              text: "A denúncia foi excluída com sucesso.",
              icon: "success"
            });
            carregarDenuncias()
          }
          else {
            Toast.fire({
              icon: 'error',
              title: 'Erro ao enviar denúncia.'
            });
          }
        })
      
        
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  carregarDenuncias();
});