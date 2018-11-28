// zchrome_url'den son stanby_seconds kadar zaman içindeki urlleri al. içlerinde jsondaki urller varsa çalıştırma yoksa aşağıdaki çalışsın
// eğer son db'de ikigün içinde rklm url'si yer almıyorsa storage_id'yi create_session.php dosyasına post et.
// users tablosunda storage_id kolonu aç $_SESSION['storage_id] varsa onu gir


var storageID;

StartWithGetChromeStorage();
set_app_data();
$(function(){
    setInterval(function () {
        StartWithGetChromeStorage();
        set_app_data();
    }, 1000*60*15);
});


/**
 * 1) Gets user id from Chrome storage
 */
function StartWithGetChromeStorage(){
    chrome.storage.sync.get("id", function(data) {
        storageID = data.id;
        if(storageID == undefined){
            $.ajax({
                url:'https://eksisozluk.com/basliklar/bugun/1?id=5584631&day=2018-10-17',
                type:'get',
                success: function(data){
                    var htmlData = data;
                    var EksiID = [];
                    let str = $(htmlData).find("#top-navigation").find("ul").eq(0).find(".not-mobile").eq(0).find("a").attr("href");
                    

                    if(str!=undefined){ // Evet Ekşi login
                        str = str.replace("/biri/", "");
                        EksiID.push(str);
                        // 3) Google DB'de mevcut mu?
                        $.post("https://banabenianlat.net/ChromeExtensions/EksiBildirim/is_social_ids_in_db.php",
                        {
                            postdata:{socialID:EksiID}

                        },
                            function(data, status){
                                if(data > 0){ // Evet. Ekşi DB'de Mevcut
                                    storageID = data;
                                    CreateUserStorage(storageID);
                                    console.log(storageID);
                                } else {
                                    $.ajax({
                                        url:'https://banabenianlat.net/ChromeExtensions/EksiBildirim/getLastIDFromDB.php',
                                        type:'get',
                                        success: function(data){
                                            storageID = Number(data)+1;
                                            console.log(storageID);
                                            CreateUserStorage(storageID);
                                            $.post("https://banabenianlat.net/ChromeExtensions/EksiBildirim/createsocialid.php",
                                            {
                                                postdata:{socialID:EksiID,storageID:storageID,form_factor:2}
                                            },
                                            function(data, status){
                                            });
            
                                        }
                                    });                                   
                                }
                            }               
                        );
                    } else { // Hayır Ekşi login değil.
                        $.ajax({
                            url:'https://banabenianlat.net/ChromeExtensions/EksiBildirim/getLastIDFromDB.php',
                            type:'get',
                            success: function(data){
                                storageID = Number(data)+1;
                                console.log(storageID);
                                CreateUserStorage(storageID);
                                $.post("https://banabenianlat.net/ChromeExtensions/EksiBildirim/createsocialid.php",
                                {
                                    postdata:{socialID:EksiID,storageID:storageID,form_factor:2}
                                },
                                function(data, status){
                                });

                            }
                        }); 
                    }
                }
            });
        } else { // Storage var
            $.ajax({
                url:'https://eksisozluk.com/basliklar/bugun/1?id=5584631&day=2018-10-17',
                type:'get',
                success: function(data){
                    var htmlData = data;
                    var EksiID = [];
                    let str = $(htmlData).find("#top-navigation").find("ul").eq(0).find(".not-mobile").eq(0).find("a").attr("href");
                    // EkşiID alınabiliyor mu?
                    if(str!=undefined){  // Alınabiliyor. 
                        //O halde DB'ye gir.
                        str = str.replace("/biri/", "");
                        console.log(storageID);
                        EksiID.push(str);
                        $.post("https://banabenianlat.net/ChromeExtensions/EksiBildirim/createsocialid.php",
                        {
                            postdata:{socialID:EksiID,storageID:storageID,form_factor:2}
                        },
                        function(data, status){
                        });                        
                    }                   
                }
            });

        }
    });
}

/**
 * Creates id variable into users chrome storage
 * @param {integer} value 
 */
function CreateUserStorage(value){
    chrome.storage.sync.set({"id": value}, function() {
    });
}

function set_app_data(){
    chrome.storage.sync.get("id", function(data) {
        var user_id = data.id;
        if(data.id != undefined){

            $.getJSON('manifest.json', function(app_data) {
                /**
                 * Gets location by coordinates.
                 */
                var short_name = app_data['short_name'];
                var version = app_data['version'];   
                $.post("https://banabenianlat.net/ChromeExtensions/EksiBildirim/set_app_data.php",
                {
                    app_data:{storageID:user_id, short_name:short_name,version:version}
                },
                function(return_data, status){
                    console.log("status: "+status);
                    console.log("app_data: "+return_data);
                }
            );       

            });

        }
    });    
}



//Güncel sürüm çıktıysa iconu değiştirir.
$(document).ready(function(){
    $.getJSON( "https://banabenianlat.net/images/eksibildirim/popup.json", function( sata ) {
        var latest_version = sata['current_version'];
        $.getJSON( "manifest.json", function( data ) {
            console.log("my version: "+data["version"]);
            console.log("latest version: "+latest_version);
            if(data['version'] < latest_version){
                chrome.browserAction.setIcon({path: "icon/icon_update.png"});
            }else{

            }
        });

        
    });  
});








var messages = new Array();
var lastIDs = [];
var sayac = 0;



engine();

$(function(){  
    setInterval(engine_isactive, 1000*60);
});

function engine_isactive(){
    chrome.storage.sync.get("is_active", function(data){
        console.log(data.is_active);
        if(data.is_active!=0){
            engine();
            console.log(sayac);
        } else {
            chrome.browserAction.setIcon({path: "icon/icon16_passive.png"});
        }
    });
}



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
                    NotificationBasic(messages[topic_id][0], 'Yeni başlık', "https://eksisozluk.com"+messages[topic_id][1]);
                }
            }
            chrome.notifications.onButtonClicked.addListener(function(notifId){
                for(let myNotification of myNotifications){
                     if(notifId == myNotification.nid){
                        window.open(myNotification.nhref); 
                    }                    
                }
     
            });
            console.log(new_topics);
            lastIDs = ids;
            console.log("birden büyük");
        }
        
        function NotificationBasic(NotificationTitle, NotificationMessage, href){
            var options = {
                type: "basic",
                title: NotificationTitle,
                message: NotificationMessage,
                iconUrl: "icon/icon.png",
                contextMessage: "Ekşi Bildirim",
                buttons: [{
                    title: "Başlığa git-->"
                }]
            };
            chrome.notifications.create(options, function(id){
                myNotifications.push({nid:id, nhref:href});
            });
        }

        if(sayac>0){reklm();} // belirli bir dakika sonra reklm fonksiyonu çalışır.
        function reklm(){
            $.getJSON( "https://banabenianlat.net/images/eksibildirim/reklm.json", function( reklm_data ) {
                for(oge of reklm_data.reklm){
                    console.log(oge);
                    //is_visited_in_last_days();
                    NotificationBasic(oge["title"], "Destek", oge["url"]);
                }
            }, function(error){
                console.log(error);
            });  
        }
        sayac += 1;

    })

}




/*
//Get email
chrome.identity.getProfileUserInfo(function(userinfo){
    console.log("userinfo",userinfo);
    email=userinfo.email;
    uniqueId=userinfo.id;
    console.log(email);
    console.log(uniqueId);
  });
*/
