document.addEventListener('DOMContentLoaded', function () {
    let links = document.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
        (function () {
            let ln = links[i];
            let location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
});


let pListDiv = document.getElementById('sub-div');
let delBtn = document.getElementById('btn-del-all');
delBtn.addEventListener('click', removeAll);
let writeBtn = document.getElementById('btn-write');
writeBtn.addEventListener('click', showResult);
// let btnGroup = document.getElementById('btn-g');

showPaperList();

chrome.storage.onChanged.addListener(function(changes, namespace) {
    Object.keys(changes).forEach(function (paperId) {
        console.log(changes[paperId]);
        if (changes[paperId].newValue['author'] !== undefined && changes[paperId].newValue['abstract'] !== undefined) {
            document.getElementById("author-" + paperId).innerHTML = changes[paperId].newValue['author'];
            writeBtn.disabled = false;
        }
    });
});

function showWelcome() {
    while (pListDiv.firstChild) {
        pListDiv.removeChild(pListDiv.firstChild);
    }
    let htmlStr = `
        <li class="list-group-item">
            <div class="jumbotron">
                <p class="lead">Hi, fellow researchers!</p>
                <p class="lead">Ready to add related work to your paper?</p>
                <hr class="my-4">
                <p>Go to <a href="https://scholar.google.com">Google Scholar</a> to add papers.</p>
                <a class="btn btn-primary btn-sm" href="https://github.com/judaschrist/related_work_writer" role="button">Learn more</a>
            </div>
        </li>`;
    pListDiv.insertAdjacentHTML('beforeend', htmlStr);
    writeBtn.disabled = true;
}

function showPaperList() {
    // backBtn.style.display = 'none';
    writeBtn.style.display = 'inline';
    delBtn.style.display = 'inline';
    // btnGroup.style.display = 'inline';
    while (pListDiv.firstChild) {
        pListDiv.removeChild(pListDiv.firstChild);
    }
    chrome.storage.local.get(null, function (result) {
        if (Object.keys(result).length > 0) {
            Object.keys(result).forEach(function (paperId) {
                let authorElm = result[paperId]['author'];
                if (result[paperId]['author'] === undefined || result[paperId]['abstract'] === undefined) {
                    authorElm = '<div class="spinner-border spinner-border-sm" role="status">' +
                        '<span class="sr-only">Loading...</span>' +
                        '</div>';
                    writeBtn.disabled = true;
                }
                let htmlStr = `<li class="list-group-item" id="div-${paperId}">
                       <p id="h-${paperId}">${result[paperId]['title']}</p>
                       <div  class="d-flex w-100 justify-content-between">
                       <small id="author-${paperId}">${authorElm}</small>
                       <button type="button" class="btn btn-light btn-sm" 
                       id="btn-del-${paperId}" value="${paperId}"><span class="oi oi-trash"></span></button>
                       </div></li>`;
                pListDiv.insertAdjacentHTML('beforeend', htmlStr);
                let btn = document.getElementById('btn-del-' + paperId);
                btn.addEventListener('click', function () {
                    removeFromLib(paperId, result[paperId]);
                });
            });
        } else {
            showWelcome();
        }
    });
}

function copyStringToClipboard(str) {
    let el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function showResult() {

    chrome.storage.local.get(null, function (result) {
        if (Object.keys(result).length > 0) {
            // backBtn.style.display = 'inline';
            writeBtn.style.display = 'none';
            delBtn.style.display = 'none';
            // btnGroup.style.display = 'none';
            while (pListDiv.firstChild) {
                pListDiv.removeChild(pListDiv.firstChild);
            }
            let rwList = [];
            let bibList = '';
            Object.keys(result).forEach(function (paperId) {
                console.log(result[paperId]);
                let bibtexStr = result[paperId]['bibtex'];
                if (bibtexStr !== undefined) {
                    let firstAuthorStart = bibtexStr.indexOf('author={') + 8;
                    let firstAuthorEnd = bibtexStr.indexOf(',', firstAuthorStart);
                    let fa = bibtexStr.substring(firstAuthorStart, firstAuthorEnd);
                    let bibId = bibtexStr.substring(bibtexStr.indexOf('{') + 1, bibtexStr.indexOf(','));
                    rwList.push(genRWTex(fa, result[paperId]['title'], result[paperId]['abstract'], bibId));
                    bibList += bibtexStr + '\n';
                }
            });
            let htmlStr = '';
            rwList.forEach(function (txt) {
                htmlStr += `<li class="list-group-item" >
                            <p>${txt}</p>
                        </li>`;
            });

            htmlStr += `<li class="list-group-item" >
                        <button type="button" class="btn btn-light-info btn-sm" id="btn-back"><span class="oi oi-chevron-left"></span></button>
                        <button type="button" class="btn btn-primary btn-sm" 
                        id="btn-copy-text">Copy text</button>
                        <button type="button" class="btn btn-primary btn-sm"
                        id="btn-copy-bib">Copy bibtex</button>
                    </li>`;
            pListDiv.insertAdjacentHTML('beforeend', htmlStr);
            document.getElementById('btn-copy-text').addEventListener('click', function () {
                copyStringToClipboard(rwList.join('\n'));
            });
            document.getElementById('btn-copy-bib').addEventListener('click', function () {
                copyStringToClipboard(bibList);
            });
            document.getElementById('btn-back').addEventListener('click', showPaperList);
        }
    });
}

function removeFromLib(paperId, paperInfo) {
    console.log("deleting " + paperId + "...");
    chrome.storage.local.remove(paperId, function () {
        chrome.storage.local.get(null, function (result) {
            if (Object.keys(result).length === 0) {
                showWelcome();
            } else {
                document.getElementById('div-' + paperId).remove();
            }
        });
    });
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {paperId: paperId, info: paperInfo}, null);
    });
}

function removeAll() {
    chrome.storage.local.get(null, function (result) {
        console.log(result);
        Object.keys(result).forEach(function (paperId) {
            removeFromLib(paperId, result[paperId]);
        });
    });
    showWelcome();
}
// removeAll();


