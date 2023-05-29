import './main.css'
import './images/1.jpg'
import './images/2.jpg'
import BeforeAfter from '../src/before-after.js'

const beforeAfterItem = new BeforeAfter({
	element: document.querySelector('.beforeafter')
})
beforeAfterItem.create(() => beforeAfterItem.goTo(50))
