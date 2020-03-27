document.getElementById("urlinput").focus();
let urlinput = document.getElementById('urlinput')
let custominput = document.getElementById('custominput')
let sbtn = document.getElementById('sbtn')
let status = document.getElementById('status')
let erbox = document.getElementById('erbox')
let output = document.getElementById('output')
let alias = document.getElementById('alias')
let shortenedURL = document.getElementById('shortenedURL')
let sucess = document.getElementById('sucess')
let pushJSON = (address, longurl, shorturl) => {
let request = new XMLHttpRequest();
request.open('POST', address);
request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

let data = {
"l": longurl,
"s": shorturl
};
request.send(JSON.stringify(data));
};

let cinp = () => {
document.getElementById("erbox").innerHTML = "";
let cival = document.getElementById("custominput").value;
let res = JSON.parse(fetchJSON(endpoint + '/?q=s:' + cival))[0]["l"];
let data = res;

if (data != null) {
return false;
} else if (data == null) {
return true;
}
};

let geturl = () => {
let url = document.getElementById("urlinput").value;
return url;
};

let getrandom = () => {
	let text = ''
	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (let i = 0; i < 5; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return text
}

let genhash = () => {
	if (custominput.value == '') {
		window.location.hash = getrandom()
		check_is_unique()
	} else {
		window.location.hash = custominput.value
	}
}

let check_is_unique = () => {
let url = window.location.hash.substr(1);
let res = JSON.parse(fetchJSON(endpoint + '/?q=s:' + url))[0];
let data = res;

if (data != null) {
genhash();
}
};

let copyer = (containerid) => {
	let elt = document.getElementById(containerid)
	if (document.selection) { // IE
		if (elt.nodeName.toLowerCase() === 'input') {
			elt.select()
			document.execCommand('copy')
		} else {
			let range = document.body.createTextRange()
			range.moveToElementText(elt)
			range.select()
			document.execCommand('copy')
		}
	} else if (window.getSelection) {
		if (elt.nodeName.toLowerCase() === 'input') {
			elt.select()
			document.execCommand('copy')
		} else {
			let range_ = document.createRange()
			range_.selectNode(elt)
			window.getSelection().removeAllRanges()
			window.getSelection().addRange(range_)
			document.execCommand('copy')
		}
	}
}

let send_request = (url) => {
let longurl = url;
let shorturl = window.location.hash.substr(1)
let address = endpoint + "/";
pushJSON(address, longurl, shorturl);
urlinput.value = ''
status.innerHTML = '<i class="lab la-telegram"></i> shorten'
output.style.display = 'block'
document.getElementById('shortenedURL').value = window.location.href;
copyer("shortenedURL");
};

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
let shorturl = async () => {
	status.innerHTML = '<i class="las la-sync"></i> shortening...'
	erbox.style.display = 'none'
	output.style.display = 'none'
	await sleep(150)
	let longurl = geturl()
	let re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
	let cre = /^([a-zA-Z0-9_-]+)$/
	let protocol_ok = re.test(longurl)
	if (!protocol_ok) {
		status.innerHTML = '<i class="lab la-telegram"></i> shorten'
		erbox.style.display = 'block'
		erbox.innerHTML = '<i class="las la-exclamation-circle"></i> invalid url'
	} else {
		if (custominput.value == '') {
			genhash()
			send_request(longurl)
			alias.innerHTML = '<i class="las la-check-circle"></i> url shortened and copied'
		} else {
			if (cre.test(custominput.value)) {
				if (cinp()) {
					genhash()
					send_request(longurl)
					alias.innerHTML = '<i class="las la-check-circle"></i> alias available'
				} else {
					custominput.value = ''
					status.innerHTML = '<i class="lab la-telegram"></i> shorten'
					erbox.style.display = 'block'
					erbox.innerHTML = '<i class="las la-exclamation-circle"></i> alias already in use, choose another'
				}
			} else {
				custominput.value = ''
				status.innerHTML = '<i class="lab la-telegram"></i> shorten'
				erbox.style.display = 'block'
				erbox.innerHTML = '<i class="las la-exclamation-circle"></i> use only letters, numbers or underscore aliases'
			}
		}
	}
}

document.getElementById("sbtn").addEventListener("click", shorturl);