var lastIDs = [];


engine();
$(function(){
    setInterval(engine, 1000*60);
});


function newTopics(lastIDs, ids){
    var array3 = array2.filter(function(obj) { 
        return array1.indexOf(obj) == -1; 
    });
}

function engine(){
    var ids = Array.from({length: 12}, () => Math.floor(Math.random() * 39));
    var new_topics = [];

    console.log(ids);
    console.log(lastIDs);

    if(lastIDs.length < 1){
        lastIDs = ids;
        console.log("birden küççük");
        
    } else if(lastIDs.length > 0){
        var new_topics = lastIDs.filter(function(obj) { 
            return ids.indexOf(obj) == -1; 
        });
        console.log(new_topics);
        lastIDs = ids;
        console.log("birden büyük");
    }
    

}
