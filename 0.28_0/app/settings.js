// Settings Widget


// Models

m.models.SettingFavorite= Backbone.Model.extend({
   defaults: function() {
        return {
            title: "empty todo...",
            flickrurl: ""
        };
    }
  
  });
//main.jsassign collection
m.collect.SettingFavorites= Backbone.Collection.extend({
  model: m.models.SettingFavorite,
    localStorage: new Backbone.LocalStorage("flickr-settingFavorites"),
    initialize: function () 
    {
     	  
 				
    },
    create: function(model, options) {
        return Backbone.Collection.prototype.create.call(this, model, options);
    }
});


m.models.Settings = Backbone.Model.extend({
    
    initialize: function () {
        // setting default value for showTodoList
        if (!localStorage['showSettingsList']) {
        	  console.log("initialize showSettingsList...");
            localStorage['showSettingsList'] = false;
        }
        if (!localStorage['isshowTodoVisible']) {
        	console.log("initialize showSettingsList...");
            localStorage['isshowTodoVisible'] = false;
        }
        if (!localStorage['isshowSayHelloVisible']) {
        	console.log("initialize isshowSayHelloVisible...");
            localStorage['isshowSayHelloVisible'] = false;
        }
        if (!localStorage['isshowFocusVisible']) {
        	console.log("initialize isshowFocusVisible...");
            localStorage['isshowFocusVisible'] = false;
        }
        if (!localStorage['isshowWeatherVisible']) {
        	console.log("initialize isshowWeatherVisible...");
            localStorage['isshowWeatherVisible'] = false;
        }
        if (!localStorage['isshowQuoteVisible']) {
        	console.log("initialize isshowQuoteVisible...");
            localStorage['isshowQuoteVisible'] = false;
        }
        if (!localStorage['TimeoutSetting']) {
        	console.log("initialize TimeoutSetting...");
            localStorage['TimeoutSetting'] = 3;
        }
        if (!localStorage['isLoadLocalImage']) {
        	console.log("initialize isLoadLocalImage...");
            localStorage['isLoadLocalImage'] = true;
        }
        if (!localStorage['isLoadFlickrSearchImage']) {
        	console.log("initialize isLoadFlickrSearchImage...");
            localStorage['isLoadFlickrSearchImage'] = true;
        }
        if (!localStorage['isLoadFlickrFavoriteImage']) {
        	console.log("initialize isLoadFlickrFavoriteImage...");
            localStorage['isLoadFlickrFavoriteImage'] = true;
        }
        
        //window.localStorage['loading']
        
    },
    localStorage: new Backbone.LocalStorage("momentum-settings"),
    settingFavorites:new m.collect.SettingFavorites(),
    defaults:{
        
        
    }
});


m.views.SettingFavorite = Backbone.View.extend({
   tagName: "li",
   template: Handlebars.compile($("#setting-favorite-item-template").html()),
    events: {
        "click a.destroy" : "clear"
       },
    initialize: function(options) {
        	 
        this.parent = options.parent;
        this.listenTo(this.model, 'change', this.render);
        this.render();
     //  this.listenTo(this.collection, 'add', this.addOneFavorite);
       // this.listenTo(this.collection, 'reset', this.addAllFavorites);
    },
   
    render: function() {
    		//console.log("--INITIAL todo.Todo UI--@"+ (new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + (new Date()).getSeconds());
     
        var title = this.model.get('title');
        var flickrurl = this.model.get('flickrurl');
       // if (this.model.get('done')) { var checked = 'checked' };
        var variables = { title: title, flickrurl: flickrurl };
        this.$el.html(this.template(variables));
        //this.$el.toggleClass('done', this.model.get('done'));
        this.$el.prop('draggable', 'true');

        return this;
    },
    clear: function() {
        _gaq.push(['_trackEvent', 'Todo', 'Delete']);
        this.model.destroy();
    },
    close: function() {
        // cancel edit if esc key hit
        var value = this.$el.find('.edit').val();
        if (!value) {
            this.clear();
        } else {
            this.model.save({ title: value });
            this.$el.removeClass("editing");
        }
    }
});


// Collections

