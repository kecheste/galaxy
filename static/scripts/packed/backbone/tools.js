var BaseModel=Backbone.Model.extend({defaults:{id:null,name:null,hidden:false},show:function(){this.set("hidden",false)},hide:function(){this.set("hidden",true)},is_visible:function(){return !this.attributes.hidden}});var Tool=BaseModel.extend({defaults:{description:null,target:null,params:[]},apply_search_results:function(a){(_.indexOf(a,this.attributes.id)!==-1?this.show():this.hide());return this.is_visible()}});var ToolPanelLabel=BaseModel.extend({});var ToolPanelSection=BaseModel.extend({defaults:{elems:[],open:false},clear_search_results:function(){_.each(this.attributes.elems,function(a){a.show()});this.show();this.set("open",false)},apply_search_results:function(b){var c=true,a;_.each(this.attributes.elems,function(d){if(d instanceof ToolPanelLabel){a=d;a.hide()}else{if(d instanceof Tool){if(d.apply_search_results(b)){c=false;if(a){a.show()}}}}});if(c){this.hide()}else{this.show();this.set("open",true)}}});var ToolSearch=BaseModel.extend({defaults:{spinner_url:"",search_url:"",visible:true,query:"",results:null},initialize:function(){this.on("change:query",this.do_search)},do_search:function(){var c=this.attributes.query;if(c.length<3){this.set("results",null);return}var b=c+"*";if(this.timer){clearTimeout(this.timer)}$("#search-spinner").show();var a=this;this.timer=setTimeout(function(){$.get(a.attributes.search_url,{query:b},function(d){a.set("results",d);$("#search-spinner").hide()},"json")},200)}});var ToolPanel=Backbone.Collection.extend({url:"/tools",parse:function(a){var b=function(e){var d=e.type;if(d==="tool"){return new Tool(e)}else{if(d==="section"){var c=_.map(e.elems,b);e.elems=c;return new ToolPanelSection(e)}else{if(d==="label"){return new ToolPanelLabel(e)}}}};return _.map(a,b)},initialize:function(a){this.tool_search=a.tool_search;this.tool_search.on("change:results",this.apply_search_results,this)},clear_search_results:function(){this.each(function(a){a.clear_search_results()})},apply_search_results:function(){var a=this.tool_search.attributes.results;if(a===null){this.clear_search_results();return}this.each(function(b){b.apply_search_results(a)})}});var BaseView=Backbone.View.extend({initialize:function(){this.model.on("change:hidden",this.update_visible,this)},update_visible:function(){(this.model.attributes.hidden?this.$el.hide():this.$el.show())}});var ToolLinkView=BaseView.extend({tagName:"div",template:Handlebars.templates.tool_link,render:function(){this.$el.append(this.template(this.model.toJSON()));return this}});var ToolPanelLabelView=BaseView.extend({tagName:"div",className:"toolPanelLabel",template:Handlebars.templates.panel_label,render:function(){this.$el.append(this.template(this.model.toJSON()));return this},});var ToolPanelSectionView=BaseView.extend({tagName:"div",className:"toolSectionWrapper",template:Handlebars.templates.panel_section,initialize:function(){BaseView.prototype.initialize.call(this);this.model.on("change:open",this.update_open,this)},render:function(){this.$el.append(this.template(this.model.toJSON()));var a=this.$el.find(".toolSectionBody");_.each(this.model.attributes.elems,function(b){if(b instanceof Tool){var c=new ToolLinkView({model:b,className:"toolTitle"});c.render();a.append(c.$el)}else{if(b instanceof ToolPanelLabel){var d=new ToolPanelLabelView({model:b});d.render();a.append(d.$el)}else{}}});return this},events:{"click .toolSectionTitle > a":"toggle"},toggle:function(){this.$el.children(".toolSectionBody").toggle("fast");this.model.set("open",!this.model.attributes.open)},update_open:function(){(this.model.attributes.open?this.$el.children(".toolSectionBody").show("fast"):this.$el.children(".toolSectionBody").hide("fast"))}});var ToolSearchView=Backbone.View.extend({tagName:"div",id:"tool-search",className:"bar",template:Handlebars.templates.tool_search,events:{click:"focus_and_select","keyup :input":"query_changed"},render:function(){this.$el.append(this.template(this.model.toJSON()));if(!this.model.is_visible()){this.$el.hide()}return this},focus_and_select:function(){this.$el.find(":input").focus().select()},query_changed:function(){this.model.set("query",this.$el.find(":input").val())}});var ToolPanelView=Backbone.View.extend({tagName:"div",className:"toolMenu",initialize:function(a){this.collection.tool_search.on("change:results",this.handle_search_results,this)},render:function(){var b=this.$el;var a=new ToolSearchView({model:this.collection.tool_search});a.render();b.append(a.$el);this.collection.each(function(d){if(d instanceof ToolPanelSection){var c=new ToolPanelSectionView({model:d});c.render();b.append(c.$el)}else{if(d instanceof Tool){var e=new ToolLinkView({model:elt,className:"toolTitleNoSection"});e.render();b.append(e.$el)}}});return this},handle_search_results:function(){var a=this.collection.tool_search.attributes.results;if(a&&a.length===0){$("#search-no-results").show()}else{$("#search-no-results").hide()}}});