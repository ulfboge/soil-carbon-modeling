// Define your Area of Interest (AOI)
var aoi = ee.FeatureCollection('projects/ee-komba/assets/bbox_wirong').geometry();

// 1. Climate Data (CRU TS Monthly Averages)
var climate = ee.ImageCollection("IDAHO_EPSCOR/GRIDMET")
  .filterBounds(aoi)
  .filterDate("1980-01-01", ee.Date(Date.now()))
  .select(["tmmx", "tmmn", "pr", "etr"])
  .mean()
  .clip(aoi);

// Convert temperature from Kelvin to Celsius
var tmmx = climate.select("tmmx").subtract(273.15).rename("Max_Temp_C");
var tmmn = climate.select("tmmn").subtract(273.15).rename("Min_Temp_C");
var pr = climate.select("pr").rename("Precipitation_mm");
var etr = climate.select("etr").rename("Evapotranspiration_mm");

// 2. Soil Datasets (Properly Masked)
// Load SOC stocks (0-30cm, already in t C ha⁻¹)
var soc = ee.Image("projects/soilgrids-isric/ocs_mean")
  .select("ocs_0-30cm_mean") // Correct band name
  .rename("SOC_tCha")
  .clip(aoi)
  .updateMask(ee.Image("projects/soilgrids-isric/ocs_mean").select(0).mask());

var clay_raw = ee.Image("OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02"); // Load raw Clay dataset

var clay = clay_raw
  .select(["b0", "b10", "b30"])
  .reduce(ee.Reducer.mean())
  .rename("Clay_Percent")
  .clip(aoi)
  .updateMask(clay_raw.select(0).mask()); // Use the first band as a valid mask



// 3. Land Cover (ESA WorldCover, latest available)
var landcover = ee.ImageCollection("ESA/WorldCover/v100")
  .filterBounds(aoi)
  .sort("system:time_start", false)
  .first()
  .clip(aoi);

// Reclassify land cover for RothC
var landcover_reclassified = landcover.remap(
  [10, 20, 30, 40], // Original classes
  [1, 2, 2, 3],     // Reclassified: 1=Forestry, 2=Grassland, 3=Agriculture
  0                 // Default (everything else excluded)
).rename("Land_Cover_Class");

// 4. Monthly Vegetation Cover (NDVI from MODIS v061) - Using Median
var ndvi = ee.ImageCollection("MODIS/061/MOD13A1")
  .filterBounds(aoi)
  .filterDate("2000-01-01", ee.Date(Date.now()))
  .select("NDVI")
  .median()
  .multiply(0.0001) // Scale factor correction
  .rename("NDVI")
  .clip(aoi);

// Visualization
Map.centerObject(aoi, 6);
Map.addLayer(soc, {min: 0, max: 200, palette: ["blue", "green", "yellow", "red"]}, "SOC (t C ha⁻¹)");
Map.addLayer(clay, {min: 0, max: 100, palette: ["yellow", "brown", "red"]}, "Clay Content (%)");
Map.addLayer(landcover_reclassified, {min: 1, max: 3, palette: ["green", "yellow", "brown"]}, "Reclassified Land Cover");
Map.addLayer(ndvi, {min: 0, max: 1, palette: ["red", "yellow", "green"]}, "NDVI");

// Export data to Google Drive with 1 km spatial resolution
Export.image.toDrive({ image: soc, description: "SOC_Stocks", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });
Export.image.toDrive({ image: clay, description: "Clay_Content", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });
Export.image.toDrive({ image: landcover_reclassified, description: "Land_Cover_Reclassified", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });
Export.image.toDrive({ image: ndvi, description: "Monthly_NDVI", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });

// Export climate data separately
Export.image.toDrive({ image: tmmx, description: "Max_Temperature", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });
Export.image.toDrive({ image: tmmn, description: "Min_Temperature", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });
Export.image.toDrive({ image: pr, description: "Precipitation", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });
Export.image.toDrive({ image: etr, description: "Evapotranspiration", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });

// Create histograms of value distributions
var chartSOC = ui.Chart.image.histogram({
  image: soc, region: aoi, scale: 1000, maxPixels: 1e6
}).setOptions({title: 'SOC Distribution (t C ha⁻¹)', hAxis: {title: 'SOC'}, vAxis: {title: 'Frequency'}, colors: ['blue']});

var chartClay = ui.Chart.image.histogram({
  image: clay, region: aoi, scale: 1000, maxPixels: 1e6
}).setOptions({title: 'Clay Content Distribution (%)', hAxis: {title: 'Clay %'}, vAxis: {title: 'Frequency'}, colors: ['brown']});

var chartNDVI = ui.Chart.image.histogram({
  image: ndvi, region: aoi, scale: 1000, maxPixels: 1e6
}).setOptions({title: 'NDVI Distribution', hAxis: {title: 'NDVI'}, vAxis: {title: 'Frequency'}, colors: ['green']});

// Print charts
print(chartSOC);
print(chartClay);
print(chartNDVI);

// Define land cover category names
var landcover_names = {
  1: "Forestry",
  2: "Grassland/Shrubland/Savanna",
  3: "Agriculture"
};

// Function to map land cover values to names
var landcover_named = landcover_reclassified.remap(
  [1, 2, 3], // Original values
  [0, 1, 2], // Convert to unique indices for display
  "Unknown"  // Default for missing values
);

// Add land cover legend as a chart
var chartLandCover = ui.Chart.image.histogram({
  image: landcover_reclassified, region: aoi, scale: 1000, maxPixels: 1e6
}).setOptions({
  title: 'Land Cover Distribution',
  hAxis: {title: 'Land Cover Category', ticks: [{v: 1, f: 'Forestry'}, {v: 2, f: 'Grassland'}, {v: 3, f: 'Agriculture'}]},
  vAxis: {title: 'Frequency'},
  colors: ['green', 'yellow', 'brown']
});

// Print land cover chart
print(chartLandCover);

