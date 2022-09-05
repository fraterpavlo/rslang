import { IGameResponse, LOCAL } from "../interfaces/statistic";

const base = 'https://rs-lang-rss-task.herokuapp.com'

export const loginUser = async (user: { email: string; password: string; }) => {
  const rawResponse = await fetch(`${base}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  const content = await rawResponse.json();

  localStorage.setItem(LOCAL.TOKEN, content.token);
  localStorage.setItem(LOCAL.REFRESH_TOKEN, content.refreshToken);
  localStorage.setItem(LOCAL.ID, content.userId);
};

loginUser({ "email": "hello@user.com", "password": "Gfhjkm_123" });

export const getUserToken = () => String(localStorage.getItem(LOCAL.TOKEN));
export const getUserId = () => String(localStorage.getItem(LOCAL.ID));

export const getStatisticRequest = async (userId: string): Promise<IGameResponse> =>
  fetch(`${base}/users/${userId}/words`, {
    headers: {
      Authorization: `Bearer ${getUserToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((result) => {
    return result.json();
  });


  export const getUserStatistics = async (userId: string) => {
    const rawResponse = await fetch(`${base}/users/${userId}/statistics`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getUserToken()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      const content = await rawResponse.json()
      return content
    }
