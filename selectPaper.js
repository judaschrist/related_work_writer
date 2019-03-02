const HEADER = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36"

chrome.storage.local.get(null, function(result) {
    let papers = document.body.getElementsByClassName('gs_r gs_or gs_scl');
    console.log(papers.length + ' papers on the page');
    for (let i = 0; i < papers.length; i++) {
        let title = papers[i].getElementsByClassName('gs_rt')[0].textContent;
        let paperId = papers[i].getAttribute('data-cid');
        let button = null;
        if (result[paperId] === undefined) {
            button = document.createElement('a');
            button.innerHTML = "Add to RW";
            button.addEventListener('click', function () {
                addToLib(paperId);
            });
        } else if (result[paperId] === null) {
            button = document.createElement('a');
            button.innerHTML = "Adding...";
        } else {
            button = document.createElement('a');
            button.innerHTML = "Remove from RW";
            button.addEventListener('click', function () {
                removeFromLib(paperId);
            });
        }
        let nodesToAdd = papers[i].getElementsByClassName('gs_fl');
        nodesToAdd[nodesToAdd.length-1].appendChild(button);
        console.log(paperId + "----" + result[paperId]);
    }

});


function removeFromLib(paperId) {
    chrome.storage.local.remove(paperId, null);
}

function addToLib(paperId) {
    chrome.storage.local.set({[paperId]: null}, function() {
    });

    // chrome.runtime.sendMessage({paperID: paperId, title: title}, function(response) {
    //     console.log(response.farewell);
    // });

    addAbstract(paperId);
    return paperId;
}

function addAbstract(paperId) {
    let xhr = new XMLHttpRequest();
    let url = `https://scholar.google.com/scholar?q=info:${paperId}:scholar.google.com/&output=qabs&scirp=1&hl=en`;
    xhr.onreadystatechange = readPaperDetail(xhr, paperId); // Implemented elsewhere.
    xhr.open("GET", url, true);
    // xhr.setRequestHeader("user-agent", HEADER);
    xhr.send();
}

function readPaperDetail(xhr, paperId) {
    return function () {
        if (xhr.readyState === 4) {
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = xhr.responseText.replace(/<script(.|\s)*?\/script>/g, '');
            let abstarct = tempDiv.getElementsByClassName("gs_qabs_snippet")[0].textContent;
            console.log(abstarct);
            chrome.storage.local.set({[paperId]: abstarct}, function() {
            });
        }
    }
}