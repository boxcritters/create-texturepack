//@ts-check
var CONTENT_CONNECTED = false;
var api = "https://api.boxcrittersmods.ga"

function getURLParams() {
	return window.location.search.replace('?','').split('&').reduce((obj,p)=>{
        obj[p.split('=')[0]] = p.split('=')[1];
        return obj;
    },{});
}


/**
 * 
 * @param {string} url 
 */
function getJSON(url) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
    return new Promise((resolve, reject) => {
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == 200) {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                resolve(JSON.parse(xobj.responseText));
            }
        };
        xobj.send(null);
    });
}

function getSites() {
    return getJSON(api+'/sites');
}

function getCurrentVersionInfo() {
    return getJSON(api);
}

function getFormats() {
	return getJSON(api+'/textures');
}
function getDefaultTP() {
	return getJSON(api+'/textures/BoxCritters.bctp.json');
}

/**
 * 
 * @param {Event} e 
 */
function noRedirectForm(e) {
    e.preventDefault();
}

function cleanEmpty(obj) {
    Object.keys(obj).forEach(key => obj[key] === undefined||obj[key] === "" ? delete obj[key] : '');
    return obj;
}

function decode(text) {
    return JSON.parse(atob(text));
};

function encode(text) {
    return btoa(JSON.stringify(text));
};

function dateToString(unix){
    var date = new Date(unix);

    let dd = date.getDate();
    let mm = (date.getMonth() + 1);
    let yyyy = date.getFullYear();

    //Enables 0 beginning numbers
    /*if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } */


    return dd+'/'+mm+'/'+yyyy;

}

