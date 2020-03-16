
mapboxgl.accessToken = 'pk.eyJ1Ijoic3VtaXRic3AiLCJhIjoiY2s3b3Y1ZzduMDFkbTNlc3ZjYXB2MzZoMSJ9.VAuWUn6KBYNQjCqZATTf6Q';
        
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: post.coordinates,
  zoom: 3.5
});


// create a HTML element for location
var el = document.createElement('div');
el.className = 'marker';

// make a marker for location and add to the map
new mapboxgl.Marker(el)
.setLngLat(post.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
.setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
.addTo(map);