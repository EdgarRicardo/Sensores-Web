$( document ).ready(function() {
    var disReal=true;
    var simLlenado=false;
    var simVaciado=false;
    var dataSensores, termometro, sDistancia, sLuz ;
    function getDataSensores(){
        $.ajax({
            url : 'getData',
            type : 'GET',
            dataType : 'json',
            success : function(response) {
                dataSensores=response
            }
        });
        console.log(dataSensores);
    }
    var dataInterval = setInterval(getDataSensores,1000);
    $("#dReal").attr('class', 'btn btn-success');

    function cleanVars(){
        disReal=false;
        simLlenado=false;
        simVaciado=false;
    }

    function colorsButtonsReset(){
        $("#llenado").attr('class', 'btn btn-primary');
        $("#vaciado").attr('class', 'btn btn-primary');
        $("#dReal").attr('class', 'btn btn-primary');
    }

    FusionCharts.ready(function(){
        termometro = new FusionCharts({
            type: 'thermometer',
            renderAt: 'chart-temperatura',
            width: '300',
            height: '550',
            dataFormat: 'json',
            dataSource: {
                chart: {
                    caption: "Temperatura detectada por RTD",
                    subcaption: "",
                    majorTMNumber: 10,
                    minorTMNumber: 5,
                    lowerLimit: 0,
                    upperLimit: 100,
                    decimals: 1,
                    numberSuffix: "°C",
                    showhovereffect: 1,
                    bgCOlor: "#ffffff",
                    borderAlpha: "0",
                    thmFillColor: "#f76363",
                    theme: "fusion",
                    chartBottomMargin: 20
                },
                value:0,
                annotations: {
                    origw: 400,
                    origh: 190,
                    autoscale: 1,
                    groups: [{
                        id: "range",
                        items: [{
                            id: "dataTemp",
                            type: "Text",
                            fontSize: 20,
                            fillcolor: "#333333",
                            text: "0 °C",
                            x: "$chartCenterX+150",
                            y: "$chartEndY-700"
                        }]
                    }]
                }

            },
            events: {
                rendered: function(evt, arg) {
                    evt.sender.dataUpdate = setInterval(function() {
                        evt.sender.feedData("&value=" + dataSensores.temperatura);
                    }, 1000);
                },
                realtimeUpdateComplete: function(evt, arg) {
                    var annotations = evt.sender.annotations,
                        dataVal = evt.sender.getData();
                    annotations && annotations.update('dataTemp', {
                        "text": dataVal + " °C"
                    });
                },
                disposed: function(evt, arg) {
                    clearInterval(evt.sender.dataUpdate);
                }
            }
        });
        sDistancia = new FusionCharts({
            type: 'cylinder',
            dataFormat: 'json',
            renderAt: 'chart-distancia',
            width: '600',
            height: '700',
            dataSource: {
                chart: {
                    //theme: "fusion",
                    caption: "Nivel de Agua",
                    subcaption: "Almacenamiento de agua",
                    //tickValueStep: 1,
                    majorTMNumber: 10,
                    minorTMNumber: 5,
                    lowerLimit: 0,
                    upperLimit: 200,
                    lowerLimitDisplay: "Vacio",
                    upperLimitDisplay: "Lleno",
                    numberSuffix: " cm",
                    showValue: 1,
                    chartBottomMargin: 45,
                    showhovereffect: "1",
                    bgCOlor: "#ffffff",
                    borderAlpha: "0",
                    cylFillColor: "#008ee4"
                },
                value: 100,
                annotations: {
                    origw: 400,
                    origh: 190,
                    autoscale: 1,
                    groups: [{
                        id: "range",
                        items: [{
                            id: "rangeBg",
                            type: "rectangle",
                            x: "$canvasCenterX-45",
                            y: "$chartEndY-30",
                            tox: "$canvasCenterX+45",
                            toy: "$chartEndY-75",
                            fillcolor: "#6caa03"
                        }, {
                            id: "rangeText",
                            type: "Text",
                            fontSize: 20,
                            fillcolor: "#333333",
                            text: "100 cm",
                            x: "$chartCenterX+75",
                            y: "$chartEndY-450"
                        }]
                    }]
                }

            },
            events: {
                rendered: function(evtObj, argObj) {
                    evtObj.sender.chartInterval = setInterval(function() {
                        evtObj.sender.feedData && evtObj.sender.feedData("&value=" + dataSensores.distancia);
                    }, 800);
                },
                realTimeUpdateComplete: function(evt, arg) {
                    var annotations = evt.sender.annotations,
                        dataVal = evt.sender.getData(),
                        colorVal = (dataVal >= 150) ? "#6caa03" : ((dataVal <= 100) ? "#e44b02" : "#f8bd1b");
                    //Updating value
                    annotations && annotations.update('rangeText', {
                        "text": dataVal + " cm"
                    });
                    //Changing background color as per value
                    annotations && annotations.update('rangeBg', {
                        "fillcolor": colorVal
                    });

                },
                disposed: function(evt, arg) {
                    clearInterval(evt.sender.chartInterval);
                }
            }
        });
        sLuz = new FusionCharts({
            type: 'hlineargauge',
            renderAt: 'chart-luz',
            id: 'cpu-linear-gauge-7',
            width: '400',
            height: '170',
            dataFormat: 'json',
            dataSource: {
                "chart": {
                "theme": "fusion",
                "caption": "Luxes captados por el LDR",
                "lowerLimit": "0",
                "upperLimit": "100",
                "numberSuffix": " luxes",
                "chartBottomMargin": "40",
                "valueFontSize": "11",
                "valueFontBold": "0",
                "showValue": "0",
                "gaugeFillMix": "{light-10},{light-70},{dark-10}",
                "gaugeFillRatio": "40,20,40"
                },
                "colorRange": {
                "color": [
                    {
                        "minValue": "0",
                        "maxValue": "20",
                        "code": "#fffdcc"
                    },
                    {
                        "minValue": "20",
                        "maxValue": "40",
                        "code": " #fffca0"
                    },
                    {
                        "minValue": "40",
                        "maxValue": "60",
                        "code": " #fffa6d"

                    }, 
                    {
                        "minValue": "60",
                        "maxValue": "80",
                        "code": " #fff833"
                    }, 
                    {
                        "minValue": "80",
                        "maxValue": "100",
                        "code": " #fdf400"
                    }, 
                    
                ]},
                pointers: {
                pointer: [{
                    value: 0
                }]
                },
                annotations: {
                    origw: 400,
                    origh: 190,
                    autoscale: 1,
                    groups: [{
                        id: "range",
                        items: [{
                            id: "dataLuz",
                            type: "Text",
                            fontSize: 20,
                            fillcolor: "#333333",
                            text: "0 luxes",
                            x: "$chartCenterX",
                            y: "$chartEndY-25"
                        }]
                    }]
                }
            },
            events: {
                rendered: function(evtObj, argObj) {
                    evtObj.sender.intervalVar = setInterval(function() {
                        evtObj.sender.feedData && evtObj.sender.feedData("&value=" + dataSensores.luz);
                    }, 800);
                },
            realTimeUpdateComplete: function(evt, arg) {
                    var annotations = evt.sender.annotations,
                    dataVal = evt.sender.getData(1);
                    if(dataVal>10)
                        $("#foco").attr("src","/static/b_prendida.png");
                    else
                        $("#foco").attr("src","b_apagada.png");
                    annotations && annotations.update('dataLuz', {
                        "text": dataVal + " luxes"
                    });

                },
                disposed: function(evtObj, argObj) {
                    clearInterval(evtObj.sender.intervalVar);
                }
            }
        });
        sDistancia.render();
        termometro.render();
        sLuz.render();
    });
    

    $("#llenado" ).click(function() {
        colorsButtonsReset()
        $("#llenado").attr('class', 'btn btn-success');
        clearInterval(sDistancia.chartInterval);
        sDistancia.chartInterval = setInterval(function() {
            dataVal = sDistancia.getData()
            llenado = dataVal+10<200 ? dataVal + 10 : 200
            sDistancia.feedData("&value=" + llenado);
        }, 100);
    });
    $("#vaciado" ).click(function() {
        colorsButtonsReset()
        $("#vaciado").attr('class', 'btn btn-success');
        clearInterval(sDistancia.chartInterval);
        sDistancia.chartInterval = setInterval(function() {
            dataVal = sDistancia.getData()
            vaciado = dataVal-10>3 ? dataVal - 10 : 3
            sDistancia.feedData("&value=" + vaciado);
        }, 100);
    });
    $("#dReal" ).click(function() {
        colorsButtonsReset()
        $("#dReal").attr('class', 'btn btn-success');
        clearInterval(sDistancia.chartInterval);
        sDistancia.chartInterval = setInterval(function() {
            sDistancia.feedData("&value=" + dataSensores.distancia);
        }, 800);
    });
        
});