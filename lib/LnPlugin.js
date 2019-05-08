mapboxgl.accessToken = 'pk.eyJ1IjoidmxhZDI1IiwiYSI6ImNqNzlkb3k5djAwd3YzMXFwdmFpczVlbWUifQ.iK3myy6M56NRRG_gLiM_pA';
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js');

var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/vlad25/cjgr0gtkr00042smoaxmm2m87',
center: [44.3763, 33.2788],
zoom: 11
});
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
