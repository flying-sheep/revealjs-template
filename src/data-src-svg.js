/** embed SVGs via data-src
 * e.g. <svg data-src="images/test.svg"></svg>.
 * Useful for styling and using class="fragment" in SVG code
 */
export default function loadDataSrcSVG() {
	let svgsToLoad = [ ...document.querySelectorAll('svg[data-src]') ]
	
	let loadSVGs = svgsToLoad.map(svg => fetch(svg.getAttribute('data-src'))
		.then(response => response.text())
		.then(svgCode => {
			let svgDoc = new DOMParser().parseFromString(svgCode, 'image/svg+xml')
			let newSVG = svgDoc.documentElement
			for (let i=0; i<svg.attributes.length; i++) {
				let attr = svg.attributes[i]
				newSVG.setAttribute(attr.name, attr.value)
			}
			svg.parentNode.replaceChild(newSVG, svg)
		}))
	
	Promise.all(loadSVGs).then(val => {
		for (let svg of document.querySelectorAll('svg.stretch:not([preserveAspectRatio])')) {
			if (!svg.hasAttribute('viewBox')) {
				let w = svg.getAttribute('width')
				let h = svg.getAttribute('height')
				svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
			}
			svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
		}
	})
}