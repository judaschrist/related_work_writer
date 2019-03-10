function genRWTex(author, title, abstract, bibId) {
    let firstEnd = abstract.indexOf('.');
    return `${author} et al.~\\cite{${bibId}} ${abstract.substring(0, firstEnd+1)}`;
}