var ids = [];
var messages = new Array();
var latestID;


/*
$(function(){
    $.get("https://eksisozluk.com/basliklar/bugun/1?id=5584631&day=2018-10-17", function(data){
        var htmlData = data;
		$data = $(htmlData).find('.topic-list').eq(0);
        $('body').append($data);
        for(i=0; i<$data.find('li').length; i++){
            let regexp = /--(\d+)\D/;
            let str = ($($data).find('li').eq(i).html());
            
            let match = regexp.exec(str);
            console.log(match);
            if (match){
                ids[i] = Object.values(match)[1]; //We convert ocject to array. Because getting [1] index.
            }     
            messages[i] = ($($data).find('li').eq(i).text()).replace(/\n/g,'').trim();
        }
        console.log(messages)
        console.log(ids)
    })
});
*/
engine();
$(function(){
    setInterval(engine, 1000*30);
});

function NotificationBasic(NotificationTitle, NotificationMessage){
    var options = {
        type: "basic",
        title: NotificationTitle,
        message: NotificationMessage,
        contextMessage: "Ekşi Bildirim",
        buttons: [{
            title: "Başlığa git-->"
        }],
        iconUrl: "icon.png"
    };
    chrome.notifications.create(options);
}

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

function engine(){
    var newMessages = new Array();
    $.get("https://eksisozluk.com/basliklar/bugun/1?id=5584631&day=2018-10-17", function(data){
        console.log('this is engine mofo');
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


        if(latestID == ids[0]){
            //no update
            console.log('no update');
        } else if(latestID === undefined){
            //first run
            var options = {
                type: "basic",
                title: "First notification",
                message: "Notification message: This is cool.",
                iconUrl: "icon.png"
            };
            chrome.notifications.create(options);
            latestID = ids[0];
            
        } else if(latestID != ids[0]){
            Nitems = [];
            for(j = 0; j<=messages.length; j++){
                console.log("j= "+j);
                console.log("ids[j]= "+ids[j]);
                console.log("MESSAGES: "+messages[j]);
                if(latestID == ids[j]){
                    console.log("BREAK")
                    break;
                } else{
                    newMessages[j] = messages[j];
                }   
            }
            //NotificationList("Bugün Açıldı", "İlk entrysi bugün girilen başlıklar" ,Nitems);
            latestID = ids[0];
            
        }
        
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

    })
}

