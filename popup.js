
document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('startGame').addEventListener('click', function() {
                var topicId = document.getElementById("topicId").value;
                var queryInterval = document.getElementById("queryInterval").value;
                chrome.extension.getBackgroundPage().reset(queryInterval, topicId);
            });
    }
);