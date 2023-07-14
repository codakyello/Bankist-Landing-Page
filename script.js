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

window.onscroll = () => {
  if (section1.getBoundingClientRect().top - nav.offsetHeight < 1) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

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
