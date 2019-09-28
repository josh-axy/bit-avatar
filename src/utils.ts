export function getURLBase64(url: string) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
      if (this.status === 200) {
        const blob = this.response;
        const fileReader = new FileReader();
        fileReader.onloadend = (e) => {
          const result = e.target && e.target.result as string;
          resolve(result);
        };
        fileReader.readAsDataURL(blob);
      }
    };
    xhr.onerror = () => {
      reject();
    };
    xhr.send();
  });
}

export function getNonceStr(length = 32): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < length; i++ )  {
    str += chars[Math.floor(Math.random() * (chars.length))];
  }
  return str;
}
