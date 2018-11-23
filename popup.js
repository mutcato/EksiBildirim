$(document).ready(function(){
    $.getJSON( "https://banabenianlat.net/images/eksibildirim/popup.json", function( sata ) {
        document.getElementById('popup_title').innerHTML=sata['title']

        var default_message = sata['default_message'];
        var update_message = sata['update_message'];
        var current_version = sata['current_version'];
        $.getJSON( "manifest.json", function( data ) {
            console.log("Your version: "+data['version']);
            console.log("Current_version"+current_version);

            if(data['version'] < current_version){
                console.log(update_message);
                document.getElementById('popup_message').innerHTML=update_message;
                document.getElementById('popup_message').style.color = '#e60000';
            }else{
                console.log(default_message);
                document.getElementById('popup_message').innerHTML=default_message;
            }
        });

        
    });  
});
