Number.prototype.pad = function(size) {
	var s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
}

function format(date) {
	let yy = date.getFullYear();
	let MM = date.getMonth();
	let dd = date.getDate();
	let hh = date.getHours();
	let mm = date.getMinutes();
	let ss = date.getSeconds();
	
	return `${MM.pad()}/${dd.pad()}/${yy.pad()} ${hh.pad()}:${mm.pad()}:${ss.pad()}`
}

module.exports = {format}