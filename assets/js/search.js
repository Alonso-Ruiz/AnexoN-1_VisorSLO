(function (window, document) {
    "use strict";

    function getStreetName(feature) {
        var fields = window.VisorConfig.search.nameFields;

        for (var index = 0; index < fields.length; index += 1) {
            var value = feature.get(fields[index]);

            if (value && String(value).trim() !== "") {
                return String(value).trim();
            }
        }

        return "";
    }

    function createStreetLayer(streetSource) {
        return new ol.layer.Vector({
            source: streetSource,
            declutter: true,
            style: function (feature, resolution) {
                var streetName = feature.get("NOMBRECOMP");

                if (resolution > window.VisorConfig.search.visibleResolutionLimit || !streetName || streetName.trim() === "") {
                    return null;
                }

                return new ol.style.Style({
                    text: new ol.style.Text({
                        text: streetName,
                        placement: "line",
                        font: "bold 10px \"Helvetica Neue\", Arial, sans-serif",
                        fill: new ol.style.Fill({ color: "#7f8c8d" }),
                        stroke: new ol.style.Stroke({ color: "#ffffff", width: 3 }),
                        overflow: false
                    }),
                    zIndex: window.VisorConfig.layers.zIndex.streets
                });
            },
            zIndex: window.VisorConfig.layers.zIndex.streets
        });
    }

    function clearResults(searchResults) {
        while (searchResults.firstChild) {
            searchResults.removeChild(searchResults.firstChild);
        }
    }

    function triggerSearch(map, streetSource, highlightOverlay, streetName) {
        var matchedFeatures = streetSource.getFeatures().filter(function (feature) {
            return getStreetName(feature) === streetName;
        });

        if (matchedFeatures.length > 0) {
            var extent = ol.extent.createEmpty();

            matchedFeatures.forEach(function (feature) {
                ol.extent.extend(extent, feature.getGeometry().getExtent());
            });

            map.getView().fit(extent, {
                padding: window.VisorConfig.search.fitPadding,
                duration: window.VisorConfig.search.fitDuration,
                maxZoom: window.VisorConfig.search.maxZoom
            });
        }

        highlightOverlay.getSource().clear();
        matchedFeatures.forEach(function (feature) {
            var clone = feature.clone();

            clone.setStyle(new ol.style.Style({
                stroke: new ol.style.Stroke({ color: "#e74c3c", width: 6 })
            }));
            highlightOverlay.getSource().addFeature(clone);
        });
    }

    function renderMatches(map, streetSource, highlightOverlay, searchInput, searchResults, matches) {
        clearResults(searchResults);

        if (matches.length === 0) {
            searchResults.style.display = "none";
            return;
        }

        matches.forEach(function (name) {
            var item = document.createElement("div");

            item.className = "search-item";
            item.textContent = name;
            item.addEventListener("click", function () {
                searchInput.value = name;
                searchResults.style.display = "none";
                triggerSearch(map, streetSource, highlightOverlay, name);
            });
            searchResults.appendChild(item);
        });

        searchResults.style.display = "block";
    }

    function initStreetSearch(map, highlightOverlay) {
        var searchInput = document.getElementById("street-search");
        var searchResults = document.getElementById("search-results");
        var uniqueStreetsList = [];
        var streetSource = new ol.source.Vector({
            format: new ol.format.GeoJSON({
                dataProjection: "EPSG:4326",
                featureProjection: "EPSG:3857"
            }),
            url: window.VisorConfig.paths.streetsGeojson
        });
        var streetLayer = createStreetLayer(streetSource);

        map.addLayer(streetLayer);

        streetSource.on("change", function (event) {
            if (event.target.getState() !== "ready") {
                return;
            }

            var uniqueStreets = new Set();

            event.target.getFeatures().forEach(function (feature) {
                var streetName = getStreetName(feature);

                if (streetName) {
                    uniqueStreets.add(streetName);
                }
            });
            uniqueStreetsList = Array.from(uniqueStreets).sort();
        });

        if (!searchInput || !searchResults) {
            return streetLayer;
        }

        searchInput.addEventListener("input", function (event) {
            var value = event.target.value.toLowerCase();

            if (!value) {
                clearResults(searchResults);
                searchResults.style.display = "none";
                return;
            }

            renderMatches(
                map,
                streetSource,
                highlightOverlay,
                searchInput,
                searchResults,
                uniqueStreetsList.filter(function (name) {
                    return name.toLowerCase().indexOf(value) !== -1;
                }).slice(0, window.VisorConfig.search.maxResults)
            );
        });

        document.addEventListener("click", function (event) {
            var searchContainer = document.getElementById("search-container");

            if (searchContainer && !searchContainer.contains(event.target)) {
                searchResults.style.display = "none";
            }
        });

        return streetLayer;
    }

    window.VisorSearch = {
        init: initStreetSearch
    };
})(window, document);
