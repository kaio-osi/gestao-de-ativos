const camposIds = ['estacao', 'serie', 'marca', 'modelo', 'usuario', 'empresa', 'setor'];

function adicionarItem() {
    const dados = {};
    let erro = false;

    camposIds.forEach(id => {
        const el = document.getElementById(id);
        const valor = el.value.trim();
        if (!valor) {
            el.style.borderColor = "var(--danger)";
            erro = true;
        } else {
            el.style.borderColor = "#cbd5e1";
            dados[id] = valor;
        }
    });

    if (erro) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    dados.status = document.getElementById('status').value;

    const tabela = document.getElementById('listaEstoque');
    const novaLinha = tabela.insertRow();
    renderizarLinha(novaLinha, dados);
    limparCampos();
    atualizarContador();
}

function renderizarLinha(linha, dados) {
    const classeStatus = dados.status === 'Estoque' ? 'status-estoque' : 'status-uso';
    linha.innerHTML = `
        <td>${dados.estacao}</td>
        <td>${dados.serie}</td>
        <td>${dados.marca}</td>
        <td>${dados.modelo}</td>
        <td>${dados.usuario}</td>
        <td>${dados.empresa}</td>
        <td>${dados.setor}</td>
        <td><span class="badge ${classeStatus}">${dados.status}</span></td>
        <td><button class="btn-edit" onclick="editarLinha(this)">Editar</button></td>
    `;
}

function editarLinha(botao) {
    const linha = botao.parentNode.parentNode;
    const celulas = linha.getElementsByTagName('td');
    
    // Captura valores atuais
    const valores = Array.from(celulas).slice(0, 7).map(td => td.innerText);
    const statusAtual = celulas[7].innerText.trim();

    linha.innerHTML = `
        <td><input type="text" value="${valores[0]}" class="input-edit"></td>
        <td><input type="text" value="${valores[1]}" class="input-edit"></td>
        <td><input type="text" value="${valores[2]}" class="input-edit"></td>
        <td><input type="text" value="${valores[3]}" class="input-edit"></td>
        <td><input type="text" value="${valores[4]}" class="input-edit"></td>
        <td><input type="text" value="${valores[5]}" class="input-edit"></td>
        <td><input type="text" value="${valores[6]}" class="input-edit"></td>
        <td>
            <select class="input-edit">
                <option value="Em Uso" ${statusAtual === 'Em Uso' ? 'selected' : ''}>Em Uso</option>
                <option value="Estoque" ${statusAtual === 'Estoque' ? 'selected' : ''}>Estoque</option>
            </select>
        </td>
        <td><button class="btn-save" onclick="salvarEdicao(this)">Salvar</button></td>
    `;
}

function salvarEdicao(botao) {
    const linha = botao.parentNode.parentNode;
    const inputs = linha.getElementsByTagName('input');
    const select = linha.getElementsByTagName('select')[0];

    for(let input of inputs) {
        if(!input.value.trim()) {
            alert("Os campos não podem ficar vazios.");
            return;
        }
    }

    const novosDados = {
        estacao: inputs[0].value,
        serie: inputs[1].value,
        marca: inputs[2].value,
        modelo: inputs[3].value,
        usuario: inputs[4].value,
        empresa: inputs[5].value,
        setor: inputs[6].value,
        status: select.value
    };

    renderizarLinha(linha, novosDados);
    atualizarContador();
}

function limparCampos() {
    camposIds.forEach(id => document.getElementById(id).value = '');
}

function atualizarContador() {
    document.getElementById('totalCount').innerText = document.querySelectorAll('#listaEstoque tr').length;
}

function filtrarTabela() {
    const filter = document.getElementById("filtroGeral").value.toUpperCase();
    const tr = document.getElementById("listaEstoque").getElementsByTagName("tr");
    for (let i = 0; i < tr.length; i++) {
        tr[i].style.display = tr[i].innerText.toUpperCase().includes(filter) ? "" : "none";
    }
}