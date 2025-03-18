# Soil Carbon Modeling Data Preparation

This repository contains tools and documentation for preparing geospatial datasets for soil carbon modeling using Google Earth Engine (GEE). The workflow processes climate, soil, vegetation, and land cover data for defined Areas of Interest (AOI).

## Repository Structure

```
📁 carbon-project-data
│── 📜 README.md          # Overview & setup instructions
│── 📜 gee_script.js      # Google Earth Engine script
│── 📜 documentation.md   # Detailed processing steps
│── 📁 data_exports/      # Folder for exported GeoTIFFs
│── 📁 charts/            # Folder for value distribution histograms
│── 📜 .gitignore         # Ignore large files & logs
│── 📁 notebooks/         # Optional: Jupyter notebooks for analysis
```

## Setup Instructions

1. Clone this repository:
```bash
git clone https://github.com/ulfboge/soil-carbon-modeling.git
cd soil-carbon-modeling
```

2. Ensure you have access to Google Earth Engine:
   - Sign up for a Google Earth Engine account at https://earthengine.google.com/
   - Request access to the required datasets (GRIDMET, SoilGrids, ESA WorldCover, MODIS)

3. Open the GEE script (`gee_script.js`) in the Google Earth Engine Code Editor

4. Follow the processing steps outlined in `documentation.md`

## Data Sources

- Climate Data: GRIDMET
- Soil Data: SoilGrids 250m
- Clay Content: OpenLandMap
- Land Cover: ESA WorldCover
- Vegetation Cover: MODIS v061

## License

This project is licensed under the MIT License - see the LICENSE file for details. 