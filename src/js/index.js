window.addEventListener('DOMContentLoaded', () => {
	console.log('DOM fully loaded and parsed');
	console.log('test - skrypt');
	
	const observer = lozad(); // lazy loads elements with default selector as '.lozad'
	observer.observe();

});