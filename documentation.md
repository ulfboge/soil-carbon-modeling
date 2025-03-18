# **Soil Carbon Modeling Data Preparation Using Google Earth Engine**  

## **1. Introduction**  
This repository documents the process of retrieving and processing geospatial datasets for **soil carbon modeling** in a carbon project. The workflow utilizes **Google Earth Engine (GEE)** to extract climate, soil, vegetation, and land cover data for a defined **Area of Interest (AOI)**.  

## **2. Data Sources & Processing Steps**  

| **Dataset**         | **Source**                     | **Bands Used**         | **Processing Steps**                                | **Final Units**   |
|--------------------|--------------------------------|-----------------------|--------------------------------------------------|------------------|
| **Climate**        | GRIDMET (GEE)                  | `tmmx`, `tmmn`, `pr`, `etr` | Convert temperature to °C and precipitation to mm  | °C, mm           |
| **SOC Stocks**     | SoilGrids 250m                 | `ocs_0-30cm_mean`     | Direct selection, clipped to AOI                 | t C ha⁻¹         |
| **Clay Content**   | OpenLandMap                    | `b0`, `b10`, `b30`    | Averaged (0-30cm), clipped to AOI                | %                |
| **Land Cover**     | ESA WorldCover                 | `Map`                 | Reclassified into 3 categories (Forestry, Grassland, Agriculture) | Categorical      |
| **Vegetation Cover** | MODIS v061 (`MOD13A1`)       | `NDVI`                | Median value, scale correction (0.0001)          | NDVI (0-1)       |

## **3. GEE Processing Steps**  

### **3.1 Define AOI**  
The AOI is loaded from an Earth Engine Asset.  
```javascript
var aoi = ee.FeatureCollection('projects/ee-komba/assets/bbox_wirong').geometry();
```

### **3.2 Retrieve Climate Data**  
- **Source:** GRIDMET  
- **Processing:** Convert temperature from **Kelvin to Celsius**  
```javascript
var climate = ee.ImageCollection("IDAHO_EPSCOR/GRIDMET")
  .filterBounds(aoi)
  .filterDate("1980-01-01", ee.Date(Date.now()))
  .select(["tmmx", "tmmn", "pr", "etr"])
  .mean()
  .clip(aoi);
```

### **3.3 Retrieve Soil Data**  
- **SOC Stocks (0-30cm depth, t C ha⁻¹)**  
  - **Dataset:** SoilGrids (`ocs_mean`)  
  - **Processing:** Direct selection, no unit conversion needed  
```javascript
var soc = ee.Image("projects/soilgrids-isric/ocs_mean")
  .select("ocs_0-30cm_mean")
  .rename("SOC_tCha")
  .clip(aoi)
  .updateMask(soc.mask());
```

- **Clay Content (0-30cm, % mass fraction)**  
```javascript
var clay = ee.Image("OpenLandMap/SOL/SOL_TEXTURE-CLASS_USDA-TT_M/v02")
  .select(["b0", "b10", "b30"])
  .reduce(ee.Reducer.mean())
  .rename("Clay_Percent")
  .clip(aoi)
  .updateMask(clay.mask());
```

### **3.4 Land Cover Classification**  
- **Dataset:** ESA WorldCover  
- **Reclassified for RothC Model**  
```javascript
var landcover = ee.ImageCollection("ESA/WorldCover/v100")
  .filterBounds(aoi)
  .sort("system:time_start", false)
  .first()
  .clip(aoi);

var landcover_reclassified = landcover.remap(
  [10, 20, 30, 40], // Original classes
  [1, 2, 2, 3],     // Reclassified: 1=Forestry, 2=Grassland, 3=Agriculture
  0                 // Default (everything else excluded)
).rename("Land_Cover_Class");
```

### **3.5 Vegetation Cover (NDVI)**  
- **Dataset:** MODIS v061 (`MOD13A1`)  
- **Processing:** Median value, scale correction applied (0.0001)  
```javascript
var ndvi = ee.ImageCollection("MODIS/061/MOD13A1")
  .filterBounds(aoi)
  .filterDate("2000-01-01", ee.Date(Date.now()))
  .select("NDVI")
  .median()
  .multiply(0.0001) // Convert to proper scale
  .rename("NDVI")
  .clip(aoi);
```

## **4. Data Visualization & Export**  

### **4.1 Value Distribution Histograms**  
```javascript
print(ui.Chart.image.histogram({image: soc, region: aoi, scale: 1000}).setOptions({title: "SOC Distribution"}));
print(ui.Chart.image.histogram({image: clay, region: aoi, scale: 1000}).setOptions({title: "Clay Content"}));
print(ui.Chart.image.histogram({image: ndvi, region: aoi, scale: 1000}).setOptions({title: "NDVI Distribution"}));
```

### **4.2 Export Data to Google Drive**  
```javascript
Export.image.toDrive({ image: soc, description: "SOC_Stocks", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });
Export.image.toDrive({ image: clay, description: "Clay_Content", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });
Export.image.toDrive({ image: landcover_reclassified, description: "Land_Cover_Reclassified", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });
Export.image.toDrive({ image: ndvi, description: "Monthly_NDVI", scale: 1000, region: aoi, fileFormat: "GeoTIFF" });
``` 