export function FetchXHR(url, method, data) {
    const ls = localStorage.getItem(process.env.REACT_APP_LOCALSTORAGE);
    let session = {};
    if (ls) {
        session = JSON.parse(ls);
    }

    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open(method, url, true);
        request.setRequestHeader('Content-Type', 'application/JSON');

        if (session) {
            if (session.token) {
                request.setRequestHeader('Authorization', session.token);
            }
        }

        request.send(JSON.stringify(data));
        request.onreadystatechange = function handleResponse() {
            if ((this.responseText !== undefined && this.responseText !== ''
                && this.responseText !== null && this.responseText !== ' '
                && this.responseText[this.responseText.length - 1] === '}'
                && this.readyState === 4 && this.status === 200)
                || (this.readyState === 4 && this.status === 400)) {
                resolve({
                    json: JSON.parse(this.responseText),
                    status: {
                        info: this.statusText,
                        code: this.status
                    }
                });
            }
        };
        request.onerror = function handleError(error) {
            reject(error);
        };
    });
}
