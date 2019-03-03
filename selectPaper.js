const HEADER = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36";

chrome.storage.local.get(null, function(result) {
    let papers = document.body.getElementsByClassName('gs_r gs_or gs_scl');
    console.log(papers.length + ' papers on the page');
    for (let i = 0; i < papers.length; i++) {
        let title = papers[i].getElementsByClassName('gs_rt')[0].textContent;
        let otherInfo = {title: title};
        let paperId = papers[i].getAttribute('data-cid');
        let button = null;
        if (result[paperId] === undefined) {
            button = document.createElement('button');
            button.innerHTML = "Add to RW";
            button.setAttribute("id", "btn_" + paperId);
            button.addEventListener('click', onClickAddBtn(paperId, button, otherInfo));
        } else {
            button = document.createElement('button');
            button.innerHTML = "Added";
        }
        let nodesToAdd = papers[i].getElementsByClassName('gs_fl');
        nodesToAdd[nodesToAdd.length-1].appendChild(button);
        // console.log(paperId + "----" + result[paperId]);
    }

});

function onClickAddBtn(paperId, button, otherInfo) {
    return function () {
        addToLib(paperId, otherInfo);
        button.innerHTML = "Added";
        button.removeEventListener('click', onClickAddBtn);
    };
}

function addToLib(paperId, otherInfo) {
    chrome.storage.local.set({[paperId]: null}, function() {
        addAbstract(paperId, otherInfo);
    });
    return paperId;
}

function addAbstract(paperId, otherInfo) {
    let xhr = new XMLHttpRequest();
    let url = `https://scholar.google.com/scholar?q=info:${paperId}:scholar.google.com/&output=qabs&scirp=1&hl=en`;
    xhr.onreadystatechange = readPaperDetail(xhr, paperId, otherInfo); // Implemented elsewhere.
    xhr.open("GET", url, true);
    // xhr.setRequestHeader("user-agent", HEADER);
    xhr.send();
}

function readPaperDetail(xhr, paperId, otherInfo) {
    return function () {
        if (xhr.readyState === 4) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = xhr.responseText.replace(/<script(.|\s)*?\/script>/g, '');
            let abstarct = tempDiv.getElementsByClassName("gs_qabs_snippet")[0].textContent;
            otherInfo['abstract'] = abstarct;
            chrome.storage.local.set({[paperId]: otherInfo}, null);
        }
    }
}