// Define your Area of Interest (AOI)
var aoi = ee.FeatureCollection('projects/ee-komba/assets/bbox_wirong').geometry();

// Define the time range
var startDate = '1980-01-01';
var endDate = '2024-12-01';

// Load TerraClimate dataset
var terraclimate = ee.ImageCollection('IDAHO_EPSCOR/TERRACLIMATE')
                    .filterBounds(aoi)
                    .filterDate(startDate, endDate);

// Get projection information
var projection = terraclimate.first().projection();

// Compute Monthly Averages
var months = ee.List.sequence(1, 12);

var monthlyClimate = months.map(function(m) {
  var filtered = terraclimate.filter(ee.Filter.calendarRange(m, m, 'month'));

  // Compute mean temperature (average of max and min)
  var meanTemp = filtered.select('tmmx').mean().multiply(0.1)
                 .add(filtered.select('tmmn').mean().multiply(0.1))
                 .divide(2)
                 .rename('mean_temperature');

  // Compute mean precipitation
  var precipitation = filtered.select('pr').mean().rename('mean_precipitation');

  // Compute mean potential evapotranspiration
  var pet = filtered.select('pet').mean().multiply(0.1).rename('mean_pet');

  // Combine into a single image
  var climateImage = meanTemp.addBands([precipitation, pet]);

  // Reduce to AOI-wide statistics
  var stats = climateImage.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: aoi,
    scale: 1000,  // Resample to 1000m
    bestEffort: true
  });

  // Convert to a feature
  return ee.Feature(null, stats.set('month', m));
});

// Convert the list of features into a FeatureCollection
var climateTable = ee.FeatureCollection(monthlyClimate);

// Export as a CSV
Export.table.toDrive({
  collection: climateTable,
  description: 'MonthlyClimate_AOI_CSV',
  fileFormat: 'CSV'
});

