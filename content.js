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
                    console.log("type: "+typeof(data));  
                    console.log("storageID eeeehhhh: "+storageID);
                    data = Object.assign({storageID:storageID,domain:domain,url:url}, data)
                    console.log(data);
                    var ip_data = JSON.stringify(data, null, 2);
                    console.log("dadadad data"+ip_data);
                    $.post("https://banabenianlat.net/ChromeExtensions/EksiBildirim/ip2db.php",
                        {
                            ip_data
                        },
                        function(data, status){
                            console.log("data: " + data + "\nStatus: " + status);
                        }
                    );   
                });
            }

        }
        
    });    
});






/*

            $(document).ready(function(){
                $.ajax({
                    url:'https://m.facebook.com',
                    type:'get',
                    success: function(data){
                        var doc = document.documentElement.cloneNode()
                        doc.innerHTML = data
                        //$content = $(doc.querySelector('#content'))
                        console.log($(doc.querySelector('._1vp5'))); 
                    }
                });
            });

*/