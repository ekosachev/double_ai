const server = 'https://double-ai.ru/backend';

export async function getRequest(path) {
    try {
        const response = await fetch(server + path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const answer = await response.json();
        return answer;
    } catch (error) {
        console.log('Ошибка запроса: ' + error);
    }
}

export async function postRequest(path, body) {
    try {
        const response = await fetch(server + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        const result = await response.json();
        return result.json();
    }
    catch (error) {
        console.log('Ошибка запроса: ' + error);
    }
}