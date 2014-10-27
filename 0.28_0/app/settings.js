// Settings Widget


// Models

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
        
        //window.localStorage['loading']
        
    },
    localStorage: new Backbone.LocalStorage("momentum-settings"),
    defaults:{
        
        
    }
});

// Collections

// Views
m.views.Settings=Backbone.View.extend({
		attributes: { id: 'settings'},
		template: Handlebars.compile($("#settings-template").html() ),
    events: {
        "click .settings-toggle"   : "toggleShow",
       	"click .showtodo"   : "showTodoVisible",
       	"click .showsayhello"   : "showSayHelloVisible",
       	"click .showfocus"   : "showFocusVisible",
       	"click .showweather"   : "showWeatherVisible",
       	"click .showquote"   : "showQuoteVisible",
       	"keypress #timeout-setting":  "setTimeoutOnEnter",
    },
    
     initialize: function () {
     		this.render();
				return this;
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
        	timeoutSettingValue: (localStorage['timeoutSettingValue'] ? localStorage['timeoutSettingValue'] : "Timeout Setting(second)")
     			//localStorage['TimeoutSetting'] = 3000;
     			 };
     			 variables.timeoutSettingValue 
     		if(typeof (parseInt(variables.timeoutSettingValue ))== 'number'){
							
 					console.log(variables.timeoutSettingValue + " is a number <br/>");
 						window.localStorage['loading']=parseInt(variables.timeoutSettingValue );
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
