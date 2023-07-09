const DEFAULT_OPTIONS = {
	cursor: true,
	orientation: 'horizontal',
	start: 50
}

export default class BeforeAfter {
	/**
	 * @param {options}
	 */
	constructor(element, options = {}) {
		this.options = { ...DEFAULT_OPTIONS, ...options }

		// Detect touch devices
		this.hasTouch =
			'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
		this.hasMSPointer = window.navigator.msPointerEnabled

		if (element === null) {
			console.warn('BeforeAfter::Option element is missing')
		}

		this.elements = {
			container: element,
			first: null,
			last: null
		}
		this.data = {
			vertical: {
				widthHeight: 'height',
				attrToAnimate: 'top'
			},
			horizontal: {
				widthHeight: 'width',
				attrToAnimate: 'left'
			}
		}
		this.heightElement = null
		this.widthElement = null
		this.timerGoTo = null
		this.timerCleaned = false
		this.cursor = null

		this.onResize = this.onResize.bind(this)
		this.onMove = this.onMove.bind(this)

		this.init()
	}

	/**
	 * Create the BeforeAfter item
	 */
	init() {
		this.addImageWrapper()

		this.heightElement = parseInt(this.elements.container.offsetHeight)
		this.widthElement = parseInt(this.elements.container.offsetWidth)
		this.elements.first = this.elements.container.firstElementChild
		this.elements.last = this.elements.container.lastElementChild

		this.applyStyles()

		if (this.options.cursor) {
			this.buildCursor()
			this.updateCursor()
		}

		this.addEvents()
		this.goTo(this.options.start)
	}

	/**
	 * Build the cursor item if it is not exist
	 */
	buildCursor() {
		const htmlCursor = `<div class='beforeafter-cursor'></div>`
		this.elements.container.insertAdjacentHTML('beforeend', htmlCursor)
	}

	/**
	 * Update the cursor position on move events
	 */
	updateCursor() {
		this.cursor = this.elements.container.parentNode.querySelector('.beforeafter-cursor')

		this.cursor.style.position = 'absolute'
		this.cursor.style.zIndex = 10
		this.cursor.style.backgroundColor = '#000'
		this.cursor.style.overflow = 'hidden'
		this.cursor.style.display = 'block'

		if (this.options.orientation === 'horizontal') {
			this.cursor.style.width = '2px'
			this.cursor.style.height = '100%'
			this.cursor.style.top = '0px'
			this.cursor.style.left = '0px'
		} else if (this.options.orientation === 'vertical') {
			this.cursor.style.width = '100%'
			this.cursor.style.height = '2px'
			this.cursor.style.left = '0px'
			this.cursor.style.top = '0px'
		}

		if (this.options.direction === 'rtl') {
			this.cursor.style.left = 'auto'
			this.cursor.style.right = '0px'
		} else if (this.options.direction === 'btt') {
			this.cursor.style.top = 'auto'
			this.cursor.style.bottom = '0px'
		}
	}

	/**
	 * Wrap all images with a wrapper
	 */
	addImageWrapper() {
		const pictures = [...this.elements.container.querySelectorAll('img')]
		pictures.forEach((picture) => {
			const wrapper = document.createElement('div')
			wrapper.classList.add('beforeafter-item')
			picture.parentNode.insertBefore(wrapper, picture)
			wrapper.appendChild(picture)
		})
	}

	applyStyles() {
		this.elements.last.style.zIndex = 1

		const items = [...this.elements.container.querySelectorAll('.beforeafter-item')]
		items.forEach((item) => {
			const image = item.querySelector('img')

			image.style.position = 'absolute'
			image.style.width = `${this.widthElement}px`
			item.style.position = 'absolute'

			item.style.overflow = 'hidden'
			item.style.height = '100%'

			if (this.options.orientation === 'horizontal') {
				item.style.top = '0px'
				item.style.width = `${this.widthElement}px`

				this.elements.last.style.top = '0px'
				this.elements.last.style.left = 'auto'
				this.elements.last.style.right = '0'

				image.style.right = '0px'
			} else if (this.options.orientation === 'vertical') {
				item.style.left = '0px'
				item.style.width = '100%'

				this.elements.last.style.bottom = '0'
				this.elements.last.style.top = 'auto'

				image.style.bottom = '0px'
			}
		})
	}

	/**
	 * Remove wrapper on each images
	 */
	removeImageWrappers() {
		const items = [...this.elements.container.querySelectorAll('img')]
		items.forEach((item) => {
			const parentNode = item.parentNode
			item.removeAttribute('style')
			parentNode.replaceWith(...parentNode.childNodes)
		})
	}

