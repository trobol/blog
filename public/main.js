
const app = (function () {
	let canvas, ctx, header,
		bubblesEnabled = true,
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
				'h1': function (element) {
					index = (index + 1) % 7;
					name.style.fontFamily = fonts[index];
				}
			},
			click: {
				'app-post-header': function (event) {
					let parent = this.parentElement,
						active = parent.classList.contains('active');
					let e = parent.parentElement.getElementsByClassName('active');
					for (let i in e) {
						e[i].classList.remove('active');
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
						if (event.target.tagName == "svg" || event.target == event.currentTarget) {
							event.currentTarget.classList.remove('active');
						}
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
	let posts = {}, top;

	function appendPosts(data) {
		let blogPanel = document.querySelector('app-panel.blog');

		console.log(top);
		for (let i in data) {
			let post = buildPost(data[i]);
			blogPanel.append(post);
			data[i].element = post;
			post.offset = getOffset(post).top - header.offsetHeight - top;
			posts[data[i].url] = data[i];
		}
		registerListeners();

	}
	function showPost(element) {

		let parent = element.tagName == "APP-POST" ? element : element.parentElement,
			active = parent.classList.contains('active');

		for (let e of parent.parentElement.getElementsByClassName('active')) {
			e.classList.remove('active');
		}
		if (!active) {
			console.log(parent.offset);
			document.body.scrollTo({
				top: parent.offset,
				left: 0,
				behavior: 'smooth'
			});
			parent.classList.add('active');
			history.replaceState({}, 'Thornton', element.href);
		}
		if (element.hasAttribute("loaded")) {

		} else {
			load('/posts/' + parent.getAttribute('app-post-path') + '/index.html').then((data) => {
				parent.querySelector('app-post-content').innerHTML = data;

				element.setAttribute('loaded', true);
			});
		}
	}

	function buildPost(i) {
		let color = colors[i.id % colors.length],
			months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
			a = htmlToElement(`<a class="post-header" href="/posts/${i.url}"}><app-post-date><app-post-day>${i.day}</app-post-day><app-post-month>${months[i.month]}</app-post-month></app-post-date><app-post-info><app-post-title>${i.title}</app-post-title><p>${i.description}</p></app-post-info></a>`),
			element = htmlToElement(`<app-post style="color:${color}" app-post-path="${i.url}" tabindex="-1"><app-post-content><img src="/img/spinner.svg" alt="loading"></app-post-content></app-post>`);

		a.onclick = function (event) {
			showPost(this);
			return false;
		};
		element.prepend(a);
		return element;
	}
	function htmlToElement(html) {
		var template = document.createElement('template');
		html = html.trim();
		template.innerHTML = html;
		return template.content.firstChild;
	}
	function onload() {
		manageSvg();
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		let elements = document.getElementsByTagName('a');
		for (let i in elements) {
			elements[i].onclick = function (event) {
				history.replaceState({}, 'Thornton', elements[i].href);
				router();
				return false;
			};

		}
		window.requestAnimationFrame(Bubble.draw);
		container = document.body;
		header = document.getElementsByTagName('app-header')[0];
		top = window.getComputedStyle(header).top;
		top = parseFloat(top.slice(0, top.length - 2));
		load('/posts.json').then((r) => {
			appendPosts(r);
			router();
		});
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
				if (path[1] === 'posts') {
					if (posts[path[2]]) {
						console.log(posts[path[2]].element);
						showPost(posts[path[2]].element);
					}
				}
			}
		}

	}
	window.onpopstate = function (e) {
		//router();
	};

	window.addEventListener('resize', function (evt) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});

	return { onload, bubblesEnabled }
})();
window.onload = app.onload;

