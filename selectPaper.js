let papers = document.body.getElementsByClassName('gs_r gs_or gs_scl');
console.log(papers.length + ' papers on the page');

for (let i = 0; i < papers.length; i++) {
    let button = document.createElement('a');
    // button.className = "credo_button";
    button.innerHTML = "Add to RW";
    button.addEventListener('click', function () {
        addToLib(papers[i])
    });
    papers[i].getElementsByClassName('gs_fl')[1].appendChild(button);
}

function addToLib(paper) {
    let title = paper.getElementsByClassName('gs_rt')[0].textContent;
    let paperId = paper.getAttribute('data-cid');
    let xhr = new XMLHttpRequest();
    let url = `https://scholar.google.com/scholar?q=info:${paperId}:scholar.google.com/&output=qabs&scirp=1&hl=en`;
    xhr.onreadystatechange = readPaperDetail(xhr); // Implemented elsewhere.
    xhr.open("GET", url, true);
    xhr.send();
    let result = xhr.responseText;
    console.log(title + " " + url);
    console.log(result)
}

function readPaperDetail(xhr) {
    return function () {
        if (xhr.readyState === 4) {
            // JSON.parse does not evaluate the attacker's scripts.
            console.log(xhr.responseText);
        }
    }
}