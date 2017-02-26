     var map = L.map('map', {
         center: [50.0064, 36.2351],
         zoom: 16
     })

     var hash = new L.Hash(map);

     var layerOSM = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
     });

     var layerMapSurfer = new L.tileLayer("http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}", {
         attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
     });

     var layerMapboxImagery = new L.tileLayer('http://{s}.tiles.mapbox.com/v4/openstreetmap.map-inh7ifmo/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJhNVlHd29ZIn0.ti6wATGDWOmCnCYen-Ip7Q', {
         maxNativeZoom: 17,
         maxZoom: 18,
         attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
     });

     var BingLayer = L.TileLayer.extend({
         getTileUrl: function (tilePoint) {
             this._adjustTilePoint(tilePoint);
             return L.Util.template(this._url, {
                 s: this._getSubdomain(tilePoint),
                 q: this._quadKey(tilePoint.x, tilePoint.y, this._getZoomForUrl())
             });
         },
         _quadKey: function (x, y, z) {
             var quadKey = [];
             for (var i = z; i > 0; i--) {
                 var digit = '0';
                 var mask = 1 << (i - 1);
                 if ((x & mask) != 0) {
                     digit++;
                 }
                 if ((y & mask) != 0) {
                     digit++;
                     digit++;
                 }
                 quadKey.push(digit);
             }
             return quadKey.join('');
         }
     });

     var layerBingAerial = new BingLayer('http://t{s}.tiles.virtualearth.net/tiles/a{q}.jpeg?g=2732', {
         subdomains: ['0', '1', '2', '3', '4'],
         attribution: '&copy; <a href="http://bing.com/maps">Bing Maps</a>'
     });


     var layerUAOrtho = new L.tileLayer('http://map.land.gov.ua/map/ortho10k_all/{z}/{x}/{y}.jpg', {
         tms: true,
         maxNativeZoom: 16,
         maxZoom: 18,
         attribution: 'Image tiles: &copy <a href="https://land.gov.ua/">StateGeoCadastre of Ukraine</a>'
     });

     var layerUAOrthoKiev = new L.tileLayer('http://map.land.gov.ua/map/ortho_kiev/{z}/{x}/{y}.jpg', {
         tms: true,
         maxNativeZoom: 16,
         maxZoom: 18,
         attribution: 'Image tiles: &copy <a href="https://land.gov.ua/">StateGeoCadastre of Ukraine</a>'
     });

     var layerUATopo = new L.tileLayer('http://map.land.gov.ua/map/topo100k_all/{z}/{x}/{y}.jpg', {
         tms: true,
         maxNativeZoom: 14,
         maxZoom: 18,
         attribution: 'Image tiles: &copy <a href="https://land.gov.ua/">StateGeoCadastre of Ukraine</a>'
     });


     var layerUACadastre = new L.TileLayer.WMS('http://map.land.gov.ua/geowebcache/service/wms?', {
         layers: 'kadastr',
         format: 'image/png',
         transparent: true,
         maxNativeZoom: 16,
         maxZoom: 18,
         attribution: 'Image tiles: &copy <a href="https://land.gov.ua/">StateGeoCadastre of Ukraine</a>'
     });



     var baseLayers = {
         "OpenStreetMap": layerOSM,
         "MapSurfer": layerMapSurfer,
         "Mapbox Imagery": layerMapboxImagery,
         "Bing Aerial": layerBingAerial,
         "Orthophoto": layerUAOrtho,
         "Orthophoto Kiev": layerUAOrthoKiev,
         "Topo 1:100000": layerUATopo
     };

     var overlayLayers = {
         "Ukraine cadastre": layerUACadastre
     };


     L.control.layers(baseLayers, overlayLayers, {
         collapsed: false
     }).addTo(map);


     layerMapSurfer.addTo(map);
     layerUACadastre.addTo(map);


     /*
          map.on('click', function (e) {
              var popup = false;
              var latlng900913 = L.CRS.EPSG900913.project(e.latlng)

              var activeLayers = ["kadastr"]

              var dataObj = {
                  x: latlng900913.y,
                  y: latlng900913.x,
                  zoom: map.getZoom(),
                  actLayers: activeLayers
              }

              console.log(dataObj)

              $.ajax({
                  url: 'http://map.land.gov.ua/kadastrova-karta/getobjectinfo',
                  type: 'POST',
                  dataType: "json",
                  data: dataObj,
                  success: function (data) {


                      if (popup) {
                          popup.destroy();
                          popup = false;
                      }


                      console.log(data);


                      //var x = event.xy.x;
                      // var y = event.xy.y;                        

                      var x = e.latlng.lat;
                      var y = e.latlng.lon;

                      if (data.pusto) {
                          $('.map').css('cursor', 'default');
                          statusAjax = true;
                          alert('Данні відсутні');
                      } else {
                          if (data.error) {
                              alert(data.error);
                          }
                          // При каждом клике прячем все елементы которые ми видели при предыдущем отображении
                          $('#a_dilanka, #a_ikk, #a_atu, #a_rajonunion, #a_obl, #a_grunt, #a_land_disposal, #a_dilanka_arch, #page_1, #page_2, #page_3, #page_4, #page_5, #page_6, #page_7, #page_8').hide();

                          // Удаляем все настройки класов при каждом клике
                          $("#a_dilanka, #a_ikk, #a_atu, #a_rajonunion, #a_obl, #a_grunt, #a_land_disposal, #a_dilanka_arch").removeClass("on");

                          // Мы отображаем только те вкладки для которых есть данные.
                          // Если вкладок несколько то активной по дефолту может быть только dilanka, dilanka_arch, ikk, rajonunion
                          if (data.dilanka) {
                              $('#a_dilanka').show().addClass('on');

                              $('#page_1')
                                  .show()
                                  .html(data.dilanka);

                              if (data.dilanka_arch) {
                                  $('#a_dilanka_arch').show();
                                  $('#page_8').html(data.dilanka_arch);
                              }

                              if (data.ikk) {
                                  $('#a_ikk').show();
                                  $('#page_2').html(data.ikk);
                              }

                              if (data.rajonunion) {
                                  $('#a_rajonunion').show();
                                  $('#page_4').html(data.rajonunion);
                              }

                              if (data.obl) {
                                  $('#a_obl').show();
                                  $('#page_5').html(data.obl);
                              }

                              if (data.land_disposal) {
                                  $('#a_land_disposal').show();
                                  $('#page_7').html(data.land_disposal);
                              }
                              if (data.grunt) {
                                  $('#a_grunt').show();
                                  $('#page_6').html(data.grunt);
                              }

                          } else if (data.dilanka_arch) {
                              $('#a_dilanka_arch').show().addClass('on');
                              $('#page_8')
                                  .show()
                                  .html(data.dilanka_arch);
                              if (data.ikk) {
                                  $('#a_ikk').show();
                                  $('#page_2').html(data.ikk);
                              }

                              if (data.rajonunion) {
                                  $('#a_rajonunion').show();
                                  $('#page_4').html(data.rajonunion);
                              }

                              if (data.obl) {
                                  $('#a_obl').show();
                                  $('#page_5').html(data.obl);
                              }

                              if (data.land_disposal) {
                                  $('#a_land_disposal').show();
                                  $('#page_7').html(data.land_disposal);
                              }
                              if (data.grunt) {
                                  $('#a_grunt').show();
                                  $('#page_6').html(data.grunt);
                              }



                          } else if (data.ikk) {
                              $('#a_ikk').show().addClass('on');

                              $('#page_2')
                                  .show()
                                  .html(data.ikk);

                              if (data.rajonunion) {
                                  $('#a_rajonunion').show();
                                  $('#page_4').html(data.rajonunion);
                              }

                              if (data.obl) {
                                  $('#a_obl').show();
                                  $('#page_5').html(data.obl);
                              }

                              if (data.land_disposal) {
                                  $('#a_land_disposal').show();
                                  $('#page_7').html(data.land_disposal);
                              }
                              if (data.grunt) {
                                  $('#a_grunt').show();
                                  $('#page_6').html(data.grunt);
                              }
                          } else if (data.rajonunion) {
                              $('#a_rajonunion').show().addClass('on');

                              $('#page_4')
                                  .show()
                                  .html(data.rajonunion);

                              if (data.obl) {
                                  $('#a_obl').show();
                                  $('#page_5').html(data.obl);
                              }

                              if (data.land_disposal) {
                                  $('#a_land_disposal').show();
                                  $('#page_7').html(data.land_disposal);
                              }
                              if (data.grunt) {
                                  $('#a_grunt').show();
                                  $('#page_6').html(data.grunt);
                              }
                          } else if (data.obl) {
                              $('#a_obl').show().addClass('on');

                              $('#page_5')
                                  .show()
                                  .html(data.obl);
                              if (data.grunt) {
                                  $('#a_grunt').show();
                                  $('#page_6').html(data.grunt);
                              }
                          } else if (data.atu) {
                              $('#a_atu').show().addClass('on');

                              $('#page_3')
                                  .show()
                                  .html(data.atu);
                              if (data.grunt) {
                                  $('#a_grunt').show();
                                  $('#page_6').html(data.grunt);
                              }
                          } else if (data.grunt) {
                              $('#a_grunt').show().addClass('on');

                              $('#page_6')
                                  .show()
                                  .html(data.grunt);
                          }
                          tooltip.open('tooltip', x, y);

                          /*                       if (initTabs()) {
                                                      $('.map').css('cursor', 'default');
                                                      statusAjax = true;
      
    

                                            }*/

     /*
     }



     },
     error: function () {
     alert('Помилка обробки запиту. Вибачте за незручності.');
     $('.map').css('cursor', 'default');
     statusAjax = true;
     }

     });




     });
     */