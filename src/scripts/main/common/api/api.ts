import { ISigninUser, ICreateUser } from "../interfaces";

const baseUrl = 'https://rs-lang-rss-task.herokuapp.com';

export const createUser = async (user: ICreateUser): Promise<void> => {
    try {
        const data = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        
        data;
    } catch (error) {
        throw new Error('');
    }
};

export const signin = async (user: ISigninUser): Promise<void> => {
    try {
        const data = await fetch(`${baseUrl}/signin`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (data.ok) {
            const content = await data.json();
            localStorage.user = JSON.stringify(content);
        }

    } catch (error) {
        throw new Error('');
    }
};

export const deleteUser = async (userId: string): Promise<void> => {
    try {
        await fetch(`${baseUrl}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        console.log('Пользователь удалён.');
        localStorage.clear();
      
    } catch (error) {
        throw new Error('');
    }
}; 