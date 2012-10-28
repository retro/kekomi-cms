steal(
'./prefilter.js', 
'./page.js', 
'./template.js', 
'./content_type.js', 
'./field_type.js', 
'./content.js', 
'./template_slot.js',
'./tag.js',
'./asset.js', 
'./slot.js',
'./node_type.js',
'./template_group.js',
'./languages.js',
function(){
	can.Observe.List.prototype.replace = function(newValues){
		newValues.unshift(0, this.length);
		this.splice.apply(this, newValues);
		return this;
	}
	can.Observe.prototype.readAttr = function(attr){
		var path = attr.split("."),
			val  = this[path.shift()];
		while(typeof val !== "undefined" && path.length > 0){
			if(typeof val === "undefined") return;
			if(val === null) return null;
			val = val[path.shift()];
		}
		return val;
	}
})