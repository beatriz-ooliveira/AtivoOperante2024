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

document.addEventListener('DOMContentLoaded', function () {
    window.abrirModalCadastrarOrgao = function () {
        const myModal = new bootstrap.Modal(document.getElementById('modalCadastrarOrgao'));
        myModal.show();
    };

    window.abrirModalListarOrgaos = function () {
        fetchOrgaos();
        localStorage.setItem('authToken', data);
        const myModal = new bootstrap.Modal(document.getElementById('modalListarOrgaos'));
        myModal.show();
    };

    // Função para buscar dados do servidor e preencher as tabelas de órgãos
    function fetchOrgaos() {
        //localStorage.setItem('authToken', data);
        fetch('http://localhost:8080/apis/adm/get-all-orgaos', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        })
        .then(response => response.json())
        .then(data => {
            const tabelaOrgaos = document.getElementById('tabelaOrgaos');
            tabelaOrgaos.innerHTML = '';
            data.forEach(orgao => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${orgao.id}</td>
                    <td><span id="nomeOrgao${orgao.id}">${orgao.nome}</span></td>
                    <td style="padding: 15px 45px;text-align: center;">
                    <button class="btn btn-primary" onclick="editarOrgao(${orgao.id})"><span class="material-symbols-outlined">edit</span></button>
                    <button class="btn btn-danger" onclick="excluirOrgao(${orgao.id})"><span class="material-symbols-outlined">delete</span></button>
                    </td>`;
                tabelaOrgaos.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao buscar órgãos:', error));
    }

    // Função para editar um órgão
    window.editarOrgao = function (orgaoId) {
        const nomeOrgaoSpan = document.getElementById(`nomeOrgao${orgaoId}`);
        const nomeOrgao = nomeOrgaoSpan.innerText;
        nomeOrgaoSpan.innerHTML = `<input type="text" id="inputNomeOrgao${orgaoId}" value="${nomeOrgao}" />`;

        const tdAcoes = nomeOrgaoSpan.parentElement.nextElementSibling;
        tdAcoes.innerHTML = `<button class="btn btn-success" onclick="salvarEdicaoOrgao(${orgaoId})"><span class="material-symbols-outlined">save</span></button>
                            <button class="btn btn-light" onclick="cancelarEdicaoOrgao(${orgaoId}, '${nomeOrgao}')"><span class="material-symbols-outlined">cancel</span></button>`;
    };

    // Função para cancelar a edição de um órgão
    window.cancelarEdicaoOrgao = function (orgaoId, nomeOrgaoAnterior) {
        const nomeOrgaoSpan = document.getElementById(`nomeOrgao${orgaoId}`);
        nomeOrgaoSpan.innerHTML = nomeOrgaoAnterior;

        const tdAcoes = nomeOrgaoSpan.parentElement.nextElementSibling;
        tdAcoes.innerHTML = `<button class="btn btn-primary" onclick="editarOrgao(${orgaoId})"><span class="material-symbols-outlined">edit</span></button>
                            <button class="btn btn-danger" onclick="excluirOrgao(${orgaoId})"><span class="material-symbols-outlined">delete</span></button>`;
    };

    // Função para salvar a edição de um órgão
    window.salvarEdicaoOrgao = function (orgaoId) {
        const novoNome = document.getElementById(`inputNomeOrgao${orgaoId}`).value;
        fetch(`http://localhost:8080/apis/adm/add-orgao?id=${orgaoId}&nome=${novoNome}`, {
            method: 'POST',
            headers: {
                'Authorization': token
            }
        })
        .then(response => {
            if (response.ok) {
                Toast.fire({
                    icon: 'success',
                    title: 'Órgão atualizado com sucesso!'
                });
                fetchOrgaos(); // Atualiza a lista de órgãos após a edição
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Erro ao atualizar órgão.'
                });
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar órgão:', error);
            Toast.fire({
                icon: 'error',
                title: 'Erro ao atualizar órgão.'
            });
        });
    };

    // Função para manipular o formulário de cadastro de órgão
    document.getElementById('formCadastrarOrgao').addEventListener('submit', function (e) {
        e.preventDefault();
        const nomeOrgao = document.getElementById('nomeOrgao').value;
        fetch('http://localhost:8080/apis/adm/add-orgao', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ nome: nomeOrgao })
        })
        .then(response => {
            if (response.ok) {
                Toast.fire({
                    icon: 'success',
                    title: 'Órgão cadastrado com sucesso!'
                });
                document.getElementById('formCadastrarOrgao').reset();
                fetchOrgaos(); // Atualiza a lista de órgãos após o cadastro
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Erro ao cadastrar órgão.'
                });
            }
        })
        .catch(error => {
            console.error('Erro ao cadastrar órgão:', error);
            Toast.fire({
                icon: 'error',
                title: 'Erro ao cadastrar órgão.'
            });
        });
    });

    // Função para excluir um órgão
    window.excluirOrgao = function (orgaoId) {
        if (confirm('Deseja realmente excluir este órgão?')) {
            fetch(`http://localhost:8080/apis/adm/delete-orgao?id=${orgaoId}`, {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            })
            .then(response => {
                if (response.ok) {
                    Toast.fire({
                        icon: 'success',
                        title: 'Órgão excluído com sucesso!'
                    });
                    fetchOrgaos(); // Atualiza a lista de órgãos após a exclusão
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'Erro ao excluir órgão.'
                    });
                }
            })
            .catch(error => {
                console.error('Erro ao excluir órgão:', error);
                Toast.fire({
                    icon: 'error',
                    title: 'Erro ao excluir órgão.'
                });
            });
        }
    };
});