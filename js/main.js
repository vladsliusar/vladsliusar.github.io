/* Map of GeoJSON data from CA_Cities_HousingPrices.geojson */

function createMap(){
  var darkscale   = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',

        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NDg1bDA1cjYzM280NHJ5NzlvNDMifQ.d6e-nNyBDtmQCVwVNivz7A'
      }),
      grayscale =   L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',

        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NDg1bDA1cjYzM280NHJ5NzlvNDMifQ.d6e-nNyBDtmQCVwVNivz7A'
      });

  var map = L.map('map', {
      center: [37.3783, -119.4179],
      zoom: 6,
      layers: [darkscale, grayscale]
      });
  var baseMaps = {
      "Darkscale": darkscale,
      "Grayscale": grayscale
      };

  L.control.layers(baseMaps).addTo(map);

    //call getData function
    getData(map);
};


//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 0.0009;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;

};


//Popup constructor function
function Popup(properties, attribute, layer, radius){
    this.properties = properties;
    this.attribute = attribute;
    this.layer = layer;
    this.year = attribute.split("_")[1];
    this.price = this.properties[attribute];
    // .toLocaleString method adds separators for numbers
    this.content = "<p><b>City:</b> " + this.properties.City + "</p><p><b>Median Housing Price in " + this.year + ":</b> " + this.price.toLocaleString() + " US Dollars</p>";

    this.bindToLayer = function(){
        this.layer.bindPopup(this.content, {
            offset: new L.Point(0,-radius)
        });
    };
};


//Function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Step 4: Assign the current attribute based on the first index of the attributes array
    var attribute = attributes[0];
    //check
    console.log(attribute);

    //create marker options
    var options = {
        fillColor: "#ff7800",//#67a1d3
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    var popup = new Popup(feature.properties, attribute, layer, options.radius);
    //add popup to circle marker
    popup.bindToLayer();

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};


// Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
      if (layer.feature && layer.feature.properties[attribute]){
          //access feature properties
          var props = layer.feature.properties;

          //update each feature's radius based on new attribute values
          var radius = calcPropRadius(props[attribute]);
          layer.setRadius(radius);

          var popup = new Popup(props, attribute, layer, radius);
          //add popup to circle marker
          popup.bindToLayer();
      };
   });
};


//Step 1: Create new sequence controls
function createSequenceControls(map, attributes){
    var SequenceControl = L.Control.extend({
          options: {
              position: 'bottomleft'
          },

          onAdd: function (map) {
              // create the control container div with a particular class name
              var container = L.DomUtil.create('div', 'sequence-control-container');

              //create range input element (slider)
              $(container).append('<input class="range-slider" type="range">');

              //add skip buttons
              $(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
              $(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');

              $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
              });

              return container;
          }
      });

    map.addControl(new SequenceControl());

    //set slider attributes
    $('.range-slider').attr({
        max: 8,
        min: 0,
        value: 0,
        step: 1
    });
    // set skip buttons attributes
   $('#reverse').html('<img src="assets/reverse_v2.png">');
   $('#forward').html('<img src="assets/forward_v2.png">');

   //click listener for buttons
   $('.skip').click(function(){
    //get the old index value
    var index = $('.range-slider').val();

    // increment or decrement depending on button clicked
    if ($(this).attr('id') == 'forward'){
        index++;
        // if past the last attribute, wrap around to first attribute
        index = index > 8 ? 0 : index;
    } else if ($(this).attr('id') == 'reverse'){
        index--;
        // if past the first attribute, wrap around to last attribute
        index = index < 0 ? 8 : index;
    };

    // update slider
    $('.range-slider').val(index);
    console.log(attributes)
    // pass new attribute to update symbols
    updatePropSymbols(map, attributes[index]);
    });


    // input listener for slider
     $('.range-slider').on('input', function(){

         //get the new index value
         var index = $(this).val();

     updatePropSymbols(map, attributes[index]);
     });

};


function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');
            $(container).append('<input class="range-slider" type="range">');

            //add formatted attribute to popup content string
            var year = attribute.split("_")[1];
            popupContent += "<p><b>Median Housing Price in " + year + ":</b>" + feature.properties[attribute] + " US Dollars</p>";
            //PUT YOUR SCRIPT TO CREATE THE TEMPORAL LEGEND HERE

            return container;
        }
    });

    map.addControl(new LegendControl());
};


//build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Year") > -1){
            attributes.push(attribute);
        };

    };

    //check result
    //console.log(attributes[0]);

    return attributes;
};



//Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/CA_HousingPrices.geojson", {
        dataType: "json",
        success: function(response){


          var geoJsonLayer = L.geoJson(response)
          var markers = new L.MarkerClusterGroup();
          markers.addLayer(geoJsonLayer);
          map.addLayer(markers);


            //create an attributes array
            var attributes = processData(response);

            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);


        }
    });
};

$(document).ready(createMap);
