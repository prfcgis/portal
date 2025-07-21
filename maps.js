const baseImageURL1 = "https://raw.githubusercontent.com/prfcgis/portal/main/Maps_PMC/";
const baseImageURL2 = "https://raw.githubusercontent.com/prfcgis/portal/main/Maps_Mulkhow/";

const mapsList = [
  { name: "🗺️ Location", file: "Location Map Existing PMC IDs and Command Area Landscape-A3_P.jpg", type: 1 },
  { name: "🗺️ Layout", file: "Layout Map Existing PMC IDs and Command Area1 Landscape-A3_P.jpg", type: 1 },
  { name: "🗺️ Landuse", file: "Landuse Map of Project Area Landscape-A3_P.jpg", type: 1 },
  { name: "🗺️ Topography", file: "Topography Map of Project Area Landscape-A3_P.jpg", type: 1 },
  { name: "🗺️ Villages Location", file: "Villages Location Map of Project Area Landscape-A3_P.jpg", type: 1 },
  { name: "🗺️ Surface Water", file: "Surface Water Map of Project Area Landscape-A3_P.jpg", type: 1 },
  { name: "🗺️ Soil Classification", file: "Soil Classification Map of Project Area Landscape-A3_P.jpg", type: 1 },
  { name: "🗺️ Site Accessibility", file: "Site Accessibility Map of Project Area Landscape-A3_P.jpg", type: 1 },
  { name: "🗺️ Sensitive Receptor", file: "Sensitive Receptor Map of Project Area Landscape-A3_P.jpg", type: 1 },
  { name: "🗺️ Seismic Zoning", file: "Seismic Zoning Map of Project Area Landscape-A3_P.jpg", type: 1 },
  { name: "🗺️ Proposed Construction Camp", file: "Proposed Construction Camp Map of Project Area Landscape-A3_P.jpg", type: 1 },
  { name: "🗺️ Hamlet Alternative Alignment Options", file: "Hamlet Alternative Alignment Options Map of Project Area Landscape-A3_P.jpg", type: 1 },
  { name: "🗺️ Geological Map", file: "Geological Map of Project Area Landscape-A3_1_P.jpg", type: 1 },
  { name: "🗺️ Environmental Monitoring", file: "Environmental Monitoring Map of Project Area Landscape-A3_P.jpg", type: 1 },
  { name: "🗺️ Ecological Survey", file: "Ecological Survey Points and Protected Areas PMC IDs Landscape-A3_P.jpg", type: 1 },
 




  { name: "🗺️ Location", file: "Location Map of Project Area Landscape-A3_M.jpg", type: 2 },
  { name: "🗺️ Layout", file: "Layout Map of Project Area Landscape-A3_M.jpg", type: 2 },
  { name: "🗺️ Chakbandi", file: "Combine_Chakbandi_m_M.jpg", type: 2 },
  { name: "🗺️ Forestation Land (P)", file: "forest_m_M.jpg", type: 2 },
  { name: "🗺️ Grazing Land (P)-1", file: "Grazing_Land_m_M-1.jpg", type: 2 },
  { name: "🗺️ Grazing Land (P)-2", file: "Grazing_Land_m_M-2.jpg", type: 2 },
  { name: "🗺️ Landuse", file: "Landuse Map of Project Area Landscape-A3_M.jpg", type: 2 },
  { name: "🗺️ Topography", file: "Topography Map of Project Area Landscape-A3_M.jpg", type: 2 },
  { name: "🗺️ Villages Location", file: "Villages Location Map of Project Area Landscape-A3_M.jpg", type: 2 },
  { name: "🗺️ Surface Water", file: "Surface Water Map of Project Area Landscape-A3_M.jpg", type: 2 },
  { name: "🗺️ Soil Classification", file: "Soil Classification (FAO) Map of Project Area Landscape-A3_M.jpg", type: 2 },
  { name: "🗺️ Site Accessibility", file: "Site Accessibility Map of Project Area Landscape-A3_M.jpg", type: 2 },
  { name: "🗺️ Sensitive Receptor", file: "Sensitive Receptor Map of Project Area Landscape-A3_M.jpg", type: 2 },
  { name: "🗺️ Seismic Zoning", file: "Seismic Zoning Map of Project Area Landscape-A3_M.jpg", type: 2 },
  { name: "🗺️ Proposed Construction Camp", file: "Proposed Construction Camp Map of Project Area Landscape-A3_M.jpg", type: 2 },
  { name: "🗺️ Alternative Alignment Options", file: "Alternative Alignment Options Map of Project Area Landscape-A3_M.jpg", type: 2 },
  { name: "🗺️ Geological Map", file: "Geological Map of Project Area Landscape-A3_M.jpg", type: 2 },
  { name: "🗺️ Environmental Monitoring", file: "Environmental Monitoring Map of Project Area Landscape-A3_M.jpg", type: 2 },
  { name: "🗺️ Soil Suitability", file: "Soil Suitability Map of the Project Area_M.jpg", type: 2 },
  { name: "🗺️ Material Source And Disposal", file: "Material Source And Disposal Map of The Project Area_M.jpg", type: 2 },
  { name: "🗺️ IDS ROW Sheet-1", file: "IDS_ROW_m_M-1.jpg", type: 2 },
  { name: "🗺️ IDS ROW Sheet-2", file: "IDS_ROW_m_M-2.jpg", type: 2 },
  { name: "🗺️ IDS ROW Sheet-3", file: "IDS_ROW_m_M-3.jpg", type: 2 },
  { name: "🗺️ IDS ROW Sheet-4", file: "IDS_ROW_m_M-4.jpg", type: 2 },
  { name: "🗺️ IDS ROW Sheet-5", file: "IDS_ROW_m_M-5.jpg", type: 2 },
  

];

