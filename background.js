
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
var cached = new Map();
var listItemStorage = new Array();
var storeAndShowTheDifference = function(json) {
    var obj = JSON.parse(json);
    for (i = 0; i < obj.data.length; i++) {
        var data = obj.data[i];
        if (cached.get(data.id)) {
            continue;
        }
        cached.set(data.id, data.title);
        if (data.follower_count > 1000) {
            // FROM: https://api.zhihu.com/questions/59977836
            // TO: https://www.zhihu.com/question/59977836
            var item = {};
            var prefix = 'https://www.zhihu.com/question/';
            item.url = prefix + data.url.match("[0-9]+")[0];
            item.title = data.title;
            listItemStorage.splice(0, 0, item);
            updateBadge();
        }
    }
};

// badge stuff 
function updateBadge() {
    var text = (listItemStorage.length <= 0) ? ""
        : "" + listItemStorage.length;
    chrome.browserAction.setBadgeText({text: text});
}

// notification part
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
var query = function(operation) {
    guestApi.request(operation, function(data) {
            storeAndShowTheDifference(data);
    });

    query.counter = query.counter + 1;
    if (query.counter > 10000) {
        console.log("query times reach at 10000, forced closed");
        clearInterval(queryInterval);
    }
};
query.counter = 0;
var queryInterval;

// main() part

var instance = {};
instance.queryCycle = 6000;
instance.topicId = 19554300;
var reset = function(queryCycle, topicId) {
    if (queryInterval) clearInterval(queryInterval);
    var operation = "topics/" + topicId + "/activities_new";
    instance.topicId = topicId;
    instance.queryCycle = queryCycle;
    queryInterval = setInterval(query(operation), queryCycle);
};
reset(instance.queryCycle, instance.topicId);