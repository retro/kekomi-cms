steal(
'./prefilter.js', 
'./page.js', 
'./template.js', 
'./content_type.js', 
'./field_type.js', 
'./content.js', 
'./template_slot.js', function(){
	can.Observe.List.prototype.replace = function(newValues){
		newValues.unshift(0, this.length);
		this.splice.apply(this, newValues);
		return this;
	}
})