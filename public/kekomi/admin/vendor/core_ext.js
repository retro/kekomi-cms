steal('can/view/ejs', function(){
	Array.prototype.unique = function(){
		var u = {}, a = [];
		for(var i = 0, l = this.length; i < l; ++i){
			if(u.hasOwnProperty(this[i])) {
				continue;
			}
			a.push(this[i]);
			u[this[i]] = 1;
		}
		return a;
	}
	can.EJS.Helpers.prototype.humanizedBytes = function( bytes ){
		if( isNaN( bytes ) ){ return; }
		var units = [ ' bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB' ];
		var amountOf2s = Math.floor( Math.log( +bytes )/Math.log(2) );
		if( amountOf2s < 1 ){
			amountOf2s = 0;
		}
		var i = Math.floor( amountOf2s / 10 );
		bytes = +bytes / Math.pow( 2, 10*i );
		// Rounds to 3 decimals places.
			if( bytes.toString().length > bytes.toFixed(3).toString().length ){
				bytes = bytes.toFixed(3);
			}
		return bytes + units[i];
	};
})