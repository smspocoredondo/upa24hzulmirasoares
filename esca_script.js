let contador = 1;

function adicionarLinha() {
    const tbody = document.getElementById('tabela-body');
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td>
            <select>
                <option value="Selecione">- Selecione -</option>
                <option value="Enfermeiro">Enfermeiro</option>
                <option value="Aux. de Enfer">Aux. de Enfer</option>
                <option value="Tec. de Enfer">Tec. de Enfer</option>
                <option value="Médico">Médico</option>
            </select>
        </td>
        <td><input type="text" name="funcionario-${contador}" required></td>
        <td><input type="text" name="funcionario-${contador}" required></td>
        <td><input type="text" name="funcionario-${contador}" required></td>
        ${Array.from({ length: 31 }).map(() => `
            <td>
                <select>
                    <option value="--">--</option>
                    <option value="SD">SD</option>
                    <option value="SN">SN</option>
                    <option value="P">P</option>
                    <option value="F">Folga</option>
                </select>
            </td>
        `).join('')}
        <td><button type="button" onclick="removerLinha(this)">Remover</button></td>
    `;

    tbody.appendChild(tr);
    // Coloca o foco no primeiro input da nova linha
    tr.querySelector('input[type="text"]').focus();
    contador++;
}

function removerLinha(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function resetarTabela() {
    const tbody = document.getElementById('tabela-body');
    tbody.innerHTML = ''; // Remove todas as linhas da tabela
    contador = 1; // Reseta o contador de linhas
}

function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' }); // Modo paisagem
    const tabela = document.getElementById('tabela-funcionarios');
    const rows = [];

    // Captura os dados da tabela
    Array.from(tabela.rows).forEach((row, i) => {
        const cells = Array.from(row.cells).map(cell => {
            if (cell.children.length) {
                if (cell.children[0].tagName === 'SELECT') {
                    return cell.children[0].value; // Captura o valor selecionado
                }
                return cell.children[0].value || cell.textContent.trim();
            }
            return cell.textContent.trim();
        });
        rows.push(cells);
    });

    // Captura a data e hora atuais
    const now = new Date();
    const date = now.toLocaleDateString('pt-BR'); // Formata a data no formato dd/mm/aaaa
    const time = now.toLocaleTimeString('pt-BR'); // Formata a hora no formato hh:mm:ss

    // Configura o PDF e adiciona as linhas
    doc.autoTable({
        head: [rows[1]],
        body: rows.slice(2),
        startY: 20,
        theme: 'grid',
        styles: {
            fontSize: 8,  // Ajuste do tamanho da fonte
            cellPadding: 1, // Ajuste do espaçamento interno das células
            overflow: 'linebreak', // Quebra de linha automática
            halign: 'center', // Centraliza horizontalmente o conteúdo das células
            valign: 'middle', // Centraliza verticalmente o conteúdo das células
            minCellHeight: 5, // Ajuste da altura mínima das células
        },
        // Define largura uniforme para todas as colunas
        columnStyles: {
            0: { cellWidth: 20 },  // Ajusta a largura da coluna de setores
            1: { cellWidth: 44 },  // Ajusta a largura da coluna de nomes
            2: { cellWidth: 18 },
            3: { cellWidth: 8 },
            4: { cellWidth: 6 },
            5: { cellWidth: 6 },
            6: { cellWidth: 6 },
            7: { cellWidth: 6 },
            8: { cellWidth: 6 },
            9: { cellWidth: 6 },
            10: { cellWidth: 6 },
            11: { cellWidth: 6 },
            12: { cellWidth: 6 },
            13: { cellWidth: 6 },
            14: { cellWidth: 6 },
            15: { cellWidth: 6 },
            16: { cellWidth: 6 },
            17: { cellWidth: 6 },
            18: { cellWidth: 6 },
            19: { cellWidth: 6 },
            20: { cellWidth: 6 },
            21: { cellWidth: 6 },
            22: { cellWidth: 6 },
            23: { cellWidth: 6 },
            24: { cellWidth: 6 },
            25: { cellWidth: 6 },
            26: { cellWidth: 6 },
            27: { cellWidth: 6 },
            28: { cellWidth: 6 },
            29: { cellWidth: 6 },
            30: { cellWidth: 6 },
            31: { cellWidth: 6 },
            32: { cellWidth: 6 },
            33: { cellWidth: 6 },
            34: { cellWidth: 6 },
        },
        didDrawPage: function (data) {
            // Cabeçalho
            const pageWidth = doc.internal.pageSize.getWidth();
            const title = 'Escala de Funcionários';
            const textWidth = doc.getTextWidth(title);
            const textX = (pageWidth - textWidth) / 2;

            // Adiciona uma imagem no cabeçalho
            const imgBase64 = 'UPA_24_Horas.jpg'; // Substitua pela sua imagem em base64
            doc.addImage(imgBase64, 'PNG', 22, 3, 36, 16); // Adiciona a imagem na posição (10, 10) com largura 30 e altura 15

            // Adiciona o título
            doc.text(title, textX, 12); // Centraliza o título logo abaixo da imagem

            // Adiciona a data e hora no cabeçalho
            doc.setFontSize(10);
            doc.text(`Data: ${date}    Hora: ${time}`, pageWidth - 70, 15); // Adiciona a data e hora no canto superior direito

            // Rodapé
            const pageHeight = doc.internal.pageSize.getHeight();
            const footerText = 'Obs: SD serviço diurno - SN serviço noturno - P plantão - F folga';
            doc.setFontSize(10);
            doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' }); // Centraliza o rodapé no final da página
        },
        didDrawCell: function (data) {
            if (data.section === 'body') {
                // Código para ajustar a altura da tabela se necessário
            }
        },
    });

    // Captura o texto do campo de observações
    const observacoes = document.getElementById('observacoes-textarea').value;

    // Adiciona o campo de observações abaixo da tabela
    const finalY = doc.lastAutoTable.finalY || 40; // Posição Y após a tabela
    doc.setFontSize(10);
    doc.text('Observações:', 14, finalY + 10);
    doc.setFontSize(8);
    doc.text(observacoes, 14, finalY + 20); // Adiciona o texto das observações abaixo do título

    doc.save(`Escala_funcionarios_${date}_${time}.pdf`);
}


function gerarExcel() {
    // Captura a tabela
    const tabela = document.getElementById('tabela-funcionarios');
    const rows = [];

    // Percorre as linhas da tabela
    Array.from(tabela.rows).forEach((row) => {
        const rowData = [];
        Array.from(row.cells).forEach((cell) => {
            if (cell.children.length) {
                const element = cell.children[0];
                if (element.tagName === 'SELECT') {
                    rowData.push(element.value);
                } else if (element.tagName === 'INPUT') {
                    rowData.push(element.value);
                } else {
                    rowData.push(cell.textContent.trim());
                }
            } else {
                rowData.push(cell.textContent.trim());
            }
        });
        rows.push(rowData);
    });

    // Cria um novo workbook e adiciona a planilha
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);

    // Adiciona a planilha ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Escala de Funcionários');

    // Captura a data e hora atuais para o nome do arquivo
    const now = new Date();
    const date = now.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const time = now.toLocaleTimeString('pt-BR').replace(/:/g, '-');

    // Gera o arquivo Excel e inicia o download
    XLSX.writeFile(wb, `Escala_funcionarios_${date}_${time}.xlsx`);
}
document.getElementById('logoutButton').addEventListener('click', function () {
    // Aqui você pode colocar o código para realizar o logout
    // console.log('Logout iniciado');

    // Exemplo: Redirecionar para a página de login
    window.location.href = 'home.html';

    // Ou limpar dados de usuário armazenados (se houver)
    // localStorage.clear(); // Exemplo de limpeza de dados de sessão
});

