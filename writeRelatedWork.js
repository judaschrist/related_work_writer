let CORE_REG = /(In this paper,? we|We|This paper)\s(.*?\.)(\s|$)/;

function genRWTex(author, title, abstract, bibId) {
    let sen = CORE_REG.exec(abstract);

    if (sen === null) {
        sen = "[TO BE COMPLETED]";
    } else {
        sen = sen[2];
    }
    return `${author} et al.~\\cite{${bibId}} ${sen}`;
}