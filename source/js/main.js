
var navMain = document.querySelector('.main-nav');
var pageHeader = document.querySelector('.page-header__wrapper');
var pageHeaderLogo = document.querySelector('.page-header__wrapper-logo');
var navToggle = document.querySelector('.main-nav__toggle');

pageHeader.classList.remove('page-header__wrapper--nojs')
navMain.classList.remove('main-nav--nojs');
pageHeaderLogo.classList.remove('page-header__wrapper-logo--nojs');

navToggle.addEventListener('click', function() {
  if (navMain.classList.contains('main-nav--closed')) {
      navMain.classList.remove('main-nav--closed');
      navMain.classList.add('main-nav--opened');
      pageHeader.classList.add('page-header__wrapper--opened');
      pageHeaderLogo.classList.remove('page-header__wrapper-logo--closed');
  } else {
      navMain.classList.add('main-nav--closed');
      navMain.classList.remove('main-nav--opened');
      pageHeader.classList.remove('page-header__wrapper--opened');
      pageHeaderLogo.classList.add('page-header__wrapper-logo--closed');
  }
});
