let cep = document.getElementById('cep');
let button = document.querySelector('#btn');

async function buscaEndereco(cep) {
    const fetchCep = await fetch(`https://cep.awesomeapi.com.br/json/${cep}`);
    const endereco = await fetchCep.json();
    return endereco;
}

async function buscarClima(lat, lng) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=8`;
    const fetchClima = await fetch(url);
    
    const clima = await fetchClima.json();
    return clima;
}

button.addEventListener('click', async (e) => {
    e.preventDefault();
    const endereco = await buscaEndereco(cep.value);
    if (!endereco.cep) {
        alert('CEP inválido');
        throw new Error('CEP inválido');
    }
    const lat = endereco.lat;
    const lng = endereco.lng;

    const clima = await buscarClima(lat, lng);
    if(!clima){
        alert('Clima não encontrado');
        throw new Error('Clima não encontrado');
    }
    
    for(day in clima.daily.time) {
        const dataSeparada = clima.daily.time[day].toString().split('-');
        const dataFormatada = `${dataSeparada[2]}/${dataSeparada[1]}/${dataSeparada[0]}`;
        const dayObj = new Date(clima.daily.time[day] + 'T00:00'); //Adicionar 'T00:00' Faz com que seja inteerpretado o fuso horário local, evitando que o dia seja interpretado como o dia anterior...
        const dataExtenso  = new Intl.DateTimeFormat('pt-BR', {weekday: 'long'}).format(new Date(dayObj));
        console.log(dataFormatada + ' - ' + dataExtenso + ' - ' + clima.daily.time[day]);

        document.getElementById('clima').innerHTML += `<li>Dia:${dataFormatada}(${dataExtenso})</li>`;
        document.getElementById('clima').innerHTML += `<li>${clima.daily.weathercode[day]}% de chance de chuva</li>`;
        document.getElementById('clima').innerHTML += `<li>${clima.daily.temperature_2m_max[day]}°C</li>`;
        document.getElementById('clima').innerHTML += `<li>${clima.daily.temperature_2m_min[day]}°C</li>`;
        document.getElementById('clima').innerHTML += `<br/>`;
        //document.getElementById('data').innerHTML += `<ul>${clima.daily.time[day]}</ul>`;
    }
    console.log(clima);
})

