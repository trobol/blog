
const app = (function () {
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
			x = Math.random() * canvas.width,
			speed = (Math.random() + 0.5) / 2,
			color = Math.floor(Math.random() * 5);
		bubbles.push(new Bubble(x, canvas.height + size, size, colors[color], speed));
		if (bubbles.length > 25) {
			bubbles.shift();
		}
	};
	Bubble.draw = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		bubbles.forEach(bubble => {
			bubble.move();
			ctx.beginPath();
			ctx.arc(bubble.x, bubble.y, bubble.size, 0, 2 * Math.PI);
			ctx.fillStyle = bubble.color;
			ctx.fill();
		});
		if (Math.random() < 0.03) {
			Bubble.add();
		}
		window.requestAnimationFrame(Bubble.draw);
	}

	function load(url) {
		return fetch(url)
			.then(function (response) {
				let content_type = response.headers.get('Content-Type');
				content_type = content_type.slice(0, content_type.indexOf(';'));
				let handler = loadHandlers[content_type];
				console.log(content_type);
				if (handler) {
					return new Promise((resolve, reject) => {
						resolve(handler(response));
					});
				} else {
					return response;
				}
			});
	}

	let state = 'start',
		menu = 'none',
		loadHandlers = {
			'application/json': (response) => {
				return response.json();
			},
			'text/html': function (response) {
				return response.text();
			}
		},
		listeners = {
			mousedown: {
				'app-select.blog': function (event) {
					history.replaceState({}, 'posts', 'posts');
					router();
				},
				'app-select.info': function (event) {
					history.replaceState({}, 'info', 'info');
					router();
				},
				'app-select.projects': function (event) {
					history.replaceState({}, 'projects', 'projects');
					router();
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

					for (let e of parent.parentElement.getElementsByClassName('active')) {
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
						load('/posts/' + parent.getAttribute('app-post-path') + '/index.html').then((data) => {
							parent.querySelector('app-post-content').innerHTML = data;

							this.setAttribute('loaded', true);
						});
					}

				},
				'app-settings': function (event) {
					if (!event.currentTarget.classList.contains('active')) {
						event.currentTarget.classList.add('active');
					} else {
						event.currentTarget.classList.remove('active');
					}
				},
				'app-settings-menu-option': function (event) {
					if (!document.body.classList.contains('dark')) {
						document.body.classList.add('dark');
						svg.classList.add('dark');
						localStorage.setItem('mode', 'dark')
					} else {
						localStorage.setItem('mode', 'light');
						document.body.classList.remove('dark');
						svg.classList.remove('dark');
					}
				}
			},
			touchstart: {
				'app-select.blog': function (event) {
					setState('menu');

					setMenu('blog');
				},
				'app-select.info': function (event) {
					setState('menu');
					setMenu('info');
				},
				'app-select.projects': function (event) {
					setState('menu');
					setMenu('projects');
				}
			},
			dblclick: {
			}

		}

	function registerListeners() {
		for (let l in listeners) {
			let listenerType = listeners[l];
			for (let e in listenerType) {
				document.querySelectorAll(e).forEach(function (k) {
					k.addEventListener(l, listenerType[e], { passive: true, capture: false });
				});
			}

		}
	}


	function appendPosts(data) {
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
		registerListeners();
		let posts = document.getElementsByTagName('app-post');
		for (let p of posts) {
			p.offset = getOffset(p).top - header.offsetHeight
		}
	}

	function onload() {
		manageSvg();
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		window.requestAnimationFrame(Bubble.draw);
		container = document.body;
		header = document.getElementsByTagName('app-header')[0];

		load('/posts.json').then(appendPosts);
		registerListeners();
		router();
		console.log("loaded");

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
	function manageSvg() {
		let name = document.getElementById("name");
		svg = name.contentDocument.getElementById("paths");
		svg.pauseAnimations();
		document.body.addEventListener('scroll', (e) => {
			let value = 1 - (svg.clientHeight - ((window.pageYOffset || document.body.scrollTop) - (window.innerHeight * 0.02)) - (document.documentElement.clientTop || 0)) / svg.clientHeight;
			if (value > 4) return;
			if (value < 0) value = 0;
			if (value > 1) value = 1;
			window.requestAnimationFrame(function () {

				name.style.width = 100 * value + '%';
				svg.setCurrentTime(value * 100);
			});
		});
	}
	function setState(s) {
		if (s != state) {
			container.setAttribute('state', s);
			state = s;
		}
	}
	function setMenu(m) {
		if (m != menu) {
			container.setAttribute('menu', m);

			menu = m;

		}
	}
	function router() {
		let path = decodeURI(window.location.pathname);
		if (path !== '/') {
			path = path.split('/');
			console.log(path);
			let menuitems = { 'info': 1, 'projects': 1, 'posts': 1 }
			if (menuitems[path[1]]) {
				setState('menu');
				setMenu(path[1]);
			}
		}
	}
	window.onpopstate = function (e) {
		router();
	};

	window.addEventListener('resize', function (evt) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});

	return { onload }
})();
window.onload = app.onload;

