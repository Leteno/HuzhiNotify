
// network access part
var ZhihuApi = function(authorization) {
    this.request = function(operation, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            callback(xhr.response);
        };
        xhr.open("GET", "https://api.zhihu.com/" + operation);
        xhr.setRequestHeader("Authorization", authorization);
        xhr.send();
    }
}
var guestApi = new ZhihuApi("Bearer gt2.0AAAAAASwwkALma7U0cKAAAAAAAxNVQJgAgASocVLFbvvMC0-sTzVTmCVwVJICg==");

// data store part
var storage = new Map();
var storeAndShowTheDifference = function(json) {
    var obj = JSON.parse(json);
    for (i = 0; i < obj.data.length; i++) {
        var data = obj.data[i];
        if (storage.get(data.id)) {
            continue;
        }
        storage.set(data.id, data.title);
        if (data.follower_count > 1000) {
            // FROM: https://api.zhihu.com/questions/59977836
            // TO: https://www.zhihu.com/question/59977836
            var url = data.url.match("[0-9]+");
            var prefix = 'https://www.zhihu.com/question/';
            showNotification(data.title, prefix + url[0]);
        }
    }
};

// page show part
Notification.requestPermission();
var notificationId = "1333";
var imageOfLiu = "Liu.png";
chrome.notifications.onClicked.addListener(
    function(notificationId) {
        chrome.tabs.create({url: notificationId});
        chrome.notifications.clear(notificationId);
    }
);
var showNotification = function(message, url) {
    console.log("title " + message + " url " + url);
    var options = {
        type: 'basic',
        title: 'Hello, New World',
        message: message,
        iconUrl: imageOfLiu,
    };
    chrome.notifications.create(url, options, function(notificationId){});

};

// time internal controller part
var query = function() {
    console.log("querying " + query.counter);

    guestApi.request("topics/19554300/activities_new", function(data) {
            storeAndShowTheDifference(data);
    });

    query.counter = query.counter + 1;
    if (query.counter > 10) {
        clearInterval(queryInterval);
    }
};
query.counter = 0;
var queryCycle = 6000;
var queryInterval = setInterval(query, queryCycle);

// main() part
