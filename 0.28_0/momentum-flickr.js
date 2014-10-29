// Momentum Extension Event Page
(function () {


})();


var previousTab;
var currentTab;
chrome.tabs.onSelectionChanged.addListener(function(tab) {
	 		console.log("onSelectionChanged:"+tab.url);
	    if (previousTab == null) {
	        previousTab = tab;
	    }
	    if (currentTab == null) {
	        currentTab = tab;
	    }
	    else {
	        previousTab = currentTab;
	        currentTab = tab;
	    }
	});
 
chrome.commands.onCommand.addListener(function(command) {
	if(command=="toggle-feature-foo"){
		chrome.tabs.getSelected(null, function(tab) {
        console.log("getselected:"+tab.url);
        previousTab = tab.id;
        
        currentTab = null;
        
        	//console.log("flickr query url="+tab[0].url);
	      if(tab.url.substring(0, 21) != 'http://www.flickr.com' & tab.url.substring(0, 22) != 'https://www.flickr.com')
	      {
	        console.log("not flickr page@getselected");
	        return;
	      }
	
	      chrome.tabs.executeScript
	      (
	        tab.id, 
	        {
	          "code":"chrome.runtime.sendMessage({\"content\":document.body.innerHTML})"
	      	}
	      );
        
        
    });
    
		//chrome.tabs.update(previousTab, {selected: true});
		chrome.tabs.query
	  (
	    {active:true},
	    function(tab)
	    {
	    	console.log("flickr query url="+tab[0].url);
	    	/*
	    	//console.log("flickr query url="+tab[0].url);
	      if(tab[0].url.substring(0, 21) != 'http://www.flickr.com' & tab[0].url.substring(0, 22) != 'https://www.flickr.com')
	      {
	        console.log("not flickr page2");
	        return;
	      }
	
	      chrome.tabs.executeScript
	      (
	        tab[0].id, 
	        {
	          "code":"chrome.runtime.sendMessage({\"content\":document.body.innerHTML})"
	        });*/
	    });
		
	}
	
	
});
chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) 
{
	if(window.localStorage['test-data']){
		console.log("last access:"+window.localStorage['test-data']);
	}
 	var st =$('<p />').html(msg.content); //document.createElement('p');
 	var tt=st.find(".main-photo");
 	var mainsrc=tt[0].attributes["src"].value.substring(2);
 	
 	window.localStorage['test-data']=mainsrc;
 	console.log("--finish--"+mainsrc);
 	//alert("main photo="+mainsrc);
});

