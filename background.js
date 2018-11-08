var messages = new Array();
var lastIDs = [];


engine();
$(function(){
    setInterval(engine, 1000*30);
});




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

function getAdvertisement(){
    $.get("http://banabenianlat.net/images/eksibildirim/advertisement.json", function(data){


    });
}

function engine(){
    var ids = [];
    var new_topics = [];
    var notifs = [];
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
                    notifs.push(messages[topic_id]);
                }
            }
            var rklm = [];
            $.ajax({
                url: "http://banabenianlat.net/images/eksibildirim/ad.json",
                success: function(data){
                    
                    rklm[0] = data.baslik;
                    rklm[1] = data.url;
                    rklm[2] = data.is_active; //if it is one rklm will be shown
                }});
            notifs.push(rklm);
            console.log("notifs: ");
            console.log(notifs);

            for(let notif of notifs){
                NotificationBasic(notif[0], 'Yeni başlık', notif[1]);
            }

            chrome.notifications.onButtonClicked.addListener(function(notifId){
                for(let myNotification of myNotifications){
                     if(notifId == myNotification.nid){
                        window.open("https://eksisozluk.com"+myNotification.nhref); 
                    }                    
                }
     
            });


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


