import './main.css'
import BeforeAfter from 'before-after'
import './images/color.jpg'
import './images/gray.jpg'

new BeforeAfter(document.querySelector('.beforeafter'), {
	cursor: true,
	orientation: 'horizontal',
	start: 50
})
