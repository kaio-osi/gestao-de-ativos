const camposIds = ['estacao', 'serie', 'fabricante', 'modelo', 'usuario', 'empresa', 'setor'];
const empresasFixas = ["Agile Assistência", "Agile Connect", "Antena Centro Automotivo", "Antena Tecnologia", "Coonecta", "Global Group"];

function atualizarNomeArquivo(input) {
    const label = document.getElementById('label-termo');
    if (input && input.files && input.files.length > 0) {
        const nome = input.files[0].name;
        label.innerText = nome.length > 20 ? nome.substring(0, 17) + "..." : nome;
        label.style.borderColor = "var(--success)";
        label.style.color = "var(--success)";
    } else {
        label.innerText = "Selecionar Termo";
        label.style.borderColor = "var(--border)";
        label.style.color = "#64748b";
    }
}

function adicionarItem() {
    const dados = {};
    let erro = false;

    camposIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el.value || !el.value.trim()) {
            el.style.borderLeft = "4px solid var(--danger)";
            erro = true;
        } else {
            el.style.borderLeft = "1px solid var(--border)";
            dados[id] = el.value.trim();
        }
    });

    if (erro) return;

    dados.status = document.getElementById('status').value;
    const fileInput = document.getElementById('termo');
    dados.termo = fileInput.files.length > 0 ? fileInput.files[0].name : "---";

    const tabela = document.getElementById('listaEstoque');
    const novaLinha = tabela.insertRow();
    renderizarLinha(novaLinha, dados);
    
    limparCampos();
    atualizarContador();
}

function renderizarLinha(linha, dados) {
    linha.innerHTML = `
        <td>${dados.estacao}</td>
        <td>${dados.serie}</td>
        <td>${dados.fabricante}</td>
        <td>${dados.modelo}</td>
        <td>${dados.usuario}</td>
        <td>${dados.empresa}</td>
        <td>${dados.setor}</td>
        <td class="status-cell">${dados.status}</td>
        <td title="${dados.termo}">${dados.termo !== "---" ? "Arquivo" : "---"}</td>
        <td>
            <button class="btn-edit" onclick="editarLinha(this)">Editar</button>
            <button class="btn-delete" onclick="excluirLinha(this)">Excluir</button>
        </td>
    `;
    aplicarCoresStatus(linha);
}

function editarLinha(botao) {
    const linha = botao.closest('tr');
    const celulas = linha.cells;
    
    const dadosAtuais = {
        estacao: celulas[0].innerText,
        serie: celulas[1].innerText,
        fabricante: celulas[2].innerText,
        modelo: celulas[3].innerText,
        usuario: celulas[4].innerText,
        empresa: celulas[5].innerText,
        setor: celulas[6].innerText,
        status: celulas[7].innerText.trim(),
        termo: celulas[8].getAttribute('title')
    };

    const optionsEmpresa = empresasFixas.map(emp => 
        `<option value="${emp}" ${dadosAtuais.empresa === emp ? 'selected' : ''}>${emp}</option>`
    ).join('');

    linha.innerHTML = `
        <td><input type="text" value="${dadosAtuais.estacao}" class="input-edit-tabela"></td>
        <td><input type="text" value="${dadosAtuais.serie}" class="input-edit-tabela"></td>
        <td><input type="text" value="${dadosAtuais.fabricante}" class="input-edit-tabela"></td>
        <td><input type="text" value="${dadosAtuais.modelo}" class="input-edit-tabela"></td>
        <td><input type="text" value="${dadosAtuais.usuario}" class="input-edit-tabela"></td>
        <td><select class="input-edit-tabela">${optionsEmpresa}</select></td>
        <td><input type="text" value="${dadosAtuais.setor}" class="input-edit-tabela"></td>
        <td>
            <select class="input-edit-tabela">
                <option value="Em Uso" ${dadosAtuais.status === 'Em Uso' ? 'selected' : ''}>Em Uso</option>
                <option value="Estoque" ${dadosAtuais.status === 'Estoque' ? 'selected' : ''}>Estoque</option>
            </select>
        </td>
        <td title="${dadosAtuais.termo}">${dadosAtuais.termo !== "---" ? "Arquivo" : "---"}</td>
        <td>
            <button class="btn-save" onclick="salvarEdicao(this)">Salvar</button>
            <button class="btn-delete" onclick="cancelarEdicao(this, ${JSON.stringify(dadosAtuais).replace(/"/g, '&quot;')})">Sair</button>
        </td>
    `;
}

function salvarEdicao(botao) {
    const linha = botao.closest('tr');
    const inputs = linha.querySelectorAll('.input-edit-tabela');
    const novosDados = {
        estacao: inputs[0].value.trim(),
        serie: inputs[1].value.trim(),
        fabricante: inputs[2].value.trim(),
        modelo: inputs[3].value.trim(),
        usuario: inputs[4].value.trim(),
        empresa: inputs[5].value,
        setor: inputs[6].value.trim(),
        status: inputs[7].value,
        termo: linha.cells[8].getAttribute('title')
    };
    renderizarLinha(linha, novosDados);
}

function cancelarEdicao(botao, dadosOriginais) {
    renderizarLinha(botao.closest('tr'), dadosOriginais);
}

function excluirLinha(botao) {
    if (confirm("Deseja excluir este registro?")) {
        botao.closest('tr').remove();
        atualizarContador();
    }
}

function exportarExcel() {
    const tabela = document.getElementById("tabelaDados");
    const wb = XLSX.utils.table_to_book(tabela, { sheet: "Estações" });
    XLSX.writeFile(wb, "Relatorio_Estacoes_AgileConnect.xlsx");
}

function limparCampos() {
    camposIds.forEach(id => {
        const el = document.getElementById(id);
        el.value = '';
        el.style.borderLeft = "1px solid var(--border)";
    });
    document.getElementById('termo').value = '';
    atualizarNomeArquivo(null);
}

function atualizarContador() {
    document.getElementById('totalCount').innerText = document.querySelectorAll('#listaEstoque tr').length;
}

function filtrarTabela() {
    const busca = document.getElementById("filtroGeral").value.toUpperCase();
    document.querySelectorAll("#listaEstoque tr").forEach(row => {
        row.style.display = row.innerText.toUpperCase().includes(busca) ? "" : "none";
    });
}

function aplicarCoresStatus(linha) {
    const celStatus = linha.querySelector('.status-cell');
    if(!celStatus) return;
    const status = celStatus.innerText.trim();
    celStatus.style.color = (status === 'Em Uso') ? "#10b981" : "#f59e0b";
    celStatus.style.fontWeight = "bold";
}