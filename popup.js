let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
    console.log('click!!!');
    chrome.storage.local.get(null, function(result) {
        console.log('Value currently is ' + JSON.stringify(result));
    });
};
