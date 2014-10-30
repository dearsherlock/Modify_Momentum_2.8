// Background feature


// Models

m.models.Background = Backbone.Model.extend({
    parse: function(response) {
    	//console.log("m.models.Background.parse..."+response.filename);
        //this.set({ 'filename': response.filename, 'title': response.title, 'source': response.source, 'sourceUrl': response.sourceUrl, 'shutterstockPromo': response.shutterstockPromo, 'impressionUrl': response.impressionUrl });
    	this.set({ 'filename': response.filename });
    }
});


// Collections

m.collect.Backgrounds = Backbone.Collection.extend({
    model: m.models.Background,
    url: 'app/backgrounds.json',
    parse: function (response) {
    		//console.log("m.models.Backgrounds.parse..."+response.backgrounds.length);
    		return response.backgrounds;
    }
});

//add m.flickr setter block
// Get images from flickr.com

m.flickr = {
    // the number of flickr images would be added to the collection.
    range: 0,
    sample: function(obj, n, guard) {
        if (n == null || guard) {
            if (obj.length !== +obj.length) obj = _.values(obj);
            return obj[_.random(obj.length - 1)];
        }
        return _.shuffle(obj).slice(0, Math.max(0, n));
    },
    getRandomInt: function( min, max ) {
        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    },
    getImages: function() {
        var that = this;
        // total pages flickr returned.
        var totalPages = window.localStorage['momentum-flickr-pages'] || 1;
        console.log("totalPages"+totalPages);
        
        
        
        var http = 'https://',
            url = 'api.flickr.com/services/rest/?',
            method = 'method=flickr.photos.search',
            api_key = 'api_key=ea0051e3fed310b4541079c92efadac8',
            geo_context = 'geo_context=1',
            pages = 'page=' + that.getRandomInt( 1, totalPages ),
            perpage = 'per_page=50',
            format = 'format=json&nojsoncallback=1';
            console.log( http + url + method + '&' + api_key + '&' + perpage + '&' + geo_context + '&' + pages + '&' + format);
				m.flickr.$promise = $.ajax({
				url:
				 http + url + method + '&' + api_key + '&'
				+ perpage +'&'+ geo_context + '&' + pages + '&' + format ,
				 timeout: 2000
				
				} );
    },
    //geocontext=0, it will found 0 easily...
    //filenamerender
    getImagesUrl: function( photos ) {
        var sample = [];
        var that = this;

        function _makePicUrl( photo ) {
            var http = 'https://',
                farm = 'farm' + photo.farm + '.staticflickr.com/',
                server = photo.server + '/',
                pic = photo.id + '_' + photo.secret + '_' + 'b.jpg';

            return http + farm + server + pic;
        }

        that.range = Math.floor( photos.length / 2 );

        _.each( that.sample( photos, that.range ), function( photo ) {
            if ( photo.ispublic ) {
                sample.push({
                   filename: '',
                   title: photo.title,
                   source: "",
                   source_url: "",
                   flickr:  _makePicUrl( photo )
                });
            }
        });
        return sample;
    },
    setTotalPage: function( num ) {
    	console.log("settoalpage:"+num);
        window.localStorage['momentum-flickr-pages'] = num;
    }
};
// Views

m.views.Background = Backbone.View.extend({
    tagName: 'li',
    attributes: {  },
    // JO: Testing setting background without a template
    //template: Handlebars.compile( $("#background-template").html() ),
    initialize: function () {
    	 
    	 	//window.localStorage['loading']=10000;
    	  //this.render();
        this.loadNewBg();//add
        //this.model.on('newDay', _.bind(this.loadNewBg, this));
				//this.listenTo(m, 'newDay', this.loadNewBg, this);
				this.model.on('change:dayEnd', _.bind(this.loadNewBg, this));
    },
    render: function () {
    	//	console.log("m.views.Background render...");
        
				//ADD beblow contents
        var that = this;
        var index = window.localStorage['background'] || 0;
        //console.log('index is ' + index);
        //console.log('localstorage background is ' + localStorage['background']);
        window.localStorage['background'] = index;
        var filename = this.collection.at(index).get('filename');
        var flickr = this.collection.at(index).get('flickr');
        var order = (this.options.order || 'append') + 'To';

        // JO: Hack to get the backgrounds to fade between each other; replace with background subviews and separate LIs
        $('#background').css('background-image',$('#background').find('li').css('background-image'));
        // JO: Make sure the background image loads before displaying (even locally there can be a small delay)
        if ( filename && "" !== filename ) {
        		//console.log("caching filename:"+filename);
            $('<img/>')
            .attr('src', 'backgrounds/' + filename)
            .load(function() {
                that.$el[order]('#' + that.options.region)
                .css('background-image','url(backgrounds/' + filename + ')')
                .css('opacity','0')
                .fadeTo(200, 1);
                $(this).remove();
            });
        } else if ( (!filename || "" === filename) && flickr ) {
        		//console.log("limit:"+window.localStorage['loading']);
        		if(flickr.substring(0, 7) != 'http://' & flickr.substring(0, 9) != 'https://')
	      		{
	        		flickr="http://"+flickr;
	      		}
        		$.ajax({
                url: flickr,
                timeout: window.localStorage['loading']
            })
            .success(function() {
                that.$el[order]('#' + that.options.region)
                .css('background-image','url(' + flickr + ')')
                .css('opacity','0')
                .fadeTo(200, 1);
            })
            /*
            .error( function(response) {
    					data = $.evalJSON(response.responseText);
    					alert(data);
 						 })*/
            .fail(function(response,STATUS,exception) {
               	console.log("AJAX LOADING ERROR:{"+response.responseText+"}");
							 	that.loadStockBg();
            });
        }
    },
    loadNewBg: function () {
    		// attempting to solve the race condition where multiple tabs are open
        
        var index = window.localStorage['background'];
        var newIndex = Math.floor(Math.random()*this.collection.models.length);
        if (newIndex == index) newIndex + 1;
        if (newIndex == this.collection.models.length) newIndex = 0;
        window.localStorage['background'] = newIndex;
        this.render();
    },
    //ADD loadStockBg function
    loadStockBg: function() {
        var newIndex = Math.floor( Math.random() * ( this.collection.models.length - m.flickr.range ) );
        window.localStorage['background'] = newIndex;
        this.render();
    }
    
    
});
/* mark by sherlock
m.views.BackgroundInfo = Backbone.View.extend({
    tagName: 'div',
    attributes: { id: 'background-info', class: 'light' },
    template: Handlebars.compile($("#background-info-template").html()),
    events: {
        "mouseenter": "removeFade",
        "mouseleave": "addFade",
        "click .source-url": "trackClick"
    },
    initialize: function () {
        this.addFade();
    },
    render: function () {
        var title = this.options.title;
        if (!title) {
            title = "";
            this.$el.addClass('title-unknown');
        }
        var source = this.options.source
        if (!source) {
            source = "";
            this.$el.addClass('source-unknown');
        }
        var sourceUrl = this.options.sourceUrl;
        var variables = { title: title, source: source, sourceUrl: sourceUrl };
        this.$el.html(this.template(variables));

        return this;
    },
    removeFade: function() {
        ga('send', 'event', 'BackgroundInfo', 'Hover');
        this.$el.removeClass('fadeout');
    },
    addFade: function(options) {
        this.$el.addClass('fadeout');
    },
    trackClick: function() {
        ga('send', 'event', 'BackgroundInfo', 'Click', localStorage.background);
    }
});
*/