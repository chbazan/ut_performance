/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3412698412698413, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "ConsultaCuentasComitenteEspecies"], "isController": false}, {"data": [0.5, 500, 1500, "AltaOrdenConsulta"], "isController": false}, {"data": [0.47619047619047616, 500, 1500, "PosicionNegociableComitente"], "isController": false}, {"data": [0.5, 500, 1500, "ConsultaCuentasLiquidacion"], "isController": false}, {"data": [0.47619047619047616, 500, 1500, "LicitacionesVigentes"], "isController": false}, {"data": [0.0, 500, 1500, "ConsultaDeudaCliente"], "isController": false}, {"data": [0.0, 500, 1500, "AltaOrdenOperacionCompra"], "isController": false}, {"data": [0.47619047619047616, 500, 1500, "PosicionNegociable"], "isController": false}, {"data": [0.40476190476190477, 500, 1500, "AltaOrdenOperacionVenta"], "isController": false}, {"data": [0.47619047619047616, 500, 1500, "ConsultaPrecioReferencia"], "isController": false}, {"data": [0.5, 500, 1500, "ConsultaProductosOperables"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "ConsultaOrdenes"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 252, 0, 0.0, 1624.797619047619, 880, 7729, 1252.5, 2890.1, 3165.95, 4897.87, 0.6823646643415723, 1.7277353354214957, 1.3904957027272926], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["ConsultaCuentasComitenteEspecies", 21, 0, 0.0, 2909.476190476191, 2360, 7729, 2599.0, 3551.4000000000005, 7321.4999999999945, 7729.0, 0.059693177069860916, 0.0614420006168295, 0.10877682462144578], "isController": false}, {"data": ["AltaOrdenConsulta", 21, 0, 0.0, 1097.6666666666665, 927, 1327, 1128.0, 1197.2, 1314.1999999999998, 1327.0, 0.06020952916148196, 0.058680771585116205, 0.15087661311363545], "isController": false}, {"data": ["PosicionNegociableComitente", 21, 0, 0.0, 1336.714285714286, 1081, 3091, 1252.0, 1424.8, 2925.899999999998, 3091.0, 0.059828718924678496, 0.4081089860242961, 0.11247098040039658], "isController": false}, {"data": ["ConsultaCuentasLiquidacion", 21, 0, 0.0, 1085.0476190476188, 939, 1325, 1073.0, 1240.0, 1317.8, 1325.0, 0.05973052998045958, 0.0874375629303798, 0.12220259795806916], "isController": false}, {"data": ["LicitacionesVigentes", 21, 0, 0.0, 1100.333333333333, 961, 1607, 1076.0, 1320.6000000000001, 1581.7999999999997, 1607.0, 0.05947576362632227, 0.11755756404265262, 0.10402450454564766], "isController": false}, {"data": ["ConsultaDeudaCliente", 21, 0, 0.0, 3371.5238095238096, 2888, 5068, 3146.0, 4547.200000000001, 5035.9, 5068.0, 0.05941686590179241, 0.08761666749190092, 0.13600891960332168], "isController": false}, {"data": ["AltaOrdenOperacionCompra", 21, 0, 0.0, 2244.3809523809523, 2062, 2490, 2257.0, 2327.4, 2473.7999999999997, 2490.0, 0.05997549572603193, 0.0535328155210871, 0.1365262505247856], "isController": false}, {"data": ["PosicionNegociable", 21, 0, 0.0, 1237.5714285714287, 1043, 1613, 1213.0, 1374.2, 1589.3999999999996, 1613.0, 0.059881605511388915, 0.31285799754485416, 0.10865236625015683], "isController": false}, {"data": ["AltaOrdenOperacionVenta", 21, 0, 0.0, 1361.8095238095239, 1093, 1767, 1302.0, 1717.6000000000001, 1763.3999999999999, 1767.0, 0.06008996325927961, 0.05868160474539024, 0.13672813905675926], "isController": false}, {"data": ["ConsultaPrecioReferencia", 21, 0, 0.0, 1149.0952380952383, 907, 2520, 1068.0, 1431.6000000000001, 2413.8999999999987, 2520.0, 0.059813893343283325, 0.05572505297801982, 0.11028186585167864], "isController": false}, {"data": ["ConsultaProductosOperables", 21, 0, 0.0, 1051.142857142857, 880, 1197, 1057.0, 1169.2, 1194.3, 1197.0, 0.059770991714602054, 0.23820841522196384, 0.1182578410290857], "isController": false}, {"data": ["ConsultaOrdenes", 21, 0, 0.0, 1552.8095238095236, 1328, 2170, 1459.0, 2022.2000000000003, 2160.1, 2170.0, 0.060000514290122486, 0.27797113260970807, 0.11836038951762443], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 252, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
