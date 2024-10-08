const modalWindow = document.querySelector(".modal-window");
const overlay = document.querySelector(".overlay");
const btnCloseModalWindow = document.querySelector(".btn--close-modal-window");
const btnsOpenModalWindow = document.querySelectorAll(
	".btn--show-modal-window"
);

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContents = document.querySelectorAll(".operations__content");

const nav = document.querySelector(".nav");

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Modal windows
const openModalWindow = function (e) {
	e.preventDefault();
	modalWindow.classList.remove("hidden");
	overlay.classList.remove("hidden");
};

const closeModalWindow = function () {
	modalWindow.classList.add("hidden");
	overlay.classList.add("hidden");
};

btnsOpenModalWindow.forEach((button) =>
	button.addEventListener("click", openModalWindow)
);

// for (let i = 0; i < btnsOpenModalWindow.length; i++)
//   btnsOpenModalWindow[i].addEventListener('click', openModalWindow);

btnCloseModalWindow.addEventListener("click", closeModalWindow);
overlay.addEventListener("click", closeModalWindow);

document.addEventListener("keydown", function (e) {
	if (e.key === "Escape" && !modalWindow.classList.contains("hidden")) {
		closeModalWindow();
	}
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Smooth scroll
btnScrollTo.addEventListener("click", function (e) {
	const section1Coords = section1.getBoundingClientRect();

	// console.log(e.target.getBoundingClientRect());
	// console.log(
	//   'Текущее прокручивание: x, y',
	//   window.pageXOffset,
	//   window.pageYOffset
	// );
	// console.log(
	//   'Ширина и высота viewport:',
	//   document.documentElement.clientWidth,
	//   document.documentElement.clientHeight
	// );

	// An old approach
	// // window.scrollTo(
	// //   section1Coords.left + window.pageXOffset,
	// //   section1Coords.top + window.pageYOffset
	// // );

	// window.scrollTo({
	//   left: section1Coords.left + window.pageXOffset,
	//   top: section1Coords.top + window.pageYOffset,
	//   behavior: 'smooth',
	// });

	section1.scrollIntoView({ behavior: "smooth" });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Smooth page navigation
// The method isn't good enough optimized for many links because it makes copies of Event Handlers
// document.querySelectorAll('.nav__link').forEach(function (htmlElement) {
//   htmlElement.addEventListener('click', function (e) {
//     e.preventDefault();
//     const href = this.getAttribute('href');
//     document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Event delegation
// 1. Adding event listener to the parent element
document.querySelector(".nav__links").addEventListener("click", function (e) {
	e.preventDefault();
	// 2. Define a target element
	if (e.target.classList.contains("nav__link")) {
		const href = e.target.getAttribute("href");
		document.querySelector(href).scrollIntoView({ behavior: "smooth" });
	}
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tabs
tabsContainer.addEventListener("click", function (e) {
	const clickedButton = e.target.closest(".operations__tab");
	// Guard clause - пункт охраны
	if (!clickedButton) return;

	// Active tab
	tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
	clickedButton.classList.add("operations__tab--active");

	// Active content
	tabsContents.forEach((content) =>
		content.classList.remove("operations__content--active")
	);

	document
		.querySelector(`.operations__content--${clickedButton.dataset.tab}`)
		.classList.add("operations__content--active");
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fade Out effect for nav-links
const navLinksHoverAnimation = function (e) {
	if (e.target.classList.contains("nav__link")) {
		const linkOver = e.target;
		const siblingLinks = linkOver
			.closest(".nav__links")
			.querySelectorAll(".nav__link");
		const logo = linkOver.closest(".nav").querySelector("img");
		const logoText = linkOver.closest(".nav").querySelector(".nav__text");

		siblingLinks.forEach((el) => {
			if (el !== linkOver) el.style.opacity = this;
		});
		logo.style.opacity = this;
		logoText.style.opacity = this;
	}
};

// Working with arguments within bind() / this
nav.addEventListener("mouseover", navLinksHoverAnimation.bind(0.4));
nav.addEventListener("mouseout", navLinksHoverAnimation.bind(1));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sticky navigation - Intersection Observer API
const getStickyNav = function (entries) {
	const entry = entries[0];

	if (!entry.isIntersecting) {
		nav.classList.add("sticky");
	} else {
		nav.classList.remove("sticky");
	}
};

const headerObserver = new IntersectionObserver(getStickyNav, {
	root: null,
	threshold: 0,
	rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sections Shows Up animation - Intersection Observer API
const allSections = document.querySelectorAll(".section");

const sectionAppearance = function (entries, observer) {
	const entry = entries[0];
	if (!entry.isIntersecting) return;
	entry.target.classList.remove("section--hidden");
	observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionAppearance, {
	root: null,
	threshold: 0.2,
});

allSections.forEach(function (section) {
	sectionObserver.observe(section);
	// section.classList.add('section--hidden');
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lazy Loading for images - Intersection Observer API
const lazyImages = document.querySelectorAll("img[data-src]");

const loadImages = function (entries, observer) {
	const entry = entries[0];

	if (!entry.isIntersecting) return;

	// Changing image to a best qualitified
	entry.target.src = entry.target.dataset.src;
	entry.target.classList.remove("lazy-img");

	entry.target.addEventListener("load", function () {
		entry.target.classList.remove("lazy-img");
	});

	observer.unobserve(entry.target);
};

const lazyImagesObserver = new IntersectionObserver(loadImages, {
	root: null,
	threshold: 0.7,
	// rootMargin: '500px',
});

lazyImages.forEach((image) => lazyImagesObserver.observe(image));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Slider
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

let currentSlide = 0;
let slidesNumber = slides.length;

// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.4) translateX(1300px)';
// slider.style.overflow = 'visible';

const createDots = function () {
	slides.forEach(function (_, index) {
		dotContainer.insertAdjacentHTML(
			"beforeend",
			`<button class="dots__dot" data-slide="${index}"></button>`
		);
	});
};

createDots();

const activateCurrentDot = function (slide) {
	document
		.querySelectorAll(".dots__dot")
		.forEach((dot) => dot.classList.remove("dots__dot--active"));

	document
		.querySelector(`.dots__dot[data-slide="${slide}"]`)
		.classList.add("dots__dot--active");
};

activateCurrentDot(0);

const moveToSlide = function (slide) {
	slides.forEach(
		(s, index) => (s.style.transform = `translateX(${(index - slide) * 100}%)`)
	);
};

moveToSlide(0);

const nextSlide = function () {
	if (currentSlide === slidesNumber - 1) {
		currentSlide = 0;
	} else {
		currentSlide++;
	}

	moveToSlide(currentSlide);
	// 1 - -100%, 2 - 0, 3 - 100%, 4 - 200%
	activateCurrentDot(currentSlide);
};

const previousSlide = function () {
	if (currentSlide === 0) {
		currentSlide = slidesNumber - 1;
	} else {
		currentSlide--;
	}

	moveToSlide(currentSlide);
	// 1 - -100%, 2 - 0, 3 - 100%, 4 - 200%
	activateCurrentDot(currentSlide);
};

btnRight.addEventListener("click", nextSlide);

btnLeft.addEventListener("click", previousSlide);

document.addEventListener("keydown", function (e) {
	if (e.key === "ArrowRight") nextSlide();
	if (e.key === "ArrowLeft") previousSlide();
});

dotContainer.addEventListener("click", function (e) {
	if (e.target.classList.contains("dots__dot")) {
		const slide = e.target.dataset.slide;
		moveToSlide(slide);
		activateCurrentDot(slide);
	}
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// console.log(document.querySelector('.header'));
// const sections = document.querySelectorAll('.section');
// console.log(sections);

// console.log(document.getElementById('section--1'));
// const buttons = document.getElementsByTagName('button');
// console.log(buttons);

// console.log(document.getElementsByClassName('btn'));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // Создание и вставка элементов
// // insertAdjicentHTML()
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent =
// //   'Мы используем на этом сайте cookie для улучшения функциональности.';
// message.innerHTML =
//   'Мы используем на этом сайте cookie для улучшения функциональности. <button class="btn btn--close-cookie">Ок!</button>';

// const header = document.querySelector('.header');
// // header.prepend(message);
// header.append(message);
// // header.append(message.cloneNode(true));
// // header.before(message);
// // header.after(message);

// // Удаление элементов
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();

//     // An old approach
//     // message.parentElement.removeChild(message);
//   });

// // Стили
// message.style.backgroundColor = '#076785';
// message.style.width = '120%';
// console.log(message.style.width);
// console.log(message.style.color);
// console.log(message.style.backgroundColor);
// console.log(getComputedStyle(message));
// console.log(getComputedStyle(message).height);
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 50 + 'px';
// console.log(message.style.height);

// document.documentElement.style.setProperty('--color-first', 'yellow');

// // Атрибуты
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.getAttribute('src'));
// console.log(logo.className);

// logo.alt = 'Лого Прекрасного Банка';

// // Нестандартный атрибут
// console.log(logo.developer);
// console.log(logo.getAttribute('developer'));
// logo.setAttribute('Copyright', 'Masters OF Code');

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// // Data attributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('a', 'b');
// logo.classList.remove('a', 'b');
// logo.classList.toggle('a');
// logo.classList.contains('c');

// // Не использовать
// // logo.className = 'a';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Виды Событий И Обработчиков Событий
// const h1 = document.querySelector('h1');
// // const alertMouseEnterH1 = function (e) {
// //   alert('addEventListener: You are now at the h1 element');
// //   h1.removeEventListener('mouseenter', alertMouseEnterH1);
// // };

// const alertMouseEnterH1 = function (e) {
//   alert('addEventListener: You are now at the h1 element');
// };

// h1.addEventListener('mouseenter', alertMouseEnterH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertMouseEnterH1), 3000);

// An old approach
// h1.onclick = function (e) {
//   alert('onclick: You have clicked the h1 element');
// };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Event Propagation
// rgb(123, 56, 78)
// function getRandomIntInclusive(min, max) {
//   const minCeiled = Math.ceil(min);
//   const maxFloored = Math.floor(max);
//   return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
// }

// const getRandomColor = () =>
//   `rgb(${getRandomIntInclusive(0, 255)}, ${getRandomIntInclusive(
//     0,
//     255
//   )}, ${getRandomIntInclusive(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = getRandomColor();
//   console.log('link', e.target, e.currentTarget);
//   console.log(this === e.currentTarget);

//   // // Stop propagation
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = getRandomColor();
//   console.log('links', e.target, e.currentTarget);
//   console.log(this === e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = getRandomColor();
//     console.log('nav', e.target, e.currentTarget);
//     console.log(this === e.currentTarget);
//   }
//   // ,true OLD Approach
// );

// document.querySelector('body').addEventListener('click', function (e) {
//   this.style.backgroundColor = getRandomColor();
//   console.log('body', e.target, e.currentTarget);
//   console.log(this === e.currentTarget);
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DOM traversing (Перемещение по DOM)
// const h1 = document.querySelector('h1');

// // Перемещение вниз (к потомку)
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// console.log(h1.firstElementChild);
// h1.firstElementChild.style.color = 'yellow';
// console.log(h1.lastElementChild);

// // Перемещение вверх (к родителю)
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// const h2 = document.querySelector('h2');
// // h2.closest('.section').style.backgroundColor = 'blue';
// // h2.closest('h2').style.backgroundColor = 'green';

// // Перемещение в стороны (на одном уровне)
// console.log(h2.previousElementSibling);
// console.log(h2.nextElementSibling);

// console.log(h1.parentElement.children);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sticky navigation BAD APPROACH
// const section1Coords = section1.getBoundingClientRect();
// console.log(section1Coords);

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   if (window.scrollY > section1Coords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Intersection Observer API
// const observerCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const observerOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lifecycle DOM Events
document.addEventListener("DOMContentLoaded", function (e) {
	console.log("DOM tree is created", e);
});

window.addEventListener("load", function (e) {
	console.log("The page is loaded", e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
