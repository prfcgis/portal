document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map", {
    center: [34.03119430046332, 72.4117004519285],
    zoom: 10
  });

  const basemaps = {
    map: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }),
    satellite: L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "© Esri, Maxar, Earthstar Geographics" }
    ),
    hillshade: L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        attribution: "Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)",
        maxZoom: 20
      }
    )
  };

  let currentBaseLayer = basemaps.map;
  currentBaseLayer.addTo(map);

  const layers = {};
  const symbologyField = {
    p1: "Name", p2: "Name", p3: "Name", p4: "ROW",
    p5: "Label", p6: "Name", p7: "Name", p8: "Name",
    p9: "Name", p10: "Tehsil", p11: "Mauza", p12: "Label",
    p13: "Type", p14: "Name", p15: "Name", p16: "Category",
    m1: "Name", m2: "Name", m3: "Name", m4: "ROW",
    m5: "Label", m6: "Name", m7: "Name", m8: "Name",
    m9: "Name", m10: "Name", m11: "Name", m12: "Label",
    m13: "Type", m14: "Type", m15: "Name", m16: "Name",
    m17: "Category", m18: "category", m19: "Type", m20: "Type"
  };

  const labelField = {
    p1: "Name", p2: "Name", p3: "Label", p4: "ROW",
    p5: "Label", p6: "Outlet", p7: "Outlet", p8: "Outlet",
    p9: "Outlet", p10: "Name", p11: "Khasra_No", p12: "Label",
    p13: "Name", p14: "Name", p15: "Name", p16: "Landuse",
    m1: "Name", m2: "Name", m3: "Label", m4: "ROW",
    m5: "Label", m6: "Outlet", m7: "Outlet", m8: "Name",
    m9: "Outlet", m10: "Outlet", m11: "Name", m12: "Label",
    m13: "Name", m14: "Name", m15: "Name", m16: "Name",
    m17: "Landuse", m18: "category", m19: "Type", m20: "Name"
  };

  const baseURL1 = "https://raw.githubusercontent.com/prfcgis/portal/refs/heads/main/SHP_PMC/";
  const baseURL2 = "https://raw.githubusercontent.com/prfcgis/portal/refs/heads/main/SHP_Mulkhow/";

  const layerFiles = {
    p1: `${baseURL1}Project_Boundary_P.geojson`,
    p2: `${baseURL1}IDS_P.geojson`,
    p3: `${baseURL1}RD_P.geojson`,
    p4: `${baseURL1}ROW_P.geojson`,
    p5: `${baseURL1}Dimensions_P.geojson`,
    p6: `${baseURL1}Outlets_P.geojson`,
    p7: `${baseURL1}Watercourse_P.geojson`,
    p8: `${baseURL1}Chacks_P.geojson`,
    p9: `${baseURL1}Farmer_Record_P.geojson`,
    p10: `${baseURL1}Mauzas_P.geojson`,
    p11: `${baseURL1}Khasra_M.geojson`,
    p12: `${baseURL1}Construction_camp_P.geojson`,
    p13: `${baseURL1}Sampling_Monitoring_P.geojson`,
    p14: `${baseURL1}Drain_P.geojson`,
    p15: `${baseURL1}Villages_P.geojson`,
    p16: `${baseURL1}Landuse_P.geojson`,
    m1: `${baseURL2}Project_boundary_M.geojson`,
    m2: `${baseURL2}IDS_M.geojson`,
    m3: `${baseURL2}RD_M.geojson`,
    m4: `${baseURL2}ROW_M.geojson`,
    m5: `${baseURL2}Dimensions_M.geojson`,
    m6: `${baseURL2}Outlet_M.geojson`,
    m7: `${baseURL2}Chaks_M.geojson`,
    m8: `${baseURL2}Qaqlasht_chack_M.geojson`,
    m9: `${baseURL2}Splitted_Chaks_M.geojson`,
    m10: `${baseURL2}Mountain_M.geojson`,
    m11: `${baseURL2}Dump_M.geojson`,
    m12: `${baseURL2}Camp_M.geojson`,
    m13: `${baseURL2}Sampling_Monit_M.geojson`,
    m14: `${baseURL2}Soil_Sample_M.geojson`,
    m15: `${baseURL2}FCC_M.geojson`,
    m16: `${baseURL2}Villages_M.geojson`,
    m17: `${baseURL2}Landuse_M.geojson`,
    m18: `${baseURL2}Roads_m.geojson`,
    m19: `${baseURL2}forest_M.geojson`,
    m20: `${baseURL2}grazing_land_M.geojson`,
  };

  const colorPalette = [
    "#fb0703ff", "#1e3a8a", "#047857", "#b9a11cff", "#92400e",
    "#0f172a", "#7c3aed", "#db2777", "#059669", "#f59e0b",
    "#3b82f6", "#8b5cf6", "#e11d48", "#14b8a6", "#84cc16",
    "#d97706", "#6b21a8", "#7f1d1d"
  ];

  let colorMap = {};
  const getColorByValue = (value) => {
    if (!colorMap[value]) {
      colorMap[value] = colorPalette[Object.keys(colorMap).length % colorPalette.length];
    }
    return colorMap[value];
  };

  // Image configurations for p16 and m17
  const layerImages = {
    p16: {
      src: "https://raw.githubusercontent.com/prfcgis/portal/refs/heads/main/images/chart_p.png", // Replace with actual image URL
      link: "PMC.html", // Replace with actual link
    },
    m17: {
      src: "https://raw.githubusercontent.com/prfcgis/portal/refs/heads/main/images/chart_m.png", // Replace with actual image URL
      link: "Mulkhow.html", // Replace with actual link
    }
  };


  let currentImageControls = {};

  Object.entries(layerFiles).forEach(([key, url]) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const symField = symbologyField[key];
        const labelAttr = labelField[key];

        const layer = L.geoJSON(data, {
          style: (feature) => ({
            color: getColorByValue(feature.properties[symField]),
            weight: 2,
            fillOpacity: 0.3
          }),
          pointToLayer: (feature, latlng) =>
            L.circleMarker(latlng, {
              radius: 6,
              fillColor: getColorByValue(feature.properties[symField]),
              color: "#000",
              weight: 1,
              fillOpacity: 0.8
            }),
          onEachFeature: (feature, featureLayer) => {
            const props = feature.properties;
            let content = `
              <div class="popup-header">
                <strong>Feature Information</strong>
                <button class="popup-close-btn" onclick="closeLeafletPopup()">✖</button>
              </div>
              <div class="popup-body">
                <table class="popup-table">
                  <thead><tr><th>Attribute</th><th>Value</th></tr></thead>
                  <tbody>
                    ${Object.entries(props).map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`).join("")}
                  </tbody>
                </table>
              </div>
            `;

            if (labelAttr && props[labelAttr]) {
              featureLayer.bindTooltip(props[labelAttr], {
                permanent: false,
                direction: "center",
                className: "label-tooltip"
              });
            }

            featureLayer.on("click", () => {
              // Reset all layers to default style
              Object.values(layers).forEach(l => {
                if (map.hasLayer(l)) {
                  l.eachLayer(fl => {
                    l.resetStyle(fl);
                  });
                }
              });

              const isCircleMarker = featureLayer instanceof L.CircleMarker;

              featureLayer.setStyle(isCircleMarker ? {
                fillColor: "blue",
                color: "#000",
                weight: 2,
                fillOpacity: 0.8,
                radius: 8
              } : {
                color: "blue",
                weight: 4,
                fillOpacity: 0.6
              });

              featureLayer.bringToFront();
              featureLayer.bindPopup(content, { autoPan: false, className: "custom-popup" }).openPopup();
            });
          }
        });

        layers[key] = layer;

        const checkbox = document.querySelector(`input[value="${key}"]`);
        if (checkbox) {
          checkbox.addEventListener("change", () => {
            const group = key.startsWith("m") ? "mulkhow" : "pmc";
            const labelToggle = document.querySelector(`.label-toggle[data-group="${group}"]`);

            if (checkbox.checked) {
              layer.addTo(map);

              if (labelToggle && labelToggle.checked) {
                layer.eachLayer((fl) => {
                  const tooltip = fl.getTooltip();
                  if (tooltip) fl.openTooltip();
                });
              }

              if (key === "p1" || key === "m1") {
                map.fitBounds(layer.getBounds(), { padding: [50, 50] });
              }

              // Show image for p16 or m17 when layer is checked
              if (key === "p16" || key === "m17") {
                const imageInfo = layerImages[key];
                const imageControl = L.control({ position: "bottomleft" });
                imageControl.onAdd = function () {
                  const div = L.DomUtil.create("div", "image-control");
                  div.innerHTML = `<a href="${imageInfo.link}" target="_blank"><img src="${imageInfo.src}" style="width:350px;height:200px;border:2px solid #000;" alt="Layer Image"></a>`;
                  return div;
                };
                imageControl.addTo(map);
                currentImageControls[key] = imageControl;
              }

              updateLegend(key);
            } else {
              map.removeLayer(layer);
              if (currentImageControls[key]) {
                map.removeControl(currentImageControls[key]);
                delete currentImageControls[key];
              }
              updateLegend(null);
            }
          });

          if (checkbox.checked) {
            layer.addTo(map);
          }
        }
      });
  });

  // Clear selection and images when clicking on empty map
  map.on("click", (e) => {
    if (!e.originalEvent.target.closest(".leaflet-interactive")) {
      Object.values(layers).forEach(l => {
        if (map.hasLayer(l)) {
          l.eachLayer(fl => {
            l.resetStyle(fl);
          });
        }
      });
      closeLeafletPopup();
      Object.keys(currentImageControls).forEach(key => {
        map.removeControl(currentImageControls[key]);
      });
      currentImageControls = {};
    }
  });

  // Handle label toggles
  document.querySelectorAll('.label-toggle-btn').forEach(button => {
    button.addEventListener('click', () => {
      const group = button.dataset.group;
      const isOn = button.dataset.state === "on";
      const newState = isOn ? "off" : "on";
      const showLabels = !isOn;

      button.dataset.state = newState;
      button.textContent = showLabels ? "Hide Labels" : "Labels";

      Object.entries(layers).forEach(([key, layer]) => {
        const isGroupMatch =
          (group === "pmc" && key.startsWith("p")) ||
          (group === "mulkhow" && key.startsWith("m"));

        if (isGroupMatch && map.hasLayer(layer)) {
          layer.eachLayer((fl) => {
            const tooltip = fl.getTooltip();
            if (tooltip) {
              showLabels ? fl.openTooltip() : fl.closeTooltip();
            }
          });
        }
      });
    });
  });

  // Handle basemap switching
  document.querySelectorAll('input[name="basemap"]').forEach((input) => {
    input.addEventListener("change", function () {
      if (currentBaseLayer) map.removeLayer(currentBaseLayer);
      currentBaseLayer = basemaps[this.value];
      currentBaseLayer.addTo(map);
    });
  });

  // Expand/collapse tab panels
  document.querySelectorAll(".tab-header").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = document.getElementById(tab.getAttribute("data-target"));
      const arrow = tab.querySelector(".arrow");

      const isOpen = target.classList.toggle("open");
      if (arrow) arrow.textContent = isOpen ? "🔽" : "▶️";
    });
  });

  // Leaflet Draw tools
  const drawnItems = new L.FeatureGroup().addTo(map);
  const drawControl = new L.Control.Draw({
    position: "topleft",
    draw: {
      polygon: true,
      polyline: true,
      rectangle: true,
      circle: true,
      marker: true
    },
    edit: {
      featureGroup: drawnItems,
      remove: true
    }
  });

  map.addControl(drawControl);

  map.on(L.Draw.Event.CREATED, (event) => {
    drawnItems.addLayer(event.layer);
  });

  function updateLegend(selectedKey = null) {
    const legendContent = document.getElementById("legend-content");
    const legendPopup = document.getElementById("legend-popup");

    legendContent.innerHTML = "";

    if (!selectedKey || !layers[selectedKey] || !map.hasLayer(layers[selectedKey])) {
      legendPopup.classList.add("hidden");
      return;
    }

    const symField = symbologyField[selectedKey];
    const layer = layers[selectedKey];
    const legendMap = new Map();

    layer.eachLayer((fl) => {
      const props = fl.feature.properties;
      const value = props[symField];
      const color = getColorByValue(value);

      let metric = 0;
      const geomType = fl.feature.geometry.type;

      try {
        if (geomType === "LineString" || geomType === "MultiLineString") {
          const length = turf.length(fl.feature, { units: "kilometers" });
          metric = parseFloat(length.toFixed(2));
        } else {
          metric = 1;
        }
      } catch (e) {
        metric = 0;
      }

      if (!legendMap.has(value)) {
        legendMap.set(value, { color: color, total: metric });
      } else {
        legendMap.get(value).total += metric;
      }
    });

    if (legendMap.size === 0) {
      legendPopup.classList.add("hidden");
      return;
    }

    legendPopup.classList.remove("hidden");

    for (let [label, info] of legendMap.entries()) {
      const row = document.createElement("tr");
      const displayValue = Number.isInteger(info.total) ? info.total : `${info.total} km`;
      row.innerHTML = `
        <td><span class="legend-color-box" style="background:${info.color}"></span> ${label}</td>
        <td>${displayValue}</td>
      `;
      legendContent.appendChild(row);
    }
  }

  document.getElementById("legend-close").addEventListener("click", () => {
    document.getElementById("legend-popup").classList.add("hidden");
  });

  document.getElementById("zoom-to-pmc").addEventListener("click", () => {
    map.setView([34.03119430046332, 72.4117004519285], 11);
  });

  document.getElementById("zoom-to-mulkhow").addEventListener("click", () => {
    map.setView([36.28143319384586, 72.20742463946648], 12);
  });

  window.closeLeafletPopup = function () {
    const popups = document.querySelectorAll(".leaflet-popup");
    popups.forEach(p => p.remove());
  };
});