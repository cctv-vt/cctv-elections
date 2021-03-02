
const alphaNum = (s) => {
    a = [0,0]
    if (/^[A-z]\d{1,3}/.test(s)) {
        return [s[0].toLowerCase().charCodeAt(0) - 97, parseInt(s[1]+s[2]+s[3]) - 1];
    } else if (/^[A-z][A-z]\d{1,3}/.test(s)) {
        return [(s[0].toLowerCase().charCodeAt(0) - 97 + 1) * 26 + s[1].toLowerCase().charCodeAt(0) - 97, parseInt(s[2]+s[3]+s[4]) - 1];
    } else return [0,0];
};

console.log(alphaNum(process.argv[2].toString()))