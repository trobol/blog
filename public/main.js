
let canvas, ctx,
	up = { x: 0, y: -1 },
	bottom = { x: 0, y: 50 },
	colors = [
		'#4e2cac',
		'#4186d3',
		'#4cf1cc',
		'#ff6c9a',
		'#e320a8',
		'#4df1cb'
	],
	bubbles = [];
function Bubble(x, y, size, color, speed) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.color = color;
	this.speed = speed;
}
Bubble.prototype.move = function () {
	this.x += this.speed * up.x;
	this.y += this.speed * up.y;
}
Bubble.add = () => {
	let size = Math.random() * 15 + 5,
		x = Math.random() * app.canvas.width,
		speed = (Math.random() + 0.5) / 2,
		color = Math.floor(Math.random() * 5);
	bubbles.push(new Bubble(x, app.canvas.height + size, size, colors[color], speed));
	if (bubbles.length > 25) {
		bubbles.shift();
	}
};
Bubble.draw = () => {
	app.ctx.clearRect(0, 0, app.canvas.width, app.canvas.height);
	bubbles.forEach(bubble => {
		bubble.move();
		app.ctx.beginPath();
		app.ctx.arc(bubble.x, bubble.y, bubble.size, 0, 2 * Math.PI);
		app.ctx.fillStyle = bubble.color;
		app.ctx.fill();
	});
	if (Math.random() < 0.03) {
		Bubble.add();
	}
	window.requestAnimationFrame(Bubble.draw);
}

window.addEventListener('resize', function (evt) {
	app.canvas.width = window.innerWidth;
	app.canvas.height = window.innerHeight;
});


let app = {
	load: function (url) {
		return fetch(url)
			.then(function (response) {
				let content_type = response.headers.get('Content-Type');
				content_type = content_type.slice(0, content_type.indexOf(';'));
				let handler = app.loadHandlers[content_type];
				console.log(content_type);
				if (handler) {
					return new Promise((resolve, reject) => {
						resolve(handler(response));
					});
				} else {
					return response;
				}
			});
	},
	loadHandlers: {
		'application/json': (response) => {
			return response.json();
		},
		'text/html': function (response) {
			return response.text();
		}
	},
	state: 'start',
	setState: function (state) {
		if (state != this.state) {
			app.container.setAttribute('state', state);
			this.state = state;
		}
	},
	menu: 'none',
	setMenu: function (menu) {
		if (app.menu != menu) {
			app.container.setAttribute('menu', menu);
			this.menu = menu;
		}
	},
	listeners: {
		mousedown: {
			'app-select.blog': function (event) {
				app.setState('menu');
				app.setMenu('blog');
			},
			'app-select.info': function (event) {
				app.setState('menu');
				app.setMenu('info');
			},
			'app-select.projects': function (event) {
				app.setState('menu');
				app.setMenu('projects');
			},
			'h1': function (element) {
				index = (index + 1) % 7;
				name.style.fontFamily = fonts[index];
			}
		},
		click: {
			'app-post-header': function (event) {
				let parent = this.parentElement,
					active = parent.classList.contains('active');

				for (let e of document.getElementsByClassName('active')) {
					e.classList.remove('active');
				}
				if (!active) {
					window.scrollTo({
						top: parent.offset,
						left: 0,
						behavior: 'smooth'
					});
					parent.classList.add('active');
				}
				if (this.hasAttribute("loaded")) {

				} else {
					app.load('/posts/' + parent.getAttribute('app-post-path') + '/index.html').then((data) => {
						parent.querySelector('app-post-content').innerHTML = data;

						this.setAttribute('loaded', true);
					});
				}

			}
		},
		touchstart: {
			'app-select.blog': function (event) {
				app.setState('menu');
				app.setMenu('blog');
			},
			'app-select.info': function (event) {
				app.setState('menu');
				app.setMenu('info');
			},
			'app-select.projects': function (event) {
				app.setState('menu');
				app.setMenu('projects');
			}
		},
		dblclick: {
		}

	},
	registerListeners: function () {
		for (let l in app.listeners) {
			let listeners = app.listeners[l];
			for (let e in listeners) {
				document.querySelectorAll(e).forEach(function (k) {
					k.addEventListener(l, listeners[e], { passive: true, capture: false });
				});
			}

		}

	},
	appendPosts: (data) => {
		let blogPanel = document.querySelector('app-panel.blog');
		for (let i of data) {

			let color = colors[i.id % colors.length],
				months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
				post =
					`<app-post style="color:${color}" app-post-path="${i.url}" tabindex="-1">
	<app-post-header>
		<app-post-date>
			<app-post-day>${i.day}</app-post-day>
			<app-post-month>${months[i.month]}</app-post-month>
		</app-post-date>
			
		<app-post-info>
			<app-post-title>${i.title}</app-post-title>
			<p>${i.description}</p>
		</app-post-info>
	</app-post-header>
	<app-post-content>
	<img src="img/spinner.svg" alt="loading">

	</app-post-content>
</app-post>`;

			blogPanel.insertAdjacentHTML('beforeend', post);
		}
		app.registerListeners();
		let posts = document.getElementsByTagName('app-post');
		for (let p of posts) {
			p.offset = getOffset(p).top - app.header.offsetHeight
		}
	},
	onload: function () {
		manageSvg();
		app.canvas = document.getElementById("canvas");
		app.ctx = app.canvas.getContext('2d');
		app.canvas.width = window.innerWidth;
		app.canvas.height = window.innerHeight;

		window.requestAnimationFrame(Bubble.draw);
		app.container = document.body;
		app.header = document.getElementsByTagName('app-header')[0];

		app.load('/posts.json').then(app.appendPosts);
		app.registerListeners();
		let path = window.location.pathname;
		if (path !== '/') {
			path = path.split('/');
			console.log(path);
		}


	}
}
function getOffset(el) {
	var _x = 0;
	var _y = 0;
	while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
		_x += el.offsetLeft - el.scrollLeft;
		_y += el.offsetTop - el.scrollTop;
		el = el.offsetParent;
	}
	return { top: _y, left: _x };
}
let svg;
function manageSvg() {
	svg = document.getElementById("name").contentDocument.getElementById("paths");
	svg.pauseAnimations();
	document.body.addEventListener('scroll', (e) => {
		let value = 1 - (svg.clientHeight - (window.pageYOffset || document.body.scrollTop) - (document.documentElement.clientTop || 0)) / svg.clientHeight;
		if (value > 4) return;
		window.requestAnimationFrame(function () {
			let value = 1 - (svg.clientHeight - (window.pageYOffset || document.body.scrollTop) - (document.documentElement.clientTop || 0)) / svg.clientHeight;
			svg.setCurrentTime(value);

			console.log(value);
		});
	});
}
window.onload = app.onload;