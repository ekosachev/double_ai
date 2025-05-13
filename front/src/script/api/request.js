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

        return await response.json();
    } catch (error) {
        console.error('Ошибка GET запроса:', error);
        throw error;
    }
}

export async function postRequest(path, body = {}) {
    try {
        const response = await fetch(server + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            redirect: 'manual'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка POST запроса:', error);
        throw error;
    }
}