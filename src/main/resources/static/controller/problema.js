

document.addEventListener('DOMContentLoaded', function () {
    window.abrirModalCadastrarProblema = function () {
        const myModal = new bootstrap.Modal(document.getElementById('modalCadastrarProblema'));
        myModal.show();
    };

    window.abrirModalListarProblemas = function () {
        fetchProblemas();
        const myModal = new bootstrap.Modal(document.getElementById('modalListarProblemas'));
        myModal.show();
    };

    // Função para buscar dados do servidor e preencher as tabelas de problemas
    function fetchProblemas() {
        var token = localStorage.getItem("authToken");
        fetch('http://localhost:8080/apis/adm/listar-tipos', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        })
        .then(response => response.json())
        .then(data => {

            const tabelaProblemas = document.getElementById('tabelaProblemas');
            tabelaProblemas.innerHTML = '';
            data.forEach(problema => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${problema.id}</td>
                    <td><span id="nomeProblema${problema.id}">${problema.nome}</span></td>
                    <td style="padding: 15px 45px;text-align: center;">
                    <button class="btn btn-primary" onclick="editarProblema(${problema.id})"><span class="material-symbols-outlined">edit</span></button>
                    <button class="btn btn-danger" onclick="excluirProblema(${problema.id})"><span class="material-symbols-outlined">delete</span></button>
                    </td>`;
                tabelaProblemas.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar problemas:', error);
            Toast.fire({
                icon: 'error',
                title: 'Erro ao buscar problemas.'
            });
        });
    }

    // Função para editar um problema
    window.editarProblema = function (problemaId) {
        const nomeProblemaSpan = document.getElementById(`nomeProblema${problemaId}`);
        const nomeProblema = nomeProblemaSpan.innerText;
        nomeProblemaSpan.innerHTML = `<input type="text" id="inputNomeProblema${problemaId}" value="${nomeProblema}" />`;

        const tdAcoes = nomeProblemaSpan.parentElement.nextElementSibling;
        tdAcoes.innerHTML = `<button class="btn btn-success" onclick="salvarEdicaoProblema(${problemaId})"><span class="material-symbols-outlined">save</span></button>
                            <button class="btn btn-light" onclick="cancelarEdicaoProblema(${problemaId}, '${nomeProblema}')"><span class="material-symbols-outlined">cancel</span></button>`;
    };

    // Função para cancelar a edição de um problema
    window.cancelarEdicaoProblema = function (problemaId, nomeProblemaAnterior) {
        const nomeProblemaSpan = document.getElementById(`nomeProblema${problemaId}`);
        nomeProblemaSpan.innerHTML = nomeProblemaAnterior;

        const tdAcoes = nomeProblemaSpan.parentElement.nextElementSibling;
        tdAcoes.innerHTML = `<button class="btn btn-primary" onclick="editarProblema(${problemaId})"><span class="material-symbols-outlined">edit</span></button>
                            <button class="btn btn-danger" onclick="excluirProblema(${problemaId})"><span class="material-symbols-outlined">delete</span></button>`;
    };

    // Função para salvar a edição de um problema
    window.salvarEdicaoProblema = function (problemaId) {
        const novoNome = document.getElementById(`inputNomeProblema${problemaId}`).value;
        fetch(`http://localhost:8080/apis/adm/add-problema?id=${problemaId}&nome=${novoNome}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                Toast.fire({
                    icon: 'success',
                    title: 'Problema atualizado com sucesso!'
                });
                fetchProblemas(); // Atualiza a lista de problemas após a edição
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Erro ao atualizar problema.'
                });
            }
        })
        .catch(error => {
            console.error('Erro ao atualizar problema:', error);
            Toast.fire({
                icon: 'error',
                title: 'Erro ao atualizar problema.'
            });
        });
    };

    // Função para manipular o formulário de cadastro de problema
    document.getElementById('formCadastrarProblema').addEventListener('submit', function (e) {
        e.preventDefault();
        const nomeProblema = document.getElementById('nomeProblema').value;
        fetch('http://localhost:8080/apis/adm/add-tipo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nome: nomeProblema })
        })
        .then(response => {
            if (response.ok) {
                Toast.fire({
                    icon: 'success',
                    title: 'Problema cadastrado com sucesso!'
                });
                document.getElementById('formCadastrarProblema').reset();
            } else {
                Toast.fire({
                    icon: 'error',
                    title: 'Erro ao cadastrar problema.'
                });
            }
        })
        .catch(error => {
            console.error('Erro ao cadastrar problema:', error);
            Toast.fire({
                icon: 'error',
                title: 'Erro ao cadastrar problema.'
            });
        });
    });

    // Função para excluir um problema
    window.excluirProblema = function (problemaId) {
        if (confirm('Deseja realmente excluir este tipo de problema?')) {
            fetch(`http://localhost:8080/apis/adm/delete-problema?id=${problemaId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    Toast.fire({
                        icon: 'success',
                        title: 'Problema excluído com sucesso!'
                    });
                    fetchProblemas(); // Atualiza a lista de problemas após a exclusão
                } else {
                    Toast.fire({
                        icon: 'error',
                        title: 'Erro ao excluir problema.'
                    });
                }
            })
            .catch(error => {
                console.error('Erro ao excluir problema:', error);
                Toast.fire({
                    icon: 'error',
                    title: 'Erro ao excluir problema.'
                });
            });
        }
    };
});
