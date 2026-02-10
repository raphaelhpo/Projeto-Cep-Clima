let cep = document.getElementById('cep');
let button = document.querySelector('#btn');

async function buscaEndereco(cep) {
    const fetchCep = await fetch(`https://cep.awesomeapi.com.br/json/${cep}`);
    const endereco = await fetchCep.json();
    return endereco;
}

async function buscarClima(lat, lng) {
    //const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=8`;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&current=temperature_2m,weather_code&timezone=auto&forecast_days=8`;

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
    console.log(clima);
    
    clima.daily.time.forEach((day, index) => {
        const dataSeparada = day.toString().split('-');
        const dataFormatada = `${dataSeparada[2]}/${dataSeparada[1]}/${dataSeparada[0]}`;
        const dayObj = new Date(day + 'T00:00');
        const dataExtenso  = new Intl.DateTimeFormat('pt-BR', {weekday: 'long'}).format(new Date(dayObj));
        console.log(dataFormatada + ' - ' + dataExtenso + ' - ' + day);
        const weatherCode = clima.daily.weathercode[index];
        const tempMax = clima.daily.temperature_2m_max[index];
        const tempMin = clima.daily.temperature_2m_min[index];
        console.log(day + ' - ' + weatherCode);
        
        const div = document.createElement('div');
        const li = document.createElement('li');
        const li2 = document.createElement('li');
        const li3 = document.createElement('li');
        const li4 = document.createElement('li');

        div.appendChild(li);
        div.appendChild(li2);
        div.appendChild(li3);
        div.appendChild(li4);

        li.textContent = `Dia:${dataFormatada}(${dataExtenso})`;
        li2.textContent = `${weatherCode}% de chance de chuva`;
        li3.textContent = `${tempMax}°C`;
        li4.textContent = `${tempMin}°C`;

        document.body.appendChild(div);
        document.body.appendChild(document.createElement('br'));
    });
})

