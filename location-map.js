(function () {
  "use strict";
  var container = document.getElementById("location-map");
  var shell = document.getElementById("map-shell");
  var coords = [98.388806, 7.884778];

  if (!container || !shell) return;

  function useFallback() {
    shell.classList.remove("is-ready");
  }

  if (!window.maplibregl) {
    useFallback();
    return;
  }

  try {
    var map = new maplibregl.Map({
      container: "location-map",
      style: "https://tiles.openfreemap.org/styles/dark",
      center: coords,
      zoom: 16.2,
      pitch: 0,
      bearing: 0,
      cooperativeGestures: true,
      attributionControl: true
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    var popup = new maplibregl.Popup({ offset: 26, closeButton: false })
      .setHTML("<strong>Blacklist Brewer</strong><br>Coffee stand · Thalang Road");

    var marker = new maplibregl.Marker({ color: "#d29a5b" })
      .setLngLat(coords)
      .setPopup(popup)
      .addTo(map);

    map.on("load", function () {
      shell.classList.add("is-ready");
      marker.togglePopup();
    });

    map.on("error", function (event) {
      var status = event && event.error && event.error.status;
      if (status === 401 || status === 403 || status === 404) useFallback();
    });
  } catch (err) {
    useFallback();
  }
})();
