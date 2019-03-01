let papers = document.body.getElementsByClassName('gs_r gs_or gs_scl');
console.log(papers.length + ' papers on the page');
const HEADER = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36"

for (let i = 0; i < papers.length; i++) {
    let button = document.createElement('a');
    button.innerHTML = "Add to RW";
    button.addEventListener('click', function () {
        addToLib(papers[i])
    });
    let nodesToAdd = papers[i].getElementsByClassName('gs_fl');
    nodesToAdd[nodesToAdd.length-1].appendChild(button);
}

function addToLib(paper) {
    let title = paper.getElementsByClassName('gs_rt')[0].textContent;
    let paperId = paper.getAttribute('data-cid');

    addAbstract(paperId);
}

function addAbstract(paperId) {
    let xhr = new XMLHttpRequest();
    let url = `https://scholar.google.com/scholar?q=info:${paperId}:scholar.google.com/&output=qabs&scirp=1&hl=en`;
    xhr.onreadystatechange = readPaperDetail(xhr); // Implemented elsewhere.
    xhr.open("GET", url, true);
    // xhr.setRequestHeader("user-agent", HEADER);
    xhr.send();
}

function readPaperDetail(xhr) {
    return function () {
        if (xhr.readyState === 4) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = xhr.responseText.replace(/<script(.|\s)*?\/script>/g, '');
            let abstarct = tempDiv.getElementsByClassName("gs_qabs_snippet")[0].textContent;
            console.log(abstarct)
        }
    }
}