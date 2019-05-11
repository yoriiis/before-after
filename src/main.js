import BeforeAfter from '../dist/before-after.js';
const beforeAfterItem = new BeforeAfter({
    element: document.querySelector('.beforeafter')
});
beforeAfterItem.create(() => beforeAfterItem.goTo(50));