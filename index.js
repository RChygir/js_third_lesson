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
		//console.log(`POSTdata = ${postData}`);
		data = JSON.parse(postData);
		res.statusCode = 201;
		fs.writeFile('./results.json', JSON.stringify(data), err=>{
			if(err) {
				res.statusCose = 400;
			}
			res.end();
		});
	}
	catch (e){
		res.statusCose = 400;
		res.end();
	}
}

function processGet(req, res)
{
	const {method, url, headers} = req;
	let filePath = url;
	if(filePath === '/') {
		filePath = "./brick_game/index.html"
	}
	else if (filePath.includes('/data')) {
		console.log("RF");
		fs.readFile('./results.json', (err, data)=>{
			console.log("ERF");
			res.setHeader("Content-Type", 'application/json');
			let arr = JSON.parse(data);
			arr.sort((a,b)=> {
				if(a[0] < b[0]) return -1;
				else if(a[0] > b[0]) return 1;
				return 0;
			});
			res.end(JSON.stringify(arr));
		});
		return;
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

server.listen(80);