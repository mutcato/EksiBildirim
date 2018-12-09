$(document).ready(function(){
    $.getJSON( "https://banabenianlat.net/images/eksibildirim/popup.json", function( sata ) {
        document.getElementById('popup_title').innerHTML=sata['title']

        var default_message = sata['default_message'];
        var update_message = sata['update_message'];
        var current_version = sata['current_version'];
        var store_url = sata['store_url'];
        $.getJSON( "manifest.json", function( data ) {
            console.log("Your version: "+data['version']);
            console.log("Current_version"+current_version);

            if(data['version'] < current_version){
                console.log(update_message);
                document.getElementById('popup_message').innerHTML=update_message;
                document.getElementById('popup_message').style.color = 'white';
                document.body.style.backgroundColor = "red";
                document.getElementById('popup_message').setAttribute("href",store_url);
            }else{
                console.log(default_message);
                document.getElementById('popup_message').innerHTML=default_message;
                document.getElementById('popup_message').setAttribute("href",store_url);
            }
        });

        
    });  
});

//Storagedaki is_active 0 ise sliderı pasif konuma getiriyor.
chrome.storage.sync.get("is_active", function(data){
    if(data.is_active == 0){
        chrome.browserAction.setIcon({path: "icon/icon16_passive.png"}, function(){
            document.getElementById("chckbx").checked = false;
            document.getElementById("is_active_text").innerHTML = "Pasif"
        });      
    } else {
        chrome.browserAction.setIcon({path: "icon/icon16.png"}, function(){
            document.getElementById("chckbx").checked = true;
            document.getElementById("is_active_text").innerHTML = "Aktif"
        });         
    }
});

//Slider Aktif - Pasif
document.addEventListener('DOMContentLoaded', function () {
    var checkbox = document.querySelector('input[type="checkbox"]');
  
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        // do this
        chrome.storage.sync.set({"is_active": 1}, function(){
            chrome.browserAction.setIcon({path: "icon/icon16.png"});
            document.getElementById("is_active_text").innerHTML = "Aktif"
            console.log('Checked'); 
        });
      } else {
        // do that
        chrome.storage.sync.set({"is_active": 0}, function(){
            chrome.browserAction.setIcon({path: "icon/icon16_passive.png"});
            document.getElementById("is_active_text").innerHTML = "Pasif"
            console.log('Not checked'); 
        });
        
      }
    });
  });