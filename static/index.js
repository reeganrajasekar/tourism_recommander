function initMap() {
    const myLatlng = { lat: 0, lng: 0 };
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: myLatlng,
    });
    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
      content: "Click the map to get Places!",
      position: myLatlng,
    });
  
    infoWindow.open(map);
    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
      // Close the current InfoWindow.
      infoWindow.close();
      // Create a new InfoWindow.
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      data =mapsMouseEvent.latLng.toJSON();
      console.log(data);
      getData(data.lat,data.lng)
      infoWindow.setContent(
        "Click another place to get Places"
      );
      infoWindow.open(map);
    });
  }

  async function getData(lat,lon){
    const url = `https://opentripmap-places-v1.p.rapidapi.com/en/places/radius?radius=10000&lon=${lon.toFixed(6)}&lat=${lat.toFixed(6)}`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '20a90f6031msh04cf71c1d3d383dp1e860djsn371237b4b419',
          'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com'
        }
      };
      try {
        console.log(url);
        await fetch(url, options)
        .then((data=>data.json()))
        .then((data)=>{
          result = data.features;
        })
        text=``
        result.map((i)=>{
          text+=`
            <div class="bg-secondary p-2 rounded border">
              <h5>${i.properties.name}</h5>
              <span class="text-sm">Rating : ${i.properties.rate}</span>
              <br>
              <a target="blank" href="https://www.wikidata.org/wiki/${i.properties.wikidata}">Wikidata</a>
            </div>
          `
        })
        document.getElementById("places").innerHTML=text
      } catch (error) {
        document.getElementById("places").innerHTML="Something went wrong"
      }
  }
  
  window.initMap = initMap;