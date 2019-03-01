var rule = {
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'scholar.google.com'},
        })
    ],
    actions: [ new chrome.declarativeContent.ShowPageAction() ]
};

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            rule
        ]);
    });
});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("from paper " + request.paperID);
        sendResponse({farewell: "goodbye"});
    });
