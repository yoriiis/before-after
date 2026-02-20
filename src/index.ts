interface BeforeAfterOptions {
	cursor: boolean
	orientation: 'horizontal' | 'vertical'
	start: number
	direction?: 'rtl' | 'btt'
}

type BeforeAfterUserOptions = Partial<BeforeAfterOptions>

const DEFAULT_OPTIONS: BeforeAfterOptions = {
	cursor: true,
	orientation: 'horizontal',
	start: 50
}

export default class BeforeAfter {
	private options: BeforeAfterOptions
	private hasTouch: boolean
	private hasMSPointer: boolean
	private elements: {
		container: HTMLElement | null
		first: HTMLElement | null
		last: HTMLElement | null
	}
	private data: Record<
		'horizontal' | 'vertical',
		{
			widthHeight: 'height' | 'width'
			attrToAnimate: 'top' | 'left'
		}
	>
	private heightElement: number | null
	private widthElement: number | null
	private timerGoTo: ReturnType<typeof setTimeout> | null
	private timerCleaned: boolean
	private cursor: HTMLElement | null
	private position: number | null
	/**
	 * @param options
	 */
	constructor(element: HTMLElement | null, options: BeforeAfterUserOptions = {}) {
		this.options = { ...DEFAULT_OPTIONS, ...options }

		// Detect touch devices
		const navigatorAny = window.navigator as any

		this.hasTouch =
			'ontouchstart' in window ||
			navigatorAny.maxTouchPoints > 0 ||
			navigatorAny.msMaxTouchPoints > 0
		this.hasMSPointer = !!navigatorAny.msPointerEnabled

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
		this.position = null

		this.onResize = this.onResize.bind(this)
		this.onMove = this.onMove.bind(this)

		this.init()
	}

	/**
	 * Create the BeforeAfter item
	 */
	init() {
		if (!this.elements.container) {
			return
		}

		this.addImageWrapper()

		this.heightElement = parseInt(String(this.elements.container.offsetHeight), 10)
		this.widthElement = parseInt(String(this.elements.container.offsetWidth), 10)
		this.elements.first = this.elements.container.firstElementChild as HTMLElement | null
		this.elements.last = this.elements.container.lastElementChild as HTMLElement | null

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
		const container = this.elements.container
		if (!container) {
			return
		}

		const htmlCursor = `<div class='beforeafter-cursor'></div>`
		container.insertAdjacentHTML('beforeend', htmlCursor)
	}

	/**
	 * Update the cursor position on move events
	 */
	updateCursor() {
		if (!this.elements.container) {
			return
		}

		const parentNode = this.elements.container.parentNode as ParentNode | null
		if (!parentNode) {
			return
		}

		this.cursor = parentNode.querySelector('.beforeafter-cursor') as HTMLElement | null
		if (!this.cursor) {
			return
		}

		this.cursor.style.position = 'absolute'
		this.cursor.style.zIndex = '10'
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
		if (!this.elements.container) {
			return
		}

		const pictures = Array.from(
			this.elements.container.querySelectorAll('img')
		) as HTMLImageElement[]
		pictures.forEach((picture) => {
			const wrapper = document.createElement('div')
			wrapper.classList.add('beforeafter-item')
			const parentNode = picture.parentNode
			if (!parentNode) {
				return
			}
			parentNode.insertBefore(wrapper, picture)
			wrapper.appendChild(picture)
		})
	}

	applyStyles() {
		if (!this.elements.container || !this.elements.last || this.widthElement === null) {
			return
		}

		const last = this.elements.last
		if (!last) {
			return
		}

		last.style.zIndex = '1'

		const items = Array.from(
			this.elements.container.querySelectorAll('.beforeafter-item')
		) as HTMLElement[]
		items.forEach((item) => {
			const image = item.querySelector('img') as HTMLImageElement | null
			if (!image) {
				return
			}

			image.style.position = 'absolute'
			image.style.width = `${this.widthElement}px`
			item.style.position = 'absolute'

			item.style.overflow = 'hidden'
			item.style.height = '100%'

			if (this.options.orientation === 'horizontal') {
				item.style.top = '0px'
				item.style.width = `${this.widthElement}px`

				last.style.top = '0px'
				last.style.left = 'auto'
				last.style.right = '0'

				image.style.right = '0px'
			} else if (this.options.orientation === 'vertical') {
				item.style.left = '0px'
				item.style.width = '100%'

				last.style.bottom = '0'
				last.style.top = 'auto'

				image.style.bottom = '0px'
			}
		})
	}

	/**
	 * Remove wrapper on each images
	 */
	removeImageWrappers() {
		if (!this.elements.container) {
			return
		}

		const items = Array.from(this.elements.container.querySelectorAll('img')) as HTMLImageElement[]
		items.forEach((item) => {
			const parentNode = item.parentNode as Element | null
			item.removeAttribute('style')
			if (!parentNode || !parentNode.parentNode) {
				return
			}
			parentNode.parentNode.replaceChild(item, parentNode)
		})
	}

