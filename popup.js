let mainDiv = document.getElementById('sub-div');
let delBtn = document.getElementById('btn-del-all');
delBtn.addEventListener('click', removeAll);
let writeBtn = document.getElementById('btn-write');
writeBtn.addEventListener('click', showResult);
let backBtn = document.getElementById('btn-back');
backBtn.addEventListener('click', showPaperList);


showPaperList();


function showPaperList() {
    backBtn.style.display = 'none';
    delBtn.style.display = 'block';
    writeBtn.style.display = 'block';
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild);
    }
    chrome.storage.local.get(null, function (result) {
        Object.keys(result).forEach(function (paperId) {
            let htmlStr = `<div class="row" id="div-${paperId}"><h6 id="h-${paperId}">${result[paperId]['title']}
                       </h6>
                       <button type="button" class="btn btn-primary btn-sm" 
                       id="btn-del-${paperId}" value="${paperId}">delete</button>
                       </div>`;
            mainDiv.insertAdjacentHTML('beforeend', htmlStr);
            let btn = document.getElementById('btn-del-' + paperId);
            btn.addEventListener('click', function () {
                removeFromLib(paperId, result[paperId]);
            });
        });
    });
}

function showResult() {
    backBtn.style.display = 'block';
    delBtn.style.display = 'none';
    writeBtn.style.display = 'none';
    while (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild);
    }
    let rwList = '';
    let bibList = '';
    chrome.storage.local.get(null, function (result) {
        Object.keys(result).forEach(function (paperId) {
            let bibtexStr = result[paperId]['bibtex'];
            let firstAuthorStart = bibtexStr.indexOf('author={') + 8;
            let firstAuthorEnd = bibtexStr.indexOf(',', firstAuthorStart);
            let fa = bibtexStr.substring(firstAuthorStart, firstAuthorEnd);
            let bibId = bibtexStr.substring(bibtexStr.indexOf('{')+1, bibtexStr.indexOf(','));
            rwList += `${fa} et al.~\\cite{${bibId}} propose...<br><br>`;
            bibList += bibtexStr + '<br><br>';
        });
        let htmlStr = `<p>${rwList}</p><p>${bibList}</p>`;
        mainDiv.insertAdjacentHTML('beforeend', htmlStr);
    });
}

function removeFromLib(paperId, paperInfo) {
    console.log("deleting " + paperId + "...");
    chrome.storage.local.remove(paperId, null);
    document.getElementById('div-' + paperId).remove();
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {paperId: paperId, info: paperInfo}, null);
    });
}

function removeAll() {
    chrome.storage.local.get(null, function(result) {
        Object.keys(result).forEach(function(paperId) {
            removeFromLib(paperId, result[paperId]);
        });
    });
}

/**
 * RW example:
 *
 * Valko et al.\cite{valko2011conditional} propose to use a classification model on the features
 * and the corresponding class label of an instance to find incorrectly assigned labels.
 *
 * @inproceedings{valko2011conditional,
	title={Conditional anomaly detection with soft harmonic functions},
	author={Valko, Michal and Kveton, Branislav and Valizadegan, Hamed and Cooper, Gregory F and Hauskrecht, Milos},
	booktitle={Data Mining (ICDM), 2011 IEEE 11th International Conference on},
	pages={735--743},
	year={2011},
	organization={IEEE}
}
 *
 */

