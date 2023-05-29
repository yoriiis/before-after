import './main.css'
import './images/color.jpg'
import './images/gray.jpg'
import BeforeAfter from '../src/before-after.js'

/* eslint-disable no-unused-vars */
const beforeAfterItem = new BeforeAfter(document.querySelector('.beforeafter'), {
	cursor: true,
	orientation: 'horizontal',
	start: 30
})
