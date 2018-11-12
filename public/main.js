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
			'app-post': function(event) {
				this.focus();

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