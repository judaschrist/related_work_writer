let mainDiv = document.getElementById('main');

chrome.storage.local.get(null, function(result) {
    Object.keys(result).forEach(function(paperId) {
        let htmlStr = `<div class="row" id="div-${paperId}"><h6 id="h-${paperId}">${result[paperId]['title']}
                       </h6>
                       <p>${JSON.stringify(result[paperId], null, 2)}</p>
                       <button type="button" class="btn btn-primary btn-sm" 
                       id="btn-del-${paperId}" value="${paperId}">delete</button>
                       </div>`;
        mainDiv.insertAdjacentHTML('beforeend', htmlStr);
        let btn = document.getElementById('btn-del-' + paperId);
        btn.addEventListener('click', function () {
            removeFromLib(paperId, result[paperId]);
        });
        let title = document.getElementById('h-' + paperId);
    });
});

let delBtn = document.getElementById('btn-del-all');
delBtn.addEventListener('click', removeAll);

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

