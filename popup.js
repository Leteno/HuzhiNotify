
var backgroundPage = chrome.extension.getBackgroundPage();
document.addEventListener('DOMContentLoaded', function() {
        var topicId = document.getElementById("topicId");
        var queryInterval = document.getElementById("queryInterval");
        topicId.value = backgroundPage.instance.topicId;
        queryInterval.value = backgroundPage.instance.queryCycle;
        document.getElementById('startGame').addEventListener('click', function() {
                backgroundPage.reset(queryInterval.value, topicId.value);
            }
        );

        var listBtn = document.getElementById('list-button');
        var listPanel = document.getElementById('list');
        var optionBtn = document.getElementById('option-button');
        var optionPanel = document.getElementById('option');
        listBtn.addEventListener('click', function() {
                optionPanel.style.display = 'none';
                listPanel.style.display = 'block';
            }
        );
        optionBtn.addEventListener('click', function() {
                listPanel.style.display = 'none';
                optionPanel.style.display = 'block';
            }
        );
        var itemList = backgroundPage.listItemStorage;
        itemList.forEach(function(item, index, array) {
                var viewholder = document.createElement('div');
                viewholder.className = 'list-item';
                var title = document.createElement('label');
                title.className = 'list-item-title';
                title.innerHTML = item.title;
                var icon = document.createElement('img');
                icon.className = 'list-item-icon';
                icon.src = 'Liu.png';
                viewholder.appendChild(title);
                viewholder.appendChild(icon);
                viewholder.addEventListener('click', function() {
                        chrome.tabs.create({url: item.url});
                        var index = itemList.indexOf(item);
                        if (index >= 0) {
                            itemList.splice(index, 1);
                            backgroundPage.updateBadge();
                        }
                    }
                );
                listPanel.appendChild(viewholder);
            }
        );
     }
);
