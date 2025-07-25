document.addEventListener("DOMContentLoaded", () => {
  // Initialize map
  const map = L.map("map", {
    center: [34.03119430046332, 72.4117004519285],
    zoom: 10
  });

  // Define basemaps
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
    ),
    topographic: L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "© Esri, HERE, Garmin, FAO, NOAA, USGS, EPA, NPS"
      }
    ),
    natgeo: L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "© National Geographic, Esri, DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp.",
        maxZoom: 20
      }
    ),
    hybrid: {
      imagery: L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "© Esri, Maxar, Earthstar Geographics" }
      ),
      transportation: L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
        { attribution: "© Esri" }
      ),
      labels: L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        { attribution: "© Esri" }
      )
    }
  };

  let currentBaseLayer = basemaps.map;
  let isHybridLabelsOn = true;
  currentBaseLayer.addTo(map);

  const layers = {};
  let lastSelectedLayer = null;
  let lastSelectedFeature = null;
  const hollowStates = { pmc: false, mulkhow: false };
  const labelVisibilityStates = { pmc: false, mulkhow: false };
  const landuseLayers = ['p16', 'm17'];
  const noLabelLayers = ["p9", "p16", "m17"]; // Layers that shouldn't have permanent labels
  
  const symbologyField = {
    p1: "Name", p2: "Name", p3: "Name", p4: "ROW",
    p5: "Label", p6: "Name", p7: "Name", p8: "Name",
    p9: "Name", p10: "Tehsil", p11: "Mauza", p12: "Label",
    p13: "Type", p14: "Name", p15: "Name", p16: "Category",p17: "Category",

    m1: "Name", m2: "Name", m3: "Name", m4: "ROW",
    m5: "Label", m6: "NAME", m7: "Name", m8: "Name",
    m9: "Name", m10: "Name", m11: "Name", m12: "Label",
    m13: "Type", m14: "Type", m15: "Name", m16: "Name",
    m17: "Category", m18: "category", m19: "Type", m20: "Type" , m21: "Category",
  };

  const labelField = {
    p1: "Name", p2: "Name", p3: "Label", p4: "ROW",
    p5: "Label", p6: "Outlet", p7: "Outlet", p8: "Outlet",
    p9: "FFID", p10: "Name", p11: "Khasra_No", p12: "Label",
    p13: "Name", p14: "Name", p15: "Name", p16: "Landuse", p17: "Name",

    m1: "Name", m2: "Name", m3: "Label", m4: "ROW",
    m5: "Label", m6: "Outlet", m7: "Outlet", m8: "Name",
    m9: "Outlet", m10: "Outlet", m11: "Name", m12: "Label",
    m13: "Name", m14: "Name", m15: "Name", m16: "Name",
    m17: "Landuse", m18: "category", m19: "Type", m20: "Name", m21: "Name",
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
    p17: `${baseURL1}sensitive_receptors_p.geojson`,

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
    m21: `${baseURL2}sensitive_receptors_m.geojson`,
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

  const layerImages = {
    p16: {
      src: "https://raw.githubusercontent.com/prfcgis/portal/refs/heads/main/images/chart_p.png",
      link: "PMC.html",
    },
    m17: {
      src: "https://raw.githubusercontent.com/prfcgis/portal/refs/heads/main/images/chart_m.png",
      link: "Mulkhow.html",
    }
  };

  let currentImageControls = {};

  // Custom Leaflet control for hybrid labels and transportation toggle
  const HybridLabelsControl = L.Control.extend({
    options: { position: "topright" },
    onAdd: function (map) {
      const div = L.DomUtil.create("div", "hybrid-labels-control leaflet-control");
      div.innerHTML = `
        <label class="toggle-switch" aria-label="Toggle hybrid basemap labels and features">
          <input type="checkbox" id="hybrid-labels-toggle" checked>
          <span class="slider"></span>
          <span class="toggle-label">Labels</span>
        </label>
      `;
      L.DomEvent.disableClickPropagation(div);
      const toggle = div.querySelector("#hybrid-labels-toggle");
      if (toggle) {
        toggle.checked = isHybridLabelsOn;
        toggle.addEventListener("change", () => {
          isHybridLabelsOn = toggle.checked;
          if (currentBaseLayer === basemaps.hybrid.imagery) {
            if (isHybridLabelsOn) {
              basemaps.hybrid.transportation.addTo(map);
              basemaps.hybrid.labels.addTo(map);
            } else {
              map.removeLayer(basemaps.hybrid.transportation);
              map.removeLayer(basemaps.hybrid.labels);
            }
          }
        });
      }
      return div;
    }
  });

  const hybridLabelsControl = new HybridLabelsControl();

  // Function to update layer style (hollow/fill) - Only for polygons
  function updateLayerStyle(layerKey, hollow = false) {
    if (!layers[layerKey]) return;
    
    const symField = symbologyField[layerKey];
    layers[layerKey].eachLayer(layer => {
      const featureType = layer.feature.geometry.type;
      
      // Only update polygons, leave points and lines unchanged
      if (['Polygon', 'MultiPolygon'].includes(featureType)) {
        layer.setStyle({
          color: getColorByValue(layer.feature.properties[symField]),
          weight: 2,
          fillColor: hollow ? 'transparent' : getColorByValue(layer.feature.properties[symField]),
          fillOpacity: hollow ? 0 : 0.3
        });
      }
    });
  }

  // Enhanced Legend Function with Total row using pre-calculated Area field
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
    const isLanduse = landuseLayers.includes(selectedKey);
    const sampleFeature = layer.getLayers()[0]?.feature;
    const geomType = sampleFeature?.geometry?.type;

    let total = 0; // Initialize total counter

    layer.eachLayer((fl) => {
        const props = fl.feature.properties;
        const value = props[symField];
        const color = getColorByValue(value);

        let metric = 0;
        try {
            if (geomType === "LineString" || geomType === "MultiLineString") {
                const length = turf.length(fl.feature, { units: "kilometers" });
                metric = parseFloat(length.toFixed(2));
            } 
            else if (isLanduse && (geomType === "Polygon" || geomType === "MultiPolygon")) {
                // Use pre-calculated area from "Area" field if available
                if (props.Area) {
                    // Extract numeric value from "201 acres" format
                    const areaMatch = props.Area.match(/(\d+\.?\d*)/);
                    metric = areaMatch ? parseFloat(areaMatch[1]) : 0;
                } else {
                    // Fallback to Turf.js calculation if no Area field
                    const area = turf.area(fl.feature) * 0.000247105; // Convert to acres
                    metric = parseFloat(area.toFixed(2));
                }
            }
            else {
                metric = 1; // For points/polygons (count)
            }
        } catch (e) {
            console.error("Error calculating metric:", e);
            metric = 0;
        }

        total += metric; // Add to total

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

    // Create table header based on layer type
    let fieldName = "Count";
    let valueSuffix = "";
    if (geomType === "LineString" || geomType === "MultiLineString") {
        fieldName = "Length";
        valueSuffix = " km";
    } else if (isLanduse) {
        fieldName = "Area";
        valueSuffix = " acres";
    }

    // Add header row
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
        <th>Class</th>
        <th>${fieldName}</th>
    `;
    legendContent.appendChild(headerRow);

    // Add data rows
    for (let [label, info] of legendMap.entries()) {
        const row = document.createElement("tr");
        
        let displayValue;
        if (valueSuffix) {
            displayValue = `${parseFloat(info.total).toFixed(2)}${valueSuffix}`;
        } else {
            displayValue = Math.round(info.total);
        }

        row.innerHTML = `
            <td><span class="legend-color-box" style="background:${info.color}"></span> ${label}</td>
            <td>${displayValue}</td>
        `;
        legendContent.appendChild(row);
    }

    // Add total row
    const totalRow = document.createElement("tr");
    totalRow.className = "legend-total-row";
    
    let totalDisplay;
    if (valueSuffix) {
        totalDisplay = `${parseFloat(total).toFixed(2)}${valueSuffix}`;
    } else {
        totalDisplay = Math.round(total);
    }

    totalRow.innerHTML = `
        <td><strong>Total</strong></td>
        <td><strong>${totalDisplay}</strong></td>
    `;
    legendContent.appendChild(totalRow);
  }

  // Load and configure all layers
  Object.entries(layerFiles).forEach(([key, url]) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const symField = symbologyField[key];
        const labelAttr = labelField[key];
        const group = key.startsWith('p') ? 'pmc' : 'mulkhow';

        const layer = L.geoJSON(data, {
          style: (feature) => {
            const featureType = feature.geometry.type;
            const isPolygon = ['Polygon', 'MultiPolygon'].includes(featureType);
            const isLine = ['LineString', 'MultiLineString'].includes(featureType);
            
            return {
              color: getColorByValue(feature.properties[symField]),
              weight: 2,
              fillColor: isPolygon ? getColorByValue(feature.properties[symField]) : isLine ? 'transparent' : getColorByValue(feature.properties[symField]),
              fillOpacity: isPolygon ? 0.3 : isLine ? 0 : 0.8
            };
          },
          pointToLayer: (feature, latlng) =>
            L.circleMarker(latlng, {
              radius: 6,
              fillColor: getColorByValue(feature.properties[symField]),
              color: "#000", // Black outline for points
              weight: 2, // Thicker outline
              fillOpacity: 0.8
            }),
          onEachFeature: (feature, featureLayer) => {
          const props = feature.properties;
          const featureType = feature.geometry.type;
          const group = key.startsWith('p') ? 'pmc' : 'mulkhow';
          const labelVisible = labelVisibilityStates[group];

          // 🔷 Popup content
          let content = `
            <div class="popup-header">
              <strong>Feature Information</strong>
              <button class="popup-close-btn" title="Close popup">✖</button>
            </div>
            <div class="popup-body">
              <table class="popup-table">
                <thead><tr><th>Attribute</th><th>Value</th></tr></thead>
                <tbody>
                  ${Object.entries(props).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("")}
                </tbody>
              </table>
            </div>
          `;

          // 🔷 Label logic - Completely separated behaviors
          if (labelAttr && props[labelAttr]) {
            const labelText = props[labelAttr];

            // Permanent label setup (always bound but visibility controlled by toggle)
            if (!noLabelLayers.includes(key)) {
              featureLayer.bindTooltip(labelText, {
                permanent: true,  // Always permanent
                direction: "left",
                className: "label-tooltip"
              });

              // Set initial visibility based on toggle state
              if (labelVisible) {
                featureLayer.openTooltip();
              } else {
                featureLayer.closeTooltip();
                
                // Only setup hover behavior when labels are OFF
                featureLayer.on("mouseover", function() {
                  this.openTooltip();
                });
                
                featureLayer.on("mouseout", function() {
                  this.closeTooltip();
                });
              }
            }
          }

          // 🔷 Click behavior
          featureLayer.on("click", () => {
            // Restore style for last selected
            if (lastSelectedFeature) {
              const lastKey = lastSelectedLayer;
              const lastGroup = lastKey.startsWith('p') ? 'pmc' : 'mulkhow';
              const lastIsHollow = hollowStates[lastGroup];
              const lastFeatureType = lastSelectedFeature.feature.geometry.type;

              if (['Polygon', 'MultiPolygon'].includes(lastFeatureType)) {
                lastSelectedFeature.setStyle({
                  color: getColorByValue(lastSelectedFeature.feature.properties[symbologyField[lastKey]]),
                  weight: 2,
                  fillColor: lastIsHollow ? 'transparent' : getColorByValue(lastSelectedFeature.feature.properties[symbologyField[lastKey]]),
                  fillOpacity: lastIsHollow ? 0 : 0.3
                });
              } else if (['Point', 'MultiPoint'].includes(lastFeatureType)) {
                lastSelectedFeature.setStyle({
                  fillColor: getColorByValue(lastSelectedFeature.feature.properties[symbologyField[lastKey]]),
                  color: "#000",
                  weight: 2,
                  fillOpacity: 0.8,
                  radius: 6
                });
              } else {
                lastSelectedFeature.setStyle({
                  color: getColorByValue(lastSelectedFeature.feature.properties[symbologyField[lastKey]]),
                  weight: 2,
                  fillOpacity: 0
                });
              }
            }

            // Apply highlight style
            const isHollow = hollowStates[group];
            const selectedStyle = {
              color: "blue",
              weight: 4
            };

            if (['Polygon', 'MultiPolygon'].includes(featureType)) {
              selectedStyle.fillColor = isHollow ? "transparent" : "#00FFFF";
              selectedStyle.fillOpacity = isHollow ? 0 : 0.6;
            } else if (['Point', 'MultiPoint'].includes(featureType)) {
              selectedStyle.fillColor = "blue";
              selectedStyle.color = "#000";
              selectedStyle.weight = 2;
              selectedStyle.fillOpacity = 0.8;
              selectedStyle.radius = 8;
            } else {
              selectedStyle.fillOpacity = 0;
            }

            featureLayer.setStyle(selectedStyle);
            featureLayer.bringToFront();
            featureLayer.bindPopup(content, {
              autoPan: true,
              className: "custom-popup",
              offset: L.point(-100, -100) // Adjusts popup to top-right relative to the clicked point
            }).openPopup();

            lastSelectedLayer = key;
            lastSelectedFeature = featureLayer;
          });
        }


        });

        layers[key] = layer;

        const checkbox = document.querySelector(`input[value="${key}"]`);
        if (checkbox) {
          checkbox.addEventListener("change", () => {
            const group = key.startsWith("m") ? "mulkhow" : "pmc";
            const labelToggle = document.querySelector(`.label-toggle-btn[data-group="${group}"]`);
            
            if (checkbox.checked) {
                layer.addTo(map);
                lastSelectedLayer = key;

                // Set default symbology (hollow/fill)
                updateLayerStyle(key, hollowStates[group]);

                // Ensure labels are NOT shown initially
                if (!noLabelLayers.includes(key)) {
                  layer.eachLayer((fl) => {
                    if (fl.getTooltip()) {
                      fl._labelVisible = false;
                      fl.closeTooltip(); // Hide the tooltip if it was opened by Leaflet by default
                    }
                  });
                }

                // Zoom if project boundary is loaded
                if (key === "p1" || key === "m1") {
                  map.fitBounds(layer.getBounds(), { padding: [50, 50] });
                }

                // Add chart image if it's a landuse layer
                if (key === "p16" || key === "m17") {
                  const imageInfo = layerImages[key];
                  const imageControl = L.control({ position: "bottomleft" });
                  imageControl.onAdd = function () {
                    const div = L.DomUtil.create("div", "image-control");
                    div.innerHTML = `
                      <a href="${imageInfo.link}" target="_blank" style="display:block; margin-bottom:5px;">
                        <img src="${imageInfo.src}" style="width:100%;max-width:300px;height:auto;border:2px solid #00008B;" alt="Layer Image">
                      </a>`;
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

  // Initialize Hollow buttons - Only affects polygons
  document.querySelectorAll('.hollow-toggle-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const group = this.dataset.group; // 'pmc' or 'mulkhow'
      hollowStates[group] = !hollowStates[group];
      this.textContent = hollowStates[group] ? 'Fill' : 'Hollow';
      this.dataset.state = hollowStates[group] ? 'hollow' : 'fill';
      
      // Update all visible layers in the group (only polygons will be affected)
      Object.entries(layers).forEach(([key, layer]) => {
        const isGroupMatch = 
          (group === "pmc" && key.startsWith("p")) || 
          (group === "mulkhow" && key.startsWith("m"));
        
        if (isGroupMatch && map.hasLayer(layer)) {
          updateLayerStyle(key, hollowStates[group]);
        }
      });
      
      if (lastSelectedLayer) {
        updateLegend(lastSelectedLayer);
      }
    });
  });

  // Handle popup close button clicks
  document.getElementById('map').addEventListener('click', (e) => {
    if (e.target.classList.contains('popup-close-btn')) {
      map.closePopup();
      e.stopPropagation();
    }
  });

  // Handle map clicks - Only reset selected feature, maintain label states
  map.on("click", (e) => {
    const target = e.originalEvent.target;
    if (
      !target.closest(".leaflet-interactive") &&
      !target.closest(".leaflet-popup") &&
      !target.closest(".leaflet-tooltip") &&
      !target.closest(".leaflet-control")
    ) {
      if (lastSelectedFeature) {
        const layerKey = lastSelectedLayer;
        const group = layerKey.startsWith('p') ? 'pmc' : 'mulkhow';
        const isHollow = hollowStates[group];
        const featureType = lastSelectedFeature.feature.geometry.type;

        const wasLabelVisible = lastSelectedFeature._labelVisible;

        if (['Polygon', 'MultiPolygon'].includes(featureType)) {
          lastSelectedFeature.setStyle({
            color: getColorByValue(lastSelectedFeature.feature.properties[symbologyField[layerKey]]),
            weight: 2,
            fillColor: isHollow ? 'transparent' : getColorByValue(lastSelectedFeature.feature.properties[symbologyField[layerKey]]),
            fillOpacity: isHollow ? 0 : 0.3
          });
        } else if (featureType === 'Point' || featureType === 'MultiPoint') {
          lastSelectedFeature.setStyle({
            fillColor: getColorByValue(lastSelectedFeature.feature.properties[symbologyField[layerKey]]),
            color: "#000",
            weight: 2,
            fillOpacity: 0.8,
            radius: 6
          });
        } else {
          lastSelectedFeature.setStyle({
            color: getColorByValue(lastSelectedFeature.feature.properties[symbologyField[layerKey]]),
            weight: 2,
            fillOpacity: 0
          });
        }

        if (wasLabelVisible && lastSelectedFeature.getTooltip()) {
          lastSelectedFeature.openTooltip();
        }

        lastSelectedFeature = null;
      }

      // ✅ Remove chart image controls when clicking empty space
      ["p16", "m17"].forEach(key => {
        if (currentImageControls[key]) {
          map.removeControl(currentImageControls[key]);
          delete currentImageControls[key];
        }
      });

      map.closePopup();
    }
  });


  
  // Label toggle functionality
  document.querySelectorAll('.label-toggle-btn').forEach(button => {
    button.addEventListener('click', () => {
      const group = button.dataset.group;
      const isOn = button.dataset.state === "on";
      const showLabels = !isOn;

      button.dataset.state = showLabels ? "on" : "off";
      button.textContent = showLabels ? "Hide Labels" : "Labels";
      labelVisibilityStates[group] = showLabels;

      Object.entries(layers).forEach(([key, layer]) => {
        const isGroupMatch =
          (group === "pmc" && key.startsWith("p")) ||
          (group === "mulkhow" && key.startsWith("m"));

        if (isGroupMatch && map.hasLayer(layer) && !noLabelLayers.includes(key)) {
          layer.eachLayer((fl) => {
            if (fl.getTooltip()) {
              if (showLabels) {
                // Remove hover events when turning labels ON
                fl.off("mouseover");
                fl.off("mouseout");
                fl.openTooltip();
              } else {
                fl.closeTooltip();
                // Add hover events when turning labels OFF
                fl.on("mouseover", function() {
                  this.openTooltip();
                });
                fl.on("mouseout", function() {
                  this.closeTooltip();
                });
              }
            }
          });
        }
      });
    });
  });
  // Basemap switcher
  document.querySelectorAll('input[name="basemap"]').forEach((input) => {
    input.addEventListener("change", function () {
      if (currentBaseLayer) {
        map.removeLayer(currentBaseLayer);
        if (currentBaseLayer === basemaps.hybrid.imagery) {
          map.removeLayer(basemaps.hybrid.transportation);
          map.removeLayer(basemaps.hybrid.labels);
          map.removeControl(hybridLabelsControl);
        }
      }
      
      if (this.value === "hybrid") {
        currentBaseLayer = basemaps.hybrid.imagery;
        currentBaseLayer.addTo(map);
        if (isHybridLabelsOn) {
          basemaps.hybrid.transportation.addTo(map);
          basemaps.hybrid.labels.addTo(map);
        }
        map.addControl(hybridLabelsControl);
      } else {
        currentBaseLayer = basemaps[this.value];
        currentBaseLayer.addTo(map);
        map.removeControl(hybridLabelsControl);
      }
    });
  });

  // Tab functionality
  document.querySelectorAll(".tab-header").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = document.getElementById(tab.getAttribute("data-target"));
      const arrow = tab.querySelector(".arrow");

      const isOpen = target.classList.toggle("open");
      if (arrow) arrow.textContent = isOpen ? "🔽" : "▶️";
    });
  });

  // Drawing tools
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

  // Legend close button
  document.getElementById("legend-close").addEventListener("click", () => {
    document.getElementById("legend-popup").classList.add("hidden");
  });

  // Zoom buttons
  document.getElementById("zoom-to-pmc").addEventListener("click", () => {
    map.setView([34.03119430046332, 72.4117004519285], 11);
  });

  document.getElementById("zoom-to-mulkhow").addEventListener("click", () => {
    map.setView([36.28143319384586, 72.20742463946648], 12);
  });

  // Responsive features
  function checkMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function setupSidebarToggle() {
    const sidebarToggle = document.querySelector(".sidebar-toggle-btn");
    const leftPanel = document.querySelector(".left-panel");
    
    sidebarToggle.addEventListener("click", () => {
      leftPanel.classList.toggle("hidden");
      map.invalidateSize();
      sidebarToggle.textContent = leftPanel.classList.contains("hidden") ? "☰ Show Panel" : "✕ Hide Panel";
    });
    
    map.on('click', function() {
      if (checkMobile() && !leftPanel.classList.contains("hidden")) {
        leftPanel.classList.add("hidden");
        sidebarToggle.textContent = "☰ Show Panel";
        map.invalidateSize();
      }
    });
  }

  function initResponsiveFeatures() {
    setupSidebarToggle();
    
    if (checkMobile()) {
      document.querySelectorAll('.tab-header').forEach(header => {
        if (!header.getAttribute('data-target')) return;
        
        const target = document.getElementById(header.getAttribute('data-target'));
        if (target) {
          target.classList.remove('open');
          header.querySelector('.arrow').textContent = "▶️";
        }
      });
    }
    
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        map.invalidateSize();
        if (checkMobile()) {
          document.querySelector('.sidebar-toggle-btn').style.top = 
            `${document.querySelector('.dashboard-header').offsetHeight + 10}px`;
        }
      }, 250);
    });
  }

  // Initialize everything
  window.addEventListener("resize", () => {
    map.invalidateSize();
  });

  map.invalidateSize();
  initResponsiveFeatures();
});