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
	      	
	        //  "code":"chrome.runtime.sendMessage({\"content\":document.body.innerHTML})"
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
	var pageurl=msg.pageurl;
 	var st =$('<p />').html(msg.content); //document.createElement('p');
 	var tt=st.find(".main-photo");
 	var mainsrc=tt[0].attributes["src"].value.substring(2);
 	
 	window.localStorage['test-data']=mainsrc;
 	console.log("--finish--"+mainsrc);
 	var flickrFavorites=[];
 	//title<meta name="og:url" content="https://www.flickr.com/photos/hkvam/8672732039/"  data-dynamic="true">
  //var titleObj=st.find(".og:url");
 	//var mainsrc=titleObj[0].attributes["content"].value;
 		
 	if(window.localStorage['flickr-favoriteDs']){
 		flickrFavorites=JSON.parse(window.localStorage['flickr-favoriteDs']);
 	}
 	/*
 	 sample.push({
                   filename: '',
                   title: photo.title,
                   source: "",
                   source_url: "",
                   flickr:  _makePicUrl( photo )
                });
 	*/
 	if(mainsrc.substring(0, 7) != 'http://' & mainsrc.substring(0, 8) != 'https://')
	{
		mainsrc="http://"+mainsrc;
	}
 	flickrFavorites.push({
 		filename:'',
 		title:pageurl,
 		source:"",
 		source_url:"",
 		flickr:mainsrc
 		});
 		console.log("flickrFavorites' size="+flickrFavorites.length);
 		window.localStorage['flickr-favoriteDs']=JSON.stringify(flickrFavorites);
 		/*if(window.webkitNotifications){
 			var notification=windows.webkitNotifications.createNotification('img/notification.png','Hello Title','Content...');
 			notification.show();
 		//}
 		*/
 		var d=new Date();
 		var opt = {
        type: "basic",
        title: "Flickr tab@Sherlock",
        message: mainsrc+" added successfully! \r\nTotal "+flickrFavorites.length+" images",
        iconUrl: "img/notification.png"
	  };
	  chrome.notifications.create("ID"+d.getTime(),opt,function(){});
 		/*var notification = chrome.notifications.create('itemAdd',opt,function(){});

  	notification.show();
*/
 		
 		
 	//alert("main photo="+mainsrc);
});

