const axios = require('axios');

const getHeaders = {
 'Access-Control-Allow-Origin': '*'
}

const postHeaders = {
  'Content-Type': 'application/json'
}

export const getRequest = async (url) => {
  try {
      const resp = await axios.get(url, {headers: getHeaders});
      return resp.data;
  } catch (err) {
      // Handle Error Here
      console.error(err);
  }
};

export const postRequest = async (url, postdata) => {
  //console.log(postdata);
  try {
    const resp = await axios.post(url, postdata, {headers: postHeaders})
    return resp.data;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

export const putRequest = async (url, putdata) => {
  try {
    const resp = await axios.put(url, putdata, {headers: postHeaders});
    console.log(resp.data);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

//export const putRequest = (url, data) => {};