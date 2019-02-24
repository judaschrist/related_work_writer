let papers = document.body.getElementsByClassName('gs_ri');
console.log(papers.length + ' papers on the page');

for (let i = 0; i < papers.length; i++) {
    let button = document.createElement('a');
    // button.className = "credo_button";
    button.innerHTML = "Add to RW";
    button.addEventListener('click', function () {
        addToLib(papers[i])
    });
    papers[i].getElementsByClassName('gs_fl')[0].appendChild(button);
}

function addToLib(paper) {
    let title = paper.getElementsByClassName('gs_rt')[0].textContent;
    console.log(title)
}