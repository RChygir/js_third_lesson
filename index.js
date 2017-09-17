const fs = require('fs');
const http = require('http');
const path = require('path');

const server = http.createServer();

const types = {
	'.js' : {
		contentType: "application/javascript"
	},
	'.css' : {
		contentType: "text/css"
	},
	'.html' : {
		contentType: "text/html"
	},
	'.jpg' : {
		contentType: "image/jpg"
	},
	'default' : {
		contentType: "text/plain"
	}
}

server.on('request', (req, res) => {
    const {method, url, headers} = req;
	console.log(method, url);
	if (method === 'POST')
	{
		let postData = '';
		req.on('data', data => {
			postData += data;
		});
		req.on('end', ()=> {
			processPost(req, res, postData);
		});
	} else {
		processGet(req, res);
	}
});

function processPost(req, res, postData)
{
	let data;
	try {
		data = JSON.parse(postData);
		MySort(data.mas);
		res.statusCode = 201;
		data = JSON.parse(data);
		fs.writeFile('./results.json', JSON.stringify(data));
	}
	catch (e){
		res.statusCose = 400;
	}
	res.end();
}

function processGet(req, res)
{
	const {method, url, headers} = req;
	let filePath = url;
	if(filePath === '/') {
		filePath = "./brick_game/index.html"
	}
	else if (filePath.includes('/data')) {
		let data = fs.readFile('./results.json');
		res.setHeader("Content-Type", 'application/json');
		res.end(data);
	}
	else {
		filePath = "./brick_game/" + filePath;
	}
	let fileExt = path.extname(filePath);
	let responseParams = types[fileExt] || types.default;
	
	res.setHeader("Content-Type", responseParams.contentType);
	let readStream = fs.createReadStream(filePath);
	readStream.pipe(res);
};

function MySort(lead)
{
	for (i = 1; i < lead.length; i++)
		for (j = 1; j < lead.length; j++)
			if (parseInt(lead[j][0]) < parseInt(lead[j-1][0]))
			{
				var tmp = lead[j];
				lead[j] = lead[j-1];
				lead[j-1] = tmp;
			}
}

server.listen(80);