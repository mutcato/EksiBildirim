var options = {
    type: "basic",
    title: "First notification",
    message: "Notification message: This is cool.",
    iconUrl: "icon.png"
};

chrome.notifications.create(options, callback);

function callback(){
    alert('this is callback function')
}