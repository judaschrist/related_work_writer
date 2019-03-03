let mainDiv = document.getElementById('main');

chrome.storage.local.get(null, function(result) {
    Object.keys(result).forEach(function(paperId) {
        console.log(paperId, result[paperId]);
        let div = document.createElement('div');
        div.innerHTML = result[paperId]['title'];
        div.setAttribute('class', 'row');
        mainDiv.appendChild(div);
    });
    // for (let i = 0; i < papers.length; i++) {
    //     let title = papers[i].getElementsByClassName('gs_rt')[0].textContent;
    //     let otherInfo = {title: title};
    //     let paperId = papers[i].getAttribute('data-cid');
    //     let button = null;
    //     if (result[paperId] === undefined) {
    //         button = document.createElement('button');
    //         button.innerHTML = "Add to RW";
    //         button.setAttribute("id", "btn_" + paperId);
    //         button.addEventListener('click', onClickAddBtn(paperId, button, otherInfo));
    //     } else {
    //         button = document.createElement('button');
    //         button.innerHTML = "Added";
    //     }
    //     let nodesToAdd = papers[i].getElementsByClassName('gs_fl');
    //     nodesToAdd[nodesToAdd.length-1].appendChild(button);
    //     // console.log(paperId + "----" + result[paperId]);
    // }

});

let delBtn = document.getElementById('delete-btn');
delBtn.addEventListener('click', removeAll);

function removeFromLib(paperId) {
    chrome.storage.local.remove(paperId, null);
}

function removeAll() {
    chrome.storage.local.clear();
}

