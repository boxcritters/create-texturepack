//@ts-check
/**
 * @type {HTMLFormElement}
 */
var createtpform = document.querySelector("form#createtpform");

/**
 * 
 * @param {number} v 
 */
function getVersionIndicator(v) {
	var verinput = document.createElement('input');
	verinput.type = "hidden";
	verinput.name = "version";
	verinput.value = v.toString();
	return verinput;
}

function normaliseFileName(text) {
	return text.split(" ").join("");
}

function getFormData(removeEmpty = false) {
	var formData = new FormData(createtpform);
	var data = {};
	formData.forEach(function (value, key) {
		if ((value && value !== "") || !removeEmpty) data[key] = value;
	});
	data.date = Date.now();
	data.packVersion = "0.1";
	return data;
}

function createTP() {
    /**
     * @type {HTMLTextAreaElement}
     */
	var textarea = document.querySelector('textarea#tpdata');
	var data = getFormData(true)
	// @ts-ignore
	textarea.value = encode(data);
	return false;
}

function createTPJSON() {
	var dataurl = "data:text/json;charset=utf-8,"
	/**
	 * @type {HTMLTextAreaElement}
	 */
	var textarea = document.querySelector('textarea#tpdata');
	var data = getFormData();
	var url = dataurl + encodeURIComponent(JSON.stringify(data, null, 2));
	var downloadLink = document.createElement("a");
	var filename = data.name || "texturepack";
	filename = normaliseFileName(filename);
	downloadLink.setAttribute("href", url);
	downloadLink.setAttribute("download", filename + ".bctp.json");
	downloadLink.click();

	textarea.value = JSON.stringify(data, null, 2);
	return false;
}


function CreateTextField(name,value="") {
	var field = document.createElement("div");
	field.classList.add("tp-attrib","card");
	{
		var head = document.createElement("div");
		head.classList.add("card-header");
		var span = document.createElement('span');
		span.textContent = name;
		head.appendChild(span);
		field.appendChild(head);
	}
	{
		var body = document.createElement('div');
		body.className="card-body";
		var input = document.createElement("input");
		input.name = name;
		input.value = value;
		input.classList.add("form-control","px-2");
		body.appendChild(input);
		field.appendChild(body);
	}
	return field;
}

function CreateImgField(name,url) {
	var field = document.createElement("div");
	field.classList.add("tp-attrib","card");
	{
		var head = document.createElement("div");
		head.classList.add("card-header");
		var span = document.createElement('span');
		span.textContent = name;
		head.appendChild(span);
		field.appendChild(head);
	}
	{
		var image = new Image();
		image.classList.add("card-img");
		image.src = url;
		field.appendChild(image);
	}
	{
		var body = document.createElement('div');
		body.className="card-body";
		var input = document.createElement("input");
		input.name = name;
		input.classList.add("form-control","px-2");
		body.appendChild(input);
		field.appendChild(body);
	}
	return field;
}


async function CreateForm(list,session) {
	var start = session==undefined;
	session = session || {
		keyID:0,
		keys: Object.keys(await getDefaultTP()),
		getTrueName:() => {return session.keys[session.keyID];}
	}
	var form = [];
	if(session.keyID==0) {
		var cat= new Category("Texture Pack Info",true);
		for (session.keyID;session.keyID < 4; session.keyID++) {
			cat.appendChild(CreateTextField(session.getTrueName()));
		}
		form.push(cat.getElement());
	}
	for(var name in list) {
		var value = list[name]||"";
		var trueName = session.getTrueName();
		console.log(name,trueName,value);
		if(typeof value == "object") {
			var cat = new Category(name,false);
			var subForm = await CreateForm(value,session);
			subForm.forEach(item=>{cat.appendChild(item)});
			form.push(start?cat.getElement():cat);
			continue;
		}
		if(value.endsWith(".png")) {
			form.push(CreateImgField(name,value));
		}else {
			form.push(CreateTextField(name))
		}
		session.keyID++;
	}
	return form;
}


//Create Texture Pack Form
document.addEventListener('DOMContentLoaded', async () => {
	var lastCategory = [""];
    /**
     * @type {Category[]}
     */
	var currentCategoryGroups = [];
	// @ts-ignore
	var formats = await getFormats();

	var form = await CreateForm(formats)||[];
	form.forEach(item=>{createtpform.appendChild(item);})

	var button = document.createElement('button');
	button.classList.add("btn", "btn-primary");
	button.textContent = "Generate Texture Pack Code";
	button.type = "submit";
	createtpform.appendChild(button);


	var jsonbutton = document.createElement('a');
	jsonbutton.classList.add("btn", "btn-secondary");
	jsonbutton.textContent = "Download One Click File";
	jsonbutton.href = "#";
	createtpform.appendChild(jsonbutton);
	jsonbutton.addEventListener("click", (e) => {
		event.preventDefault();
		createTPJSON();
	})

	createtpform.addEventListener('submit', (e) => {
		event.preventDefault();
		createTP();
	});					

});