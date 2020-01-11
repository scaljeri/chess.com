// export function debounce(func, wait = 100, immediate = false) {
// 	var timeout;
// 	return function(...args) {
// 		var context = this;
// 		var later = function() {
// 			timeout = null;
// 			if (!immediate) func.apply(context, args);
// 		};
// 		var callNow = immediate && !timeout;
// 		clearTimeout(timeout);
// 		timeout = setTimeout(later, wait);
// 		if (callNow) func.apply(context, args);
// 	};
// };