function getFullImageURL(file, type) {
  return (type === 1 ? baseImageURL1 : baseImageURL2) + file;
}

document.addEventListener("DOMContentLoaded", () => {
  const pmcList = document.getElementById("pmc-maps");
  const mulkhowList = document.getElementById("mulkhow-maps");

  mapsList.forEach((map) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button onclick="showMap('${map.file}', ${map.type})"
        class="glow-hover bg-blue-100 hover:bg-green-300 px-4 py-2 text-start rounded-lg text-sm font-medium w-full">
        ${map.name}
      </button>`;
    (map.type === 1 ? pmcList : mulkhowList).appendChild(li);
  });
});



let currentScale = 1;
let translateX = 0;
let translateY = 0;
const mapImage = document.getElementById("mapImage");
let isDragging = false;
let startX, startY;

mapImage.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
  mapImage.style.cursor = "grabbing";
});
mapImage.addEventListener("mouseup", () => {
  isDragging = false;
  mapImage.style.cursor = "grab";
});
mapImage.addEventListener("mouseleave", () => {
  isDragging = false;
  mapImage.style.cursor = "grab";
});
mapImage.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  translateX = e.clientX - startX;
  translateY = e.clientY - startY;
  mapImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
});
mapImage.addEventListener("wheel", (e) => {
  e.preventDefault();
  const scaleStep = 0.1;
  currentScale = e.deltaY < 0 ? Math.min(currentScale + scaleStep, 3) : Math.max(currentScale - scaleStep, 1);
  mapImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
});

function showMap(file, type = 1) {
  const fullURL = getFullImageURL(file, type);
  const mapImg = document.getElementById("mapImage");
  const defaultText = document.getElementById("defaultText");
  const downloadBtn = document.getElementById("downloadBtn");

  mapImg.src = fullURL;
  mapImg.classList.remove("hidden");
  defaultText.style.display = "none";
  downloadBtn.classList.remove("hidden");

  currentScale = 1;
  translateX = 0;
  translateY = 0;
  mapImg.style.transform = 'translate(0px, 0px) scale(1)';

  downloadBtn.onclick = () => {
    fetch(fullURL)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
  };
}
