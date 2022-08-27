//returns promise object given HTTP method and url
export function SendHttpRequest (method, url) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = 'json';
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.send();
    //console.log(xhr);
  });
  return promise;
};

//returns the result from a GET request at a given url
export const getRequest = async (url) => {
	let dataGet = SendHttpRequest('GET', url);
  //console.log(dataGet);
	return (
		dataGet
			.then(responseData => {
				return responseData;
			})
			.catch(function(error) {
        console.log(error);
			} )
	)
}

export const postRequest = (url, data) => {
	const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.send(data);
  });
  return promise;
};