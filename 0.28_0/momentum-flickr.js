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
	        	  "code":"chrome.runtime.sendMessage({\"content\":document.body.innerHTML,\"pageurl\":document.URL})"
	      	}
	      );
    });
    
		
		
	}
	
	
});


chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) 
{
	var pageurl=msg.pageurl;
 	var st =$('<p />').html(msg.content); //document.createElement('p');
 	var tt=st.find(".main-photo");
 	var mainsrc=tt[0].attributes["src"].value.substring(2);
 	
 	var flickrFavorites=[];
 	if(window.localStorage['flickr-favoriteDs']){
 		flickrFavorites=JSON.parse(window.localStorage['flickr-favoriteDs']);
 	}
	if(mainsrc.substring(0, 7) != 'http://' & mainsrc.substring(0, 8) != 'https://')
	{
		mainsrc="http://"+mainsrc;
	}
	/*
	var c = new Backbone.Collection();
	c.localStorage = new Backbone.LocalStorage("flickr-settingFavorites");
	c.fetch();
	console.log(c.pluck('title'));
	*/
 	flickrFavorites.push({
 		filename:'',
 		title:pageurl,
 		source:"",
 		source_url:"",
 		flickrurl:mainsrc
 		});
 		console.log("flickrFavorites' size="+flickrFavorites.length);
 		window.localStorage['flickr-favoriteDs']=JSON.stringify(flickrFavorites);
 		var d=new Date();
 		var opt = {
        type: "basic",
        title: "Flickr tab@Sherlock",
        message: pageurl+" added successfully! \r\nTotal "+flickrFavorites.length+" images",
        iconUrl: "img/notification.png"
	  };
	  
	 // m.collect.settingFavorites.create({ title:pageurl,flickr:mainsrc });
	 console.log("i999:"+pageurl+","+mainsrc);
	  chrome.notifications.create("ID"+d.getTime(),opt,function(){});
});

