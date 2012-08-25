steal('./slugify.js', function(){
	window.uuid = function() {
		var S4 = function() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}
	Array.prototype.flatten = function(){
		var combined = [];
		var member;
		if(this.length > 0){
			for(var i = 0; i < this.length; i++){
				member = this[i];
				if(!$.isArray(member)){
					member = [member];
				}
				combined.push.apply(combined, member);
			}
			return combined;
		} else {
			return this;
		}
	}
})