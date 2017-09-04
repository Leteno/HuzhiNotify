
var backgroundPage = chrome.extension.getBackgroundPage();
document.addEventListener('DOMContentLoaded', function() {
        var topicId = document.getElementById("topicId");
        var queryInterval = document.getElementById("queryInterval");
        topicId.value = backgroundPage.instance.topicId;
        queryInterval.value = backgroundPage.instance.queryCycle;
        document.getElementById('startGame').addEventListener('click', function() {
                backgroundPage.reset(queryInterval.value, topicId.value);
            });
    }
);