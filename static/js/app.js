function retrievedata(){
    d3.json("samples.json").then(function(data){
    //creating ID for the input of Test Subject ID No.
    var ID = data.samples.map(object=>object.id) ;
    //console.log(ID[0]);
    var selection =d3.select("#selDataset")
    for (var i = 0; i < 153; i++) {
        selection.append("option").text(ID[i]).property("value(ID[i])")
        console.log(data)
    }

})};
retrievedata();


// On change to the DOM, call BuildChart()
d3.selectAll("#selDataset").on("change", BuildChart);


function BuildChart(){
    d3.json("samples.json").then(data=>{
        d3.select("#sample-metadata").html(" ")
        console.log("start of script")


        //getting the dropdownMenuValue
        var dropdownMenuValue = d3.select("#selDataset").node().value;
        console.log(dropdownMenuValue.toString());

        //getting x and y values
        var filteredResult= data.samples.filter(itemObj=> itemObj.id == dropdownMenuValue);
        console.log(filteredResult);
        var values= filteredResult[0].sample_values;
        console.log(values);
        var ids= filteredResult[0].otu_ids;
        console.log(ids);
        var names=filteredResult[0].otu_labels.slice(0,10);
        console.log(names);
        
        //creating horizontal bar chart
        var trace1={
            x: values.slice(0,10).reverse(),
            y: ids.slice(0,10).map(otu_ids=>`OTU ${otu_ids}`).reverse(),
            text: names,
            type:"bar",
            orientation: "h"
        };
        var data1=[trace1];
        var layout1= {
            margin:{t:50, l:175}
        };
        Plotly.newPlot("bar", data1, layout1)

        //creating bubble chart
        var trace2={
            x: ids,
            y: values,
            mode:"markers",
            marker:{
                size:values,
                color:ids
            },
            text: names
        };
        var data2=[trace2];
        var layout2={
            xaxis:{title:"OTU ID"},
            height: 600,
            width: 1200
        }
        Plotly.newPlot("bubble", data2, layout2)

       
          
        
        //creating demo graphics info
        var filteredMeta=data.metadata.filter(itemObj=> itemObj.id == dropdownMenuValue);
        console.log(filteredMeta)
        filteredMeta.forEach((record)=>{
            Object.entries(record).forEach(([key, value])=>{
                console.log(key);
                console.log(value)
                d3.select("#sample-metadata").append("div").text(`${key}: ${value}`)

            })
        })
         //washing
         filteredMeta.forEach((record)=>{
            Object.entries(record).forEach(([key, value])=>{
                if (key=="wfreq"){
                    var washfreq=value
                    console.log(washfreq)
                    var data3 = [
                        {
                        domain: { x: [0, 1], y: [0, 1] },
                        value: washfreq,
                        title: { text: "Scrubs per Week" },
                        type: "indicator",
                        mode: "gauge+number+delta",
                        delta: { reference: 6 },
                        gauge: {
                        axis: { range: [0, 9] },
                        steps: [
                            { range: [0, 1], color: "ivory" },
                            { range: [1, 2], color: "beige" },
                            { range: [2, 3], color: "lightyellow" },
                            { range: [3, 4], color: "palegoldenrod" },
                            { range: [4, 5], color: "navajowhite" },
                            { range: [5, 6], color: "burlywood" },
                            { range: [6, 7], color: "tan" },
                            { range: [7, 8], color: "peru" },
                            { range: [8, 9], color: "sienna" }
                        ],
                        threshold: {
                            line: { color: "red", width: 4 },
                            thickness: 0.75,
                            value: 8.5
                        }
                        }
                        }
                      ];
                    var layout3 = { width: 300, height: 300, margin: { t: 0, b: 0 } };
                    Plotly.newPlot('gauge', data3, layout3);
                }
            })
        })
        
        
  
    })
}
BuildChart()