	/**
	 * Add event listeners on move and resize
	 */
	addEvents() {
		const container = this.elements.container
		if (!container) {
			return
		}

		this.getUserEventsToTrack().forEach((event) => {
			container.addEventListener(event, this.onMove as EventListener)
		})
		window.addEventListener('resize', this.onResize)
	}

	/**
	 * On move event
	 * @param e Event data
	 */
	onMove(e: MouseEvent | TouchEvent | PointerEvent) {
		this.move(e)
	}

	/**
	 * On resize event
	 */
	onResize() {
		const container = this.elements.container
		if (!container) {
			return
		}

		this.heightElement = parseInt(String(container.offsetHeight), 10)
		this.widthElement = parseInt(String(container.offsetWidth), 10)
		this.applyStyles()
		this.goTo(this.options.start)
	}

	/**
	 * Remove event listeners on move and resize
	 */
	removeEvents() {
		const container = this.elements.container
		if (!container) {
			return
		}

		this.getUserEventsToTrack().forEach((event) => {
			container.removeEventListener(event, this.onMove as EventListener)
		})
		window.removeEventListener('resize', this.onResize)
	}

	/**
	 * Detect which events to track depending on the capabilities of the device
	 * @returns {Array} with the list of events
	 */
	getUserEventsToTrack(): string[] {
		return this.hasTouch
			? this.hasMSPointer
				? ['pointerstart', 'MSPointerMove']
				: ['touchstart', 'touchmove']
			: ['mousemove']
	}

	/**
	 * Move images and cursor on user events
	 * @param e Object from event listener
	 */
	move(e: MouseEvent | TouchEvent | PointerEvent) {
		if (!this.elements.container || this.heightElement === null || this.widthElement === null) {
			return
		}

		e.preventDefault()

		// If user hover during animation, clear timer and stop animate
		if (this.timerGoTo !== null && !this.timerCleaned) {
			clearTimeout(this.timerGoTo)
			if (this.options.cursor) {
				this.updateCursor()
			}
			this.timerCleaned = true
		}

		let valueMoveTransform = ''
		let valueMoveCSS = 0
		let valueMovePicture = 0
		let pageX = 0
		let pageY = 0

		const touchEvent = e as TouchEvent
		const mouseEvent = e as MouseEvent

		pageX = this.hasTouch ? touchEvent.touches[0].pageX : mouseEvent.pageX
		pageY = this.hasTouch ? touchEvent.touches[0].pageY : mouseEvent.pageY
		const elementBoundingClientRect = this.elements.container.getBoundingClientRect()

		if (this.options.orientation === 'horizontal') {
			valueMoveCSS = parseInt(String(pageX - elementBoundingClientRect.x), 10)
			valueMoveTransform = `${valueMoveCSS}px, 0, 0`
			valueMovePicture = this.widthElement - valueMoveCSS
		} else if (this.options.orientation === 'vertical') {
			valueMoveCSS = parseInt(String(pageY - elementBoundingClientRect.y), 10)
			valueMoveTransform = `0, ${valueMoveCSS}px, 0`
			valueMovePicture = this.heightElement - valueMoveCSS
		}

		// If cursor enabled, apply new position
		if (this.options.cursor && this.cursor) {
			this.cursor.style.transform = `translate3d(${valueMoveTransform})`
		}

		// Update new position on image
		if (this.elements.last) {
			this.elements.last.style[this.data[this.options.orientation].widthHeight] =
				`${valueMovePicture}px`
		}

		// Update current position available on instance
		this.position = valueMoveCSS
	}

	/**
	 * Move the animation of the image and cursor to a specific position
	 * @param percentage Percentage of offset
	 */
	goTo(percentage: number) {
		if (
			!this.elements.container ||
			this.heightElement === null ||
			this.widthElement === null ||
			!this.elements.last
		) {
			return
		}

		let valueMoveDependOnElement = 0
		let valueMove = 0
		let valueCursorTransform = ''

		if (this.options.orientation === 'horizontal') {
			valueMoveDependOnElement = this.widthElement - (this.widthElement * percentage) / 100
			valueMove = (this.widthElement * percentage) / 100
		} else if (this.options.orientation === 'vertical') {
			valueMoveDependOnElement = this.heightElement - (this.heightElement * percentage) / 100
			valueMove = (this.heightElement * percentage) / 100
		}

		this.elements.last.style[this.data[this.options.orientation].widthHeight] = `${valueMove}px`

		if (this.options.cursor && this.cursor) {
			if (this.options.orientation === 'horizontal') {
				valueCursorTransform = `${valueMoveDependOnElement}px, 0, 0`
				this.cursor.style[this.data[this.options.orientation].attrToAnimate] = 'auto'
			} else if (this.options.orientation === 'vertical') {
				valueCursorTransform = `0, ${valueMoveDependOnElement}px, 0`
				this.cursor.style[this.data[this.options.orientation].attrToAnimate] = '0'
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
		this.cursor?.remove()
		this.removeEvents()
		this.removeImageWrappers()
		this.timerGoTo = null
		this.timerCleaned = false
	}
}