// Views
m.views.Settings=Backbone.View.extend({
		tagName: "li",
		attributes: { id: 'settings'},
		template: Handlebars.compile($("#settings-template").html() ),
    events: {
        "click .settings-toggle"   : "toggleShow",
       	"click .showtodo"   : "showTodoVisible",
       	"click .showsayhello"   : "showSayHelloVisible",
       	"click .showfocus"   : "showFocusVisible",
       	"click .showweather"   : "showWeatherVisible",
       	"click .showquote"   : "showQuoteVisible",
       	"click .isLoadLocalImage"   : "loadLocalImage",
       	"click .isLoadFlickrSearchImage"   : "loadFlickrSearch",
       	"click .isLoadFlickrFavoriteImage"   : "loadFavorites",
       	"click .clearFavorite" : "clearFavorite",
       	"click .exportFavorites" : "exportFavorites",
       	"keypress #timeout-setting":  "setTimeoutOnEnter",
    },
    
     initialize: function () {
      _.bindAll(this, 'addOneFavorite', 'addAllFavorites');
        this.listenTo(this.collection, 'add', this.addOneFavorite);
        this.listenTo(this.collection, 'reset', this.addAllFavorites);
        
       
      
        
        
     		this.render();
     		this.collection.fetch();
				return this;
    },
    addOneFavorite: function(favorite) {
        var favoriteView = new m.views.SettingFavorite({ model: favorite, parent: this });
        this.$(".favoriteList ol").append(favoriteView.render().el);
    },
    addAllFavorites: function() {
        _.each(this.collection.models, this.addOneFavorite);
    },
    setTimeoutOnEnter: function (e) {
    	console.log("---setTimeoutOnEnter---");
       // _gaq.push(['_trackEvent', 'Todo', 'Add']);
        var val = this.$el.find('#timeout-setting')[0].value;
        //if (e.keyCode != 13) return;
        if (!val) return;
        if (val>100){
        	alert("It will loading too long...");
        	}
        console.log(val);
        if(typeof (parseInt(val ))== 'number'){
 						//window.localStorage['loading']=parseInt(val );
 				}
 				else{
 					console.log("setting initial 5 sec");
 					val=5;
						//	window.localStorage['loading']=5000;
 					
 				}
        
        
        localStorage['timeoutSettingValue']=val;
        window.localStorage['loading']=val*1000;
        //this.collection.create({ title: val });
        //this.$el.find('#timeout-setting')[0].value = '';
    },
    showTodoVisible:function (e){
    	
    	console.log("showTodoVisible");
    	localStorage['isshowTodoVisible']=!JSON.parse(localStorage['isshowTodoVisible']);
    	$("#bottom-right").css("opacity",JSON.parse(localStorage['isshowTodoVisible'])?"1":"0");
   		$("#todo-complete").css("opacity",JSON.parse(localStorage['isshowTodoVisible'])?"1":"0");
   			
    },
    
    showSayHelloVisible:function (e){
    	//console.log("showSayHelloVisible");
    	localStorage['isshowSayHelloVisible'] = !JSON.parse(localStorage['isshowSayHelloVisible']);
   
   	
    	console.log("isshowSayHelloVisible="+localStorage['isshowSayHelloVisible']);
    	$("#center").css("opacity",JSON.parse(localStorage['isshowSayHelloVisible'])?"1":"0");
   		
    },
    showFocusVisible:function (e){
    	//console.log("showFocusVisible");  
    	localStorage['isshowFocusVisible'] = !JSON.parse(localStorage['isshowFocusVisible']);
    	
    	console.log("isshowFocusVisible="+localStorage['isshowFocusVisible']);
    	$("#center-below").css("opacity",JSON.parse(localStorage['isshowFocusVisible'])?"1":"0");
   		
    	
     },
    showWeatherVisible:function (e){
    	localStorage['isshowWeatherVisible'] = !JSON.parse(localStorage['isshowWeatherVisible']);
   		$("#weather").css("opacity",JSON.parse(localStorage['isshowWeatherVisible'])?"1":"0");
   		
    },
    showQuoteVisible:function (e){
    	  
    	localStorage['isshowQuoteVisible'] = !JSON.parse(localStorage['isshowQuoteVisible']);
    	console.log("showQuoteVisible="+localStorage['isshowQuoteVisible']);
    	$("#bottom").css("opacity",JSON.parse(localStorage['isshowQuoteVisible'])?"1":"0");
   		
     },
    loadLocalImage:function (e){
    	localStorage['isLoadLocalImage'] = !JSON.parse(localStorage['isLoadLocalImage']);
    },
    loadFlickrSearch:function (e){
    	localStorage['isLoadFlickrSearchImage'] = !JSON.parse(localStorage['isLoadFlickrSearchImage']);
    },
    loadFavorites:function (e){
    	localStorage['isLoadFlickrFavoriteImage'] = !JSON.parse(localStorage['isLoadFlickrFavoriteImage']);
    },
    clearFavorite:function (e){
    	this.collection.reset();
    	
    	var tempModel;

			while (tempModel = this.collection.first()) {
  				tempModel.destroy();
			}
				
    	
    	//this.collection.save();
    	window.localStorage.removeItem('flickr-favoriteDs');
    	alert("Clear Favorite Pictures Sucess!");
    },
    exportFavorites:function(e){
    	
    	var flickrFavorites=[];
    	var stringHtml="";
	    if(window.localStorage['flickr-favoriteDs']){
	    	stringHtml=window.localStorage['flickr-favoriteDs'];
	 			flickrFavorites=JSON.parse(window.localStorage['flickr-favoriteDs']);
	 		}
	 		console.log(flickrFavorites.length);
	 		var d = new Date();
			var curr_date = d.getDate();
			var curr_month = d.getMonth();
			var curr_year = d.getFullYear();
			var date_str=curr_year+"-"+(curr_month+1)+"-"+curr_date;
			
	 		var result="---\r\nlayout: post\rcategory : life \r\ntagline: \"Flickr Favorites\"\r\n"
	 		+ "tags : [life,photos share,flickr] \r\ntitle: \"("+date_str+"Update)Share My Photos\""
	 		
	 		+"\r\n\r\n---\r\n### Share My Flickr Favorites  \r\n\r\n";
	 		var index=0;
	 		flickrFavorites.forEach(function(entry) {
	 			index++;
	 			result=result+index+". [link]("+entry.title+")\r\n![image]("+entry.flickrurl+")\r";
   			//result.concat("[link](",entry.title,")","  ![image](",entry.flickr,")");
   			/*
   			[link](https://farm8.staticflickr.com/7547/15469530877_2131317974_o.jpg)

![image](https://farm8.staticflickr.com/7547/15469530877_2131317974_o.jpg) 

   			*/
   		  
   			//console.log("title="+entry.title+",src="+entry.flickr);
			});
			//console.log(result);
			this.downloadFileFromText("favorites.json",stringHtml);
	 		this.downloadFileFromText(date_str+"-Update_Share My Flickr Favorite Photos.md",result);
	 		//console.log(stringHtml);
    },
		downloadFileFromText:function(filename, content) {
	    var a = document.createElement('a');
	    var blob = new Blob([ content ], {type : "text/plain;charset=UTF-8"});
	    a.href = window.URL.createObjectURL(blob);
	    a.download = filename;
	    a.style.display = 'none';
	    document.body.appendChild(a);
	    a.click(); //this is probably the key - simulating a click on a download link
	    delete a;// we don't need this anymore
		},
    toggleShow: function (e) {
    		console.log("this is toggleShow@settings button");
        e.preventDefault();
        _gaq.push(['_trackEvent', 'Settings', 'Toggle Show']);
        $('#settings').toggleClass('show');
        localStorage['showSettingsList'] = !JSON.parse(localStorage['showSettingsList']);
        
    },
    render: function() {
     	  // console.log("--INITIAL SETTINGS UI--@"+ (new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + (new Date()).getSeconds());
        
     		var order = (this.options.order  || 'append') + 'To';
     		//console.log("render...isshowTodoVisible="+localStorage['isshowTodoVisible']);
     		var fd=localStorage['timeoutSettingValue'];
     		var variables = { 
     			isshowTodoVisible: (JSON.parse(localStorage['isshowTodoVisible'])? "checked" : ""), 
     			isshowSayHelloVisible:(JSON.parse(localStorage['isshowSayHelloVisible'])? "checked" : ""),
        	isshowFocusVisible:(JSON.parse(localStorage['isshowFocusVisible'])? "checked" : ""),
        	isshowWeatherVisible:(JSON.parse(localStorage['isshowWeatherVisible'])? "checked" : ""),
        	isshowQuoteVisible:(JSON.parse(localStorage['isshowQuoteVisible'] )? "checked" : ""),
        	timeoutSettingValue: (localStorage['timeoutSettingValue'] ? localStorage['timeoutSettingValue'] : "Timeout Setting(second)"),
     			isLoadLocalImage:(JSON.parse(localStorage['isLoadLocalImage'] )? "checked" : ""),
        	isLoadFlickrSearchImage:(JSON.parse(localStorage['isLoadFlickrSearchImage'] )? "checked" : ""),
        	isLoadFlickrFavoriteImage:(JSON.parse(localStorage['isLoadFlickrFavoriteImage'] )? "checked" : ""),
        	
     			
     			//localStorage['TimeoutSetting'] = 3000;
     			 };
     			// this.collection.fetch();
     		if(typeof (parseInt(variables.timeoutSettingValue ))== 'number'){
							
 					//console.log(variables.timeoutSettingValue + " is a number <br/>");
 						window.localStorage['loading']=parseInt(variables.timeoutSettingValue )*1000;
 				}
 				else{
 					console.log(variables.timeoutSettingValue + " is not a number <br/>");
							window.localStorage['loading']=5000;
 					
 				}
        	//window.localStorage['loading']=IsNumeric(variables.timeoutSettingValue)?timeoutSettingValue*1000: 2000;
     		
        this.$el[order]('#' + this.options.region).html(this.template(variables)).fadeTo(500, 1);
        
				//region reload configuration
        
        if (JSON.parse(localStorage['showSettingsList']) == true) { this.$el.toggleClass('show'); }
        
        
         
        
        
        return this;
    },
    
    
    
	});
