const token = localStorage.getItem("authToken");

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
        <img src="http://localhost:8080/${denuncia.imagem}" alt="Imagem da Denúncia" style="width: 100px; height: auto;">
            </td>
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
    text: "Ao excluir a denúncia todos os dados serão perdidos",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sim, desejo excluir!",
    cancelButtonText: "Cancelar"
  }).then(result => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8080/apis/adm/delete-denuncia?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Erro ao excluir denúncia: ' + response.statusText);
            }
            Swal.fire("Excluído!", "A denúncia foi excluída com sucesso.", "success")
                .then(() => location.reload());
          })
          .catch(error => {
            console.error('Erro:', error);
            Swal.fire("Erro!", "Erro ao excluir denúncia. Por favor, tente novamente.", "error");
          });
    }
  });
}

// Carrega as denúncias ao carregar a página
window.onload = carregarDenuncias;