	/**
	 * Add event listeners on move and resize
	 */
	addEvents() {
		this.getUserEventsToTrack().forEach((event) => {
			this.elements.container.addEventListener(event, this.onMove)
		})
		window.addEventListener('resize', this.onResize)
	}

	/**
	 * On move event
	 * @param {Event} e Event data
	 */
	onMove(e) {
		this.move(e)
	}

	/**
	 * On resize event
	 */
	onResize() {
		this.heightElement = parseInt(this.elements.container.offsetHeight)
		this.widthElement = parseInt(this.elements.container.offsetWidth)
		this.applyStyles()
		this.goTo(this.options.start)
	}

	/**
	 * Remove event listeners on move and resize
	 */
	removeEvents() {
		this.getUserEventsToTrack().forEach((event) => {
			this.elements.container.removeEventListener(event, this.onMove)
		})
		window.removeEventListener('resize', this.onResize)
	}

	/**
	 * Detect which events to track depending on the capabilities of the device
	 * @returns {Array} with the list of events
	 */
	getUserEventsToTrack() {
		return this.hasTouch
			? this.hasMSPointer
				? ['pointerstart', 'MSPointerMove']
				: ['touchstart', 'touchmove']
			: ['mousemove']
	}

	/**
	 * Move images and cursor on user events
	 * @param {Object} e Object from event listener
	 */
	move(e) {
		e.preventDefault()

		// If user hover during animation, clear timer and stop animate
		if (this.timerGoTo !== null && !this.timerCleaned) {
			clearTimeout(this.timerGoTo)
			if (this.options.cursor) {
				this.updateCursor()
			}
			this.timerCleaned = true
		}

		let valueMoveTransform = 0
		let valueMoveCSS = 0
		let valueMovePicture = 0
		let pageX = 0
		let pageY = 0

		pageX = this.hasTouch ? e.touches[0].pageX : this.hasMSPointer ? e.pageX : e.pageX
		pageY = this.hasTouch ? e.touches[0].pageY : this.hasMSPointer ? e.pageY : e.pageY
		const elementBoundingClientRect = this.elements.container.getBoundingClientRect()

		if (this.options.orientation === 'horizontal') {
			valueMoveCSS = parseInt(pageX - elementBoundingClientRect.x)
			valueMoveTransform = `${valueMoveCSS}px, 0, 0`
			valueMovePicture = this.widthElement - valueMoveCSS
		} else if (this.options.orientation === 'vertical') {
			valueMoveCSS = parseInt(pageY - elementBoundingClientRect.y)
			valueMoveTransform = `0, ${valueMoveCSS}px, 0`
			valueMovePicture = this.heightElement - valueMoveCSS
		}

		// If cursor enabled, apply new position
		if (this.options.cursor) {
			this.cursor.style.transform = `translate3d(${valueMoveTransform})`
		}

		// Update new position on image
		this.elements.last.style[
			this.data[this.options.orientation].widthHeight
		] = `${valueMovePicture}px`

		// Update current position available on instance
		this.position = valueMoveCSS
	}

	/**
	 * Move the animation of the image and cursor to a specific position
	 * @param {Interger|Float} percentage Percentage of offset
	 */
	goTo(percentage) {
		let valueMoveDependOnElement = 0
		let valueMove = 0
		let valueCursorTransform = 0

		if (this.options.orientation === 'horizontal') {
			valueMoveDependOnElement = this.widthElement - (this.widthElement * percentage) / 100
			valueMove = (this.widthElement * percentage) / 100
		} else if (this.options.orientation === 'vertical') {
			valueMoveDependOnElement = this.heightElement - (this.heightElement * percentage) / 100
			valueMove = (this.heightElement * percentage) / 100
		}

		this.elements.last.style[this.data[this.options.orientation].widthHeight] = `${valueMove}px`

		if (this.options.cursor) {
			if (this.options.orientation === 'horizontal') {
				valueCursorTransform = `${valueMoveDependOnElement}px, 0, 0`
				this.cursor.style[this.data[this.options.orientation].attrToAnimate] = 'auto'
			} else if (this.options.orientation === 'vertical') {
				valueCursorTransform = `0, ${valueMoveDependOnElement}px, 0`
				this.cursor.style[this.data[this.options.orientation].attrToAnimate] = 0
			}

			this.cursor.style.transform = `translate3d(${valueCursorTransform})`
		}

		// Update current position available on instance
		this.position = valueMoveDependOnElement
	}

	/**
	 * Remove the BeforeAfter item
	 */
	destroy() {
		this.cursor.remove()
		this.removeEvents()
		this.removeImageWrappers()
		this.timerGoTo = null
		this.timerCleaned = false
	}
}
