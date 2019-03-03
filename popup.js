let mainDiv = document.getElementById('main');

chrome.storage.local.get(null, function(result) {
    Object.keys(result).forEach(function(paperId) {
        let htmlStr = `<div class="row" id="div-${paperId}"><h6>${result[paperId]['title']}
                       </h6><button type="button" class="btn btn-primary btn-sm" 
                       id="btn-del-${paperId}" value="${paperId}">delete</button>
                       </div>`;
        mainDiv.insertAdjacentHTML('beforeend', htmlStr);
        let btn = document.getElementById('btn-del-' + paperId);
        btn.addEventListener('click', function () {
            removeFromLib(paperId, result[paperId]);
        });
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
    chrome.storage.local.clear();
}

