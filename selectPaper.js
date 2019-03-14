const HEADER = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36";

chrome.storage.local.get(null, function(result) {
    let papers = document.body.getElementsByClassName('gs_r gs_or gs_scl');
    console.log(papers.length + ' papers on the page');
    for (let i = 0; i < papers.length; i++) {
        let title = papers[i].getElementsByClassName('gs_rt')[0].textContent;
        let otherInfo = {title: title};
        let paperId = papers[i].getAttribute('data-cid');
        let button = document.createElement('button');
        button.setAttribute("id", "btn_" + paperId);
        if (result[paperId] === undefined) {
            button.innerHTML = "Add to RW";
            button.addEventListener('click', onClickAddBtn(paperId, button, otherInfo));
        } else {
            button.innerHTML = "Added";
        }
        let nodesToAdd = papers[i].getElementsByClassName('gs_fl');
        nodesToAdd[nodesToAdd.length-1].appendChild(button);
        // console.log(paperId + "----" + result[paperId]);
    }

});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("deleting " + request.paperId);
        let btn = document.getElementById('btn_' + request.paperId);
        if (btn !== null) {
            btn.innerHTML = "Add to RW";
            btn.addEventListener('click', onClickAddBtn(request.paperId, btn, request.info));
        }
    });

function onClickAddBtn(paperId, button, otherInfo) {
    return function () {
        chrome.storage.local.set({[paperId]: otherInfo}, function() {
            addPaperInfo(paperId);
        });
        button.innerHTML = "Added";
        button.removeEventListener('click', onClickAddBtn);
    };
}

function addAbstract(paperId) {
    let xhr = new XMLHttpRequest();
    let url = `https://scholar.google.com/scholar?q=info:${paperId}:scholar.google.com/&output=qabs&scirp=1&hl=en`;
    xhr.onreadystatechange = readPaperAbstract(xhr, paperId); // Implemented elsewhere.
    xhr.open("GET", url, true);
    xhr.send();
}

function addBibTex(paperId) {
    let xhr = new XMLHttpRequest();
    let url = `https://scholar.google.com/scholar?q=info:${paperId}:scholar.google.com/&output=cite&scirp=2&hl=en`;
    xhr.onreadystatechange = readPaperBibtex(xhr, paperId); // Implemented elsewhere.
    xhr.open("GET", url, true);
    xhr.send();
}

function addPaperInfo(paperId) {
    addAbstract(paperId);
    addBibTex(paperId);
}

function readPaperBibtex(xhr, paperId) {
    return function () {
        if (xhr.readyState === 4) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = xhr.responseText.replace(/<script(.|\s)*?\/script>/g, '');
            let xhrbib = new XMLHttpRequest();
            let url = tempDiv.getElementsByClassName("gs_citi")[0].getAttribute("href");
            xhrbib.onreadystatechange = function () {
                if (xhrbib.readyState === 4) {
                    chrome.storage.local.get(paperId, function(info) {
                        info[paperId]['bibtex'] = xhrbib.responseText;
                        let bibtexStr = info[paperId]['bibtex'];
                        let firstAuthorStart = bibtexStr.indexOf('author={') + 8;
                        let firstAuthorEnd = bibtexStr.indexOf(' and', firstAuthorStart);
                        info[paperId]['author'] = bibtexStr.substring(firstAuthorStart, firstAuthorEnd);
                        chrome.storage.local.set({[paperId]: info[paperId]}, null);
                    });
                }
            };
            xhrbib.open("GET", url, true);
            xhrbib.send();
        }
    }
}

function readPaperAbstract(xhr, paperId) {
    return function () {
        if (xhr.readyState === 4) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = xhr.responseText.replace(/<script(.|\s)*?\/script>/g, '');
            chrome.storage.local.get(paperId, function(info) {
                info[paperId]['abstract'] = tempDiv.getElementsByClassName("gs_qabs_snippet")[0].textContent;
                chrome.storage.local.set({[paperId]: info[paperId]}, null);
            });
        }
    }
}