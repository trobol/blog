window.onload = function() {
	let name =  document.getElementById("name");
	let index = 0;
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	app.registerListeners();
	window.requestAnimationFrame(draw);
	addBubble();
	app.container = document.querySelector('app-container');

	app.load('/posts.json').then(function(data) {
		
		for(let i in data) {
			let color = colors[data[i].id % colors.length],
			months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
			post = 
`<app-post style="color:${color}" tabindex="-1">
	<app-post-header>
		<app-post-date>
			<app-post-day>${data[i].day}</app-post-day>
			<app-post-month>${months[data[i].month]}</app-post-month>
		</app-post-date>
			
		<app-post-info>
			<app-post-title>${data[i].title}</app-post-title>
			<p>${data[i].description}</p>
		</app-post-info>
	</app-post-header>
	<app-post-content>
	<?xml version="1.0" encoding="UTF-8"?>
<svg width="100" height="100" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<style type="text/css"><![CDATA[
	circle {
		animation: grid 2.6s linear infinite;
	}
	 @keyframes grid {
		0% {
			fill: #4e2cac;
		}
		16.6% {
			fill:#4186d3;
		}
		33.2% {
			fill:#4cd8f1;
		}
		49.8% {
			fill:#4df1cb;
		}
		66.4% {
			fill:#ff6c9a;
		}
		83% {
			fill:#e320a8;
		}
  	}
	circle:nth-of-type(1) {
		animation-delay:0s;
	}
	circle:nth-of-type(2) {
		animation-delay:-0.4s;
	}
	circle:nth-of-type(3) {
		animation-delay:-0.8s;
	}
	circle:nth-of-type(4) {
		animation-delay:-0.4s;
	}
	circle:nth-of-type(5) {
		animation-delay:-0.8s;
	}
	circle:nth-of-type(6) {
		animation-delay:-1.2s;
	}
	circle:nth-of-type(7) {
		animation-delay:-0.8s;
	}
	circle:nth-of-type(8) {
		animation-delay:-1.2s;
	}
	circle:nth-of-type(9) {
		animation-delay:-1.6s;
	}
    ]]></style>
<circle cx="10" cy="10" r="10" fill="#4e2cac"/>
<circle cx="50" cy="10" r="10" fill="#4e2cac"/>
<circle cx="90" cy="10" r="10" fill="#4e2cac"/>
<circle cx="10" cy="50" r="10" fill="#4e2cac"/>
<circle cx="50" cy="50" r="10" fill="#4e2cac"/>
<circle cx="90" cy="50" r="10" fill="#4e2cac"/>
<circle cx="10" cy="90" r="10" fill="#4e2cac"/>
<circle cx="50" cy="90" r="10" fill="#4e2cac"/>
<circle cx="90" cy="90" r="10" fill="#4e2cac"/>
</svg>

	</app-post-content>
</app-post>`;
			console.log(data[i].id);
			document.querySelector('app-panel.blog').insertAdjacentHTML( 'beforeend', post );
			
		}
		app.registerListeners();
	});
	app.onload();
}

let text = ['T','h','o','r','n','t','o','n'];

let canvas, ctx,
up = {x:0, y: -1},
bottom = {x:0, y:50},
colors = [
	'#4e2cac',
	'#4186d3',
	'#4cf1cc',
	'#ff6c9a',
	'#e320a8',
	'#4df1cb'
];
var bubbles = [];
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	bubbles.forEach(bubble => {
		bubble.move();
		ctx.beginPath();
		ctx.arc(bubble.x, bubble.y, bubble.size, 0, 2* Math.PI);
		ctx.fillStyle = bubble.color;
		ctx.fill(); 
	});
	if(Math.random() < 0.03) {
		addBubble();
	}
	window.requestAnimationFrame(draw);
}	
function addBubble() {
	let size = Math.random() * 15 + 5,
	x = Math.random() * canvas.width,
	speed = (Math.random() + 0.5)/2,
	color = Math.floor(Math.random() * 5);
	bubbles.push(new Bubble(x, canvas.height + size, size, colors[color], speed));
	if(bubbles.length > 25) {
		bubbles.shift();
	}
}
function Bubble(x, y, size, color, speed) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.color = color;
	this.speed = speed;
}
Bubble.prototype.move = function() {
	this.x += this.speed * up.x;
	this.y += this.speed * up.y; 
}
window.addEventListener('resize', function(evt) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});


let Content = {
	url: "/",
	build: function() {

    },
    info: function() {
		
    },
    blog: function() {
		
    },
    projects: function() {
	
    }
}
let clickListeners = {
	blog: function() {
		document.body.classList.add('app-state')
	}
}

let app = {
	load: function(url) {
		return fetch(url)
		.then(function(response) {
			let content_type = response.headers.get('Content-Type');
			content_type = content_type.slice(0,content_type.indexOf(';'));
			let handler = app.loadHandlers[content_type];
			console.log(content_type);
			if(handler) {
				return new Promise((resolve, reject) => {
					resolve(handler(response));
				});
			} else {
				return response;
			}
		});
	},
	loadHandlers: {
		'application/json':(response) => {
			return response.json();
		},
		'text/html': function(response) {

		}
	},
	state: 'start',
	setState: function(state) {
		if(state != this.state) {
			app.container.setAttribute('state', state);
			this.state = state;
		}
	},
	menu: 'none',
	setMenu: function(menu) {
		if(app.menu != menu) {
			app.container.setAttribute('menu', menu);
			this.menu = menu;
		}
	},
	listeners: {
		mousedown: {
			'app-select.blog': function(event) {
				app.setState('menu');
				app.setMenu('blog');
			},
			'app-select.info': function(event) {
				app.setState('menu');
				app.setMenu('info');
			},
			'app-select.projects': function(event) {
				app.setState('menu');
				app.setMenu('projects');
			},
			'h2': function(element) {
				index = (index + 1) % 7;
				name.style.fontFamily = fonts[index];
			},
			'app-post-header': function(event) {
				this.parentElement.classList.toggle('active');

				function load (event) {
					fetch_text("http://www.yoursite.com/home.html").then((html) => {
						document.getElementById("content").innerHTML = html;
					}).catch((error) => {
						console.warn(error);
					});
				}
				function fetch_text (url) {
					return fetch(url).then((response) => (response.text()));
				}
			}
		},
		touchstart: {
			'app-select.blog': function(event) {
				app.setState('menu');
				app.setMenu('blog');
			},
			'app-select.info': function(event) {
				app.setState('menu');
				app.setMenu('info');
			},
			'app-select.projects': function(event) {
				app.setState('menu');
				app.setMenu('projects');
			}
		},
		dblclick: {
		}

	},
	registerListeners: function() {
		for(let l in app.listeners) {
			let listeners = app.listeners[l];
			for(let e in listeners) {
				document.querySelectorAll(e).forEach(function (k) {
						k.addEventListener(l, listeners[e], {passive: true, capture:false});
						console.log(k);
				});
			}
			
		}
		
	},
	onload: function() {
		let path = window.location.pathname;
		if(path !== '/') {
			path = path.split('/');
			console.log(path);
		}
	}
}