var F_WIDTH = 31.07;
var F_HEIGHT = 20.45;
var f = document.getElementById('field');
var count = 0;
var pause = true;
var start = false;
var lead = [];
var col_blocks = 21;
f.style.width = (F_WIDTH*20)+'px'; 
f.style.height = (F_HEIGHT*20)+'px';

function CreateLBoard()
{
	document.getElementById('lboard').innerHTML = '';
	for (i = lead.length-1; i >= 0; i--)
	{
		document.getElementById('lboard').innerHTML += '<div>' + 
		lead[i][0] + " -> " + lead[i][1] +
		'</div>';
	}	
}

function getGET()
{	
	var xhr = new XMLHttpRequest();
	xhr.onload = ()=>{
		//console.log(xhr.responseText);
        lead = JSON.parse(xhr.responseText);
		CreateLBoard();
    };
	xhr.open("GET", '/data', true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhr.send();
}getGET();

function getPOST(then)
{
	var body = JSON.stringify(lead);
	var xhr = new XMLHttpRequest();
	xhr.onload = then;
    xhr.open("POST", "/");
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.send(body);
}

function timer()
{
	if (pause == true) 
	{
		setTimeout(function(){},1000);
		return;
	}
	var obj = document.getElementById('timer_inp');
	obj.innerHTML--;
	document.getElementById('timer_inp').value = obj;
	if(obj.innerHTML==0)
	{
		var val = String(document.getElementById('t1').value)
		var s = "Your score: " + val + ". Write your name."
		var rez = prompt(s);
		var name = rez;
		if (rez!=null) 
		{
			lead.push([Number(val),name]);
			getPOST(function(){getGET();});
		}
		CreateLBoard();
		pause = true;
		start = false;
		setTimeout(function(){},1000);
	}
	else
	{
		setTimeout(timer,1000);
	}
}

function CreateColor()
{
	var r=Math.floor(Math.random() * (256));
	var g=Math.floor(Math.random() * (256));
	var b=Math.floor(Math.random() * (256));
	var c='#' + r.toString(16) + g.toString(16) + b.toString(16);
	return c;
}

function GenerateBlocks(col)
{
	for (i = 0; i < col; i++)
	{
		var num = Math.floor(Math.random() * 260);
		document.getElementById(num).style.background = CreateColor();
	}
}

function CreateButton(tag, atrs)
{
	var btndiv = document.createElement(tag);
	for(key in atrs) btndiv.setAttribute(key, atrs[key]);
	btndiv.style.background = "#bbbbbb";
	btndiv.onclick = function()
	{ 
		if (String(this.style.background) != "rgb(187, 187, 187)") 
		{
			var v = Number(document.getElementById("t1").value);
			v += 1;
			document.getElementById("t1").value = v;
			this.style.background = "#BBB";
		}
		var col = Math.floor(Math.random() * 3);
		GenerateBlocks(col);
	};
	document.getElementById("field").appendChild(btndiv);
}

function Start()
{
	var obj = document.getElementById('timer_inp');
	if (obj.innerHTML==0) alert("Game over");
	else
	{
		if (start == true)
		{
			if (pause == true)
			{
				pause = false;
				setTimeout(timer,1000);
			}
			else
			{
				pause = true;
			}
		}
	}
}

function New_Game()
{	
	document.getElementById('timer_inp').innerHTML = 60;
	document.getElementById('t1').value = 0;
	for (i = 0; i<260; i++) document.getElementById(i).style.background = '#bbbbbb';
	var c = Math.floor(Math.random() * 21) + 5;
	GenerateBlocks(c);
	start = true;
	pause = true;
	Start();
}

for (i = 0; i<260; i++) CreateButton("div", {id: i, class:'cell'});
