'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const tabContainer = document.querySelector('.operations__tab-container');
const tabBtns = document.querySelectorAll('.operations__tab');
const tabContents = document.querySelectorAll('.operations__content');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const sliders = document.querySelectorAll('.slide');
const dotsParent = document.querySelector('.dots');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btnOpenModal => {
  btnOpenModal.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

document.querySelector('.btn--scroll-to').addEventListener('click', e => {
  // Old method of scrolling using px and numbers

  // Get the element you want to scroll to - Section1
  // Get its distance of element from top of viweport
  // const scrollTo = section1.getBoundingClientRect();
  // Get vertical offset of page viewport to top of page
  // window.pageYoffset
  // window.pageXoffset
  // Scrolls relative to top of page
  // window.scrollTo({
  //   scrollTo.left + window.pageXOffset,
  //   scrollTo.top + window.pageYOffset,
  //   behavior: 'smooth'
  // });

  // Newer method - Just call this method on the element.
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Since we have 3 different links and a similar parent
// Lets use the concept of capturing and bubling so we can add only 1 event handler to parent instead of 3

navLinks.addEventListener('click', e => {
  e.preventDefault();
  if (!e.target.classList.contains('nav__link')) return;
  if (e.target.getAttribute('href') === '#') return;
  const scrollId = e.target.getAttribute('href');
  document.querySelector(scrollId).scrollIntoView({ behavior: 'smooth' });
});

tabContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  tabBtns.forEach(tabBtn => tabBtn.classList.remove('operations__tab--active'));

  clicked.classList.add('operations__tab--active');

  tabContents.forEach(tabContent =>
    tabContent.classList.remove('operations__content--active')
  );

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// To implement sticky header
// When the section is at top of the page - height of the nav
// Not good for performance since it calls a call back on every scroll of the page
// window.onscroll = () => {
//   if (
//     section1.getBoundingClientRect().top - nav.getBoundingClientRect().height <
//     1
//   ) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// };
const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      nav.classList.add('sticky');
    } else {
      nav.classList.remove('sticky');
    }
  });
};
const headerObs = new IntersectionObserver(obsCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
});
headerObs.observe(header);

const sectionObs = new IntersectionObserver(
  entries => {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    sectionObs.unobserve(entry.target);
  },
  {
    root: null,
    threshold: 0.15,
  }
);
sections.forEach(section => {
  sectionObs.observe(section);
  section.classList.add('section--hidden');
});

// Menu fade animation
navLinks.addEventListener('mouseover', function (e) {
  // Get the parent El and then get the children
  const link = e.target.classList.contains('nav__link');
  if (link) {
    const siblings = e.currentTarget.querySelectorAll('.nav__link');
    siblings.forEach(child => {
      // console.log(e.target.closest('.nav__item'));
      if (child !== e.target) child.style.opacity = '0.5';
    });
  }
});

navLinks.addEventListener('mouseout', e => {
  document
    .querySelectorAll('.nav__link')
    .forEach(nav => (nav.style.opacity = '1'));
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loading = entries => {
  const [entry] = entries;
  if (entry.target.classList.contains('features__img--1')) console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
  imgOberver.unobserve(entry.target);
};

const imgOberver = new IntersectionObserver(loading, {
  root: null,
  threshold: 1,
});

imgTargets.forEach(img => imgOberver.observe(img));

// Lets make the slider work
// The default will 1st slider will be 0 second will be 100, 3rd will be 200
// When will click right remove 100 to each of them
// When will click left add 100 from each of them: check if the first item is at 0% meaning there is no longer any item at its left then go back to the last item. (-200, -100, 0)
// When clicking right check if the last item has 0% transform meaning that its the last item then go back to default (0, 100, 200)

// Create dots according to the number of slides
sliders.forEach((_, index) => {
  const dot = document.createElement('div');
  dot.classList.add('dots__dot');
  dotsParent.append(dot);
});

//Get all dots after creating
const dots = document.querySelectorAll('.dots__dot');

const addActive = () => {
  dots.forEach(dot => {
    dot.classList.remove('dots__dot--active');
  });

  sliders.forEach((slider, index) => {
    if (slider.dataset.pos === '0') {
      dots[index].classList.add('dots__dot--active');
    }
  });
};

// Default start position of sliders
const sliderToBegin = () => {
  sliders.forEach((slider, index) => {
    slider.dataset.pos = index * 100;
    slider.style.transform = `translateX(${index * 100}%)`;
  });
};

sliderToBegin();
addActive();

// Slider to go to end when nothing at back of the first slider
const sliderToEnd = () => {
  const slidersClone = [...sliders];
  slidersClone.reverse().forEach((slider, index) => {
    slider.dataset.pos = index * -100;
    slider.style.transform = `translateX(${slider.dataset.pos}%)`;
  });
};

// Move slider back or front
const moveslide = move => {
  move = move === 1 ? -100 : 100;
  sliders.forEach(slider => {
    slider.dataset.pos = Number(slider.dataset.pos) + move;
    slider.style.transform = `translateX(${slider.dataset.pos}%)`;
  });
};

const nextSlide = () => {
  if (sliders[sliders.length - 1].dataset.pos !== '0') {
    moveslide(1);
  } else {
    sliderToBegin();
  }
};

const preSlide = () => {
  if (sliders[0].dataset.pos !== '0') {
    moveslide(0);
  } else {
    sliderToEnd();
  }
};

// Now implement event listeners on the dots
document.querySelector('.slider').addEventListener('click', e => {
  const clicked = e.target.classList.contains('slider__btn');
  if (!clicked) return;
  // Differentiate if its left or right clicks
  if (e.target.classList.contains('slider__btn--right')) {
    nextSlide();
  } else {
    preSlide();
  }
  addActive();
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();

  if (e.key === 'ArrowLeft') preSlide();

  // Go to next slide

  addActive();
});
// Check for the index of the data set of O
// Match it with the index of the dot and put player--active on it
// Get current active index if target is less than index go backwards
// Else if target is greater than index go forward

dotsParent.addEventListener('click', e => {
  const clicked = e.target.classList.contains('dots__dot');
  if (!clicked) return;
  let activeIndex = '';
  let gotoIndex = '';
  dots.forEach((dot, index) => {
    if (dot.classList.contains('dots__dot--active')) {
      activeIndex = index;
    }
    if (e.target === dot) {
      gotoIndex = index;
    }
  });

  const diffIndex = Math.abs(activeIndex - gotoIndex);
  if (gotoIndex < activeIndex) {
    for (let i = 0; i < diffIndex; i++) {
      moveslide(0);
    }
  }
  if (gotoIndex > activeIndex) {
    for (let i = 0; i < diffIndex; i++) {
      moveslide(1);
    }
  }
  addActive();
});
