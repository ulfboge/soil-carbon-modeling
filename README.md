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

## 📁 OneDrive Data Structure

Large data files and generated content are stored in a parallel structure on OneDrive. This includes:

```
📁 Soil Carbon Modeling (OneDrive)
│── 📁 data_exports/     # Exported GeoTIFFs and processed data
│── 📁 charts/           # Generated visualizations and histograms
│── 📁 csv/             # Folder for exported CSV files and data tables
```

To access these files:
1. Visit the [OneDrive folder](https://kayaglobal.sharepoint.com/:f:/s/ClimateOffice/Eohsdwk2Ii1NgBReznqv3IgB-AsNm2qAmfmYkJfKRHoydw?e=SW7hyV)
2. Request access if you don't have it already
3. Download the required data for your analysis
4. Place the files in the corresponding local directories in your repository

Note: The OneDrive structure mirrors the local repository structure for easy synchronization.

## 📋 Available Scripts and Notebooks

### Setup Notebook
- `00_Setup_and_Mount.ipynb`: Initial setup notebook that:
  - Installs required packages
  - Mounts Google Drive
  - Sets up Earth Engine
  - Creates necessary directories
  - Provides common functions and variables

### Google Earth Engine Scripts and Notebooks
Each GEE script has a corresponding Jupyter notebook version for interactive analysis:

1. **Land and Soil NDVI Analysis**
   - GEE Script: `Land_Soil_NDVI_Export.js`
   - Notebook: `Land_Soil_NDVI_Export.ipynb`
   - Alternative Notebook: `Land_Soil_NDVI_Export_Alternative.ipynb`
   - Functionality: Processes and exports multiple geospatial datasets including:
     - Soil Organic Carbon (SOC) stocks (0-30cm)
     - Clay content from OpenLandMap
     - Land cover classification from ESA WorldCover
     - NDVI from MODIS
     - Includes visualization and histogram analysis

2. **TerraClimate Data Processing**
   - GEE Script: `TerraClimate_Monthly_Averages_CSV.js`
   - Notebook: `TerraClimate_Monthly_Averages_CSV.ipynb`
   - Functionality: Processes TerraClimate data (1980-2024) to generate:
     - Monthly mean temperature
     - Monthly mean precipitation
     - Monthly mean potential evapotranspiration (PET)
     - Exports results as CSV with AOI-wide statistics

3. **TerraClimate Data Resampling**
   - GEE Script: `TerraClimate_Monthly_Averages_Resampled.js`
   - Notebook: `TerraClimate_Monthly_Averages_Resampled.ipynb`
   - Functionality: Similar to CSV version but:
     - Resamples data to 1000m resolution
     - Exports as GeoTIFF with monthly bands
     - Includes visualization parameters for temperature, precipitation, and PET

The Jupyter notebooks provide an interactive environment for:
- Modifying parameters and rerunning analysis
- Visualizing results in real-time
- Exploring data distributions
- Customizing export options

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

5. Run the setup notebook first:
   - Open `notebooks/00_Setup_and_Mount.ipynb`
   - Follow the instructions to mount your Google Drive
   - This notebook sets up the environment for all other notebooks

## 📊 Data Sources

- **Climate Data**: 
  - GRIDMET (GEE)
  - TerraClimate (1980-2024)
- **Soil Data**: 
  - SoilGrids 250m (SOC stocks)
  - OpenLandMap (Clay content)
- **Land Cover**: ESA WorldCover v100
- **Vegetation**: MODIS v061 (NDVI)

## 📝 Usage

1. Review the [Carbon Project Workflow](docs/carbon_project_workflow.md) for detailed processing steps
2. Choose the appropriate script or notebook for your analysis
3. Follow the setup instructions in the documentation
4. Run the analysis and export results

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 