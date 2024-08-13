// Função para formatar a data como dd/mm/aaaa
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Função para calcular as horas trabalhadas
function calcularHorasTrabalhadas(dataInicio, horaInicio, dataFim, horaFim) {
    const [horaInicioHoras, horaInicioMinutos] = horaInicio.split(':').map(Number);
    const [horaFimHoras, horaFimMinutos] = horaFim.split(':').map(Number);

    const dataHoraInicio = new Date(`${dataInicio}T${horaInicio}:00`);
    const dataHoraFim = new Date(`${dataFim}T${horaFim}:00`);

    let diferencaMilissegundos = dataHoraFim - dataHoraInicio;

    if (diferencaMilissegundos < 0) {
        alert("A data e hora de saída devem ser posteriores à data e hora de entrada.");
        return "0h 0min";
    }

    const horasTrabalhadas = Math.floor(diferencaMilissegundos / (1000 * 60 * 60));
    const minutosTrabalhados = Math.floor((diferencaMilissegundos % (1000 * 60 * 60)) / (1000 * 60));

    return `${horasTrabalhadas}h ${minutosTrabalhados}min`;
}

// Função para formatar a data no formato dd/mm/aaaa
function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Função para converter texto para maiúsculas
function converterMaiusculas(texto) {
    return texto.toUpperCase();
}

// Função para atualizar o campo de horas trabalhadas
function atualizarHorasTrabalhadas() {
    const dataInicio = document.getElementById('startDate').value;
    const horaInicio = document.getElementById('startTime').value;
    const dataFim = document.getElementById('endDate').value;
    const horaFim = document.getElementById('endTime').value;

    if (dataInicio && horaInicio && dataFim && horaFim) {
        const horasTrabalhadas = calcularHorasTrabalhadas(dataInicio, horaInicio, dataFim, horaFim);
        document.getElementById('workHours').value = horasTrabalhadas;
    }
}

// Adiciona listeners para atualizar as horas trabalhadas sempre que a data ou hora de entrada/saída mudarem
document.getElementById('startDate').addEventListener('change', atualizarHorasTrabalhadas);
document.getElementById('startTime').addEventListener('change', atualizarHorasTrabalhadas);
document.getElementById('endDate').addEventListener('change', atualizarHorasTrabalhadas);
document.getElementById('endTime').addEventListener('change', atualizarHorasTrabalhadas);

// Função para adicionar ou atualizar uma entrada na tabela
function addOrUpdateEntry() {
    const categoria = converterMaiusculas(document.getElementById('category').value);
    const nome = converterMaiusculas(document.getElementById('name').value);
    const turno = converterMaiusculas(document.getElementById('shift').value);
    const dataInicio = formatarData(document.getElementById('startDate').value);
    const horaInicio = document.getElementById('startTime').value;
    const dataFim = formatarData(document.getElementById('endDate').value);
    const horaFim = document.getElementById('endTime').value;
    const setor = converterMaiusculas(document.getElementById('sector').value);
    const horasTrabalhadas = document.getElementById('workHours').value;

    const tabela = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();

    novaLinha.insertCell(0).innerText = categoria;
    novaLinha.insertCell(1).innerText = nome;
    novaLinha.insertCell(2).innerText = setor;
    novaLinha.insertCell(3).innerText = turno;
    novaLinha.insertCell(4).innerText = dataInicio;
    novaLinha.insertCell(5).innerText = horaInicio;
    novaLinha.insertCell(6).innerText = dataFim;
    novaLinha.insertCell(7).innerText = horaFim;
    novaLinha.insertCell(8).innerText = horasTrabalhadas;
}

// Função para calcular o total de horas trabalhadas
function calcularTotalHorasTrabalhadas() {
    const tableBody = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0];
    let totalHoras = 0;
    let totalMinutos = 0;

    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        const horasTrabalhadasText = row.cells[8].innerText;

        const [horas, minutos] = horasTrabalhadasText.split('h ').map(texto => parseInt(texto, 10));
        totalHoras += horas;
        totalMinutos += minutos;
    }

    totalHoras += Math.floor(totalMinutos / 60);
    totalMinutos = totalMinutos % 60;

    return `${totalHoras}h ${totalMinutos}min`;
}

// Função para gerar o PDF
async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });

    try {
        // Verifique se a imagem está corretamente carregada
        const imgData = './logo_poco.png'; // ou use um código base64 se disponível
        const imgWidth = 30;
        const imgHeight = 12;
        const x = 20;
        const y = 6;

        doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

        // Adicionar texto
        doc.setFontSize(12);
        doc.text('Relatório de Escala UPA24h Dona Zulmira Soares', 100, 13);

        // Verifique se a tabela existe
        const table = document.getElementById('scheduleTable');
        if (!table) {
            console.error("Tabela não encontrada!");
            return;
        }

        // Adicionar a tabela
        doc.autoTable({
            html: table,
            startY: 20,
            styles: {
                halign: 'center',
                valign: 'middle',
            },
            headStyles: {
                halign: 'center',
                valign: 'middle',
            }
        });

        // Adicionar total de horas trabalhadas
        const totalHorasTrabalhadas = calcularTotalHorasTrabalhadas();
        doc.text(`Total de Horas Trabalhadas no Mês: ${totalHorasTrabalhadas}`, 195, doc.autoTable.previous.finalY + 10);

        // Salvar o PDF
        doc.save('escala.pdf');
    } catch (error) {
        console.error("Erro ao gerar PDF: ", error);
    }
}


// Função para gerar o Excel
function generateExcel() {
    const ws = XLSX.utils.table_to_sheet(document.getElementById('scheduleTable'));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Escala');
    XLSX.writeFile(wb, 'escala.xlsx');
}

// Função para limpar o formulário
function clearForm() {
    document.getElementById('category').value = '';
    document.getElementById('name').value = '';
    document.getElementById('shift').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('endTime').value = '';
    document.getElementById('sector').value = '';
    document.getElementById('workHours').value = '';
}

// Função para limpar a tabela
function clearTable() {
    const tableBody = document.getElementById('scheduleTable').getElementsByTagName('tbody')[0];
    while (tableBody.rows.length > 0) {
        tableBody.deleteRow(0);
    }
}

// Adiciona listeners para os botões
document.getElementById('generatePDFButton').addEventListener('click', () => {
    generatePDF();
    clearForm(); // Limpa os campos do formulário após gerar o PDF
    clearTable(); // Limpa a tabela de escalas após gerar o PDF
});

document.getElementById('generateExcelButton').addEventListener('click', () => {
    generateExcel();
    clearForm(); // Limpa os campos do formulário após gerar o Excel
});


