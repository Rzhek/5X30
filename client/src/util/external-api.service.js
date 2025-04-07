import axios from 'axios';

export const callGet = async ({ url, params, token }) => {
  try {
    const res = await axios.get(url, {
      params: params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (e) {
    console.log(`ERROR ON GET ${url} call: ${e}`);
    return { error: e };
  }
};

export const callPost = async ({ url, body, token }) => {
  try {
    const res = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (e) {
    console.log(`ERROR ON POST ${url} call: ${e}`);
    return { error: e };
  }
};
