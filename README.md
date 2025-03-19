# Soil Carbon Modeling Project

This repository contains scripts and notebooks for processing geospatial data required for soil carbon modeling in carbon projects. The workflow leverages Google Earth Engine (GEE) to extract and analyze climate, soil, vegetation, and land cover data for specific Areas of Interest (AOI).

## 🌟 Features

- **Data Processing**: Automated extraction and processing of geospatial data using Google Earth Engine
- **Multiple Data Sources**: Integration of various datasets including GRIDMET, SoilGrids, MODIS, and more
- **Interactive Analysis**: Jupyter notebooks for data visualization and analysis
- **Comprehensive Documentation**: Detailed guides and workflow documentation

## 📚 Documentation

- [Carbon Project Workflow](docs/carbon_project_workflow.md) - Detailed guide for data processing steps
- [General Documentation](documentation.md) - Overview of the project and available scripts

## 🛠️ Repository Structure

```
📁 soil-carbon-modeling
│── 📜 README.md          # Project overview & setup instructions
│── 📜 documentation.md   # Detailed processing steps
│── 📁 scripts/           # GEE processing scripts
│   └── 📁 gee/          # Google Earth Engine scripts
│       ├── 📜 Land_Soil_NDVI_Export.js
│       ├── 📜 TerraClimate_Monthly_Averages_CSV.js
│       └── 📜 TerraClimate_Monthly_Averages_Resampled.js
│── 📁 notebooks/        # Jupyter notebooks for analysis
│   ├── 📜 Land_Soil_NDVI_Export.ipynb
│   ├── 📜 Land_Soil_NDVI_Export_Alternative.ipynb
│   ├── 📜 TerraClimate_Monthly_Averages_CSV.ipynb
│   └── 📜 TerraClimate_Monthly_Averages_Resampled.ipynb
│── 📁 data_exports/     # Folder for exported GeoTIFFs
│── 📁 charts/           # Folder for value distribution histograms
│── 📁 csv/             # Folder for exported CSV files
│── 📁 docs/            # Detailed documentation
│   └── 📜 carbon_project_workflow.md
│── 📜 .gitignore       # Ignore large files & logs
```

## 📋 Available Scripts and Notebooks

### Google Earth Engine Scripts
- `Land_Soil_NDVI_Export.js`: Export NDVI data for land and soil analysis
- `TerraClimate_Monthly_Averages_CSV.js`: Process TerraClimate data and export as CSV
- `TerraClimate_Monthly_Averages_Resampled.js`: Resample TerraClimate data for specific regions

### Jupyter Notebooks
- `Land_Soil_NDVI_Export.ipynb`: Interactive NDVI data processing and visualization
- `Land_Soil_NDVI_Export_Alternative.ipynb`: Alternative approach for NDVI processing
- `TerraClimate_Monthly_Averages_CSV.ipynb`: TerraClimate data processing and CSV export
- `TerraClimate_Monthly_Averages_Resampled.ipynb`: TerraClimate data resampling and analysis

## 🔧 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/soil-carbon-modeling.git
   cd soil-carbon-modeling
   ```

2. Set up Google Earth Engine:
   - Sign up for a Google Earth Engine account
   - Install the Earth Engine Python API
   - Authenticate your account

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up Jupyter notebooks:
   ```bash
   jupyter notebook
   ```

## 📊 Data Sources

- **Climate Data**: GRIDMET (GEE)
- **Soil Data**: SoilGrids 250m
- **Land Cover**: ESA WorldCover
- **Vegetation**: MODIS (v061)
- **Additional Climate**: TerraClimate

## 📝 Usage

1. Review the [Carbon Project Workflow](docs/carbon_project_workflow.md) for detailed processing steps
2. Choose the appropriate script or notebook for your analysis
3. Follow the setup instructions in the documentation
4. Run the analysis and export results

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 