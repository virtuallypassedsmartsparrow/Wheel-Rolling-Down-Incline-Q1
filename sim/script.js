// Global variables
var category = "";
var page = " ";



var values = { // m for model
    M: 0, // Already pulled from smartsparrow. How to I set random inputs?
    R: 0,
    theta_deg: 0,
    theta_rad: 0,
    m_r: 0,
    m_spoke: 0,
    I_r: 0,
    I_s: 0,
    I_o: 0,
    F: 0,
    a_G: 0,
    X: 0,
    T: 0,
    V_G: 0,
};

var valuesRounded = {
    M: 0, // all these should be 0 for some reason. I guess it doesn't matter?
    R: 0,
    theta_deg: 0,
    theta_rad: 0,
    m_r: 0,
    m_spoke: 0,
    I_r: 0,
    I_s: 0,
    I_o: 0,
    F: 0,
    a_G: 0,
    X: 0,
    T: 0,
    V_G: 0,
};

var names = { //choose how to write variable string.
    M: "M",
    R: "R",
    theta_deg: "&#x03B8",
    theta_rad: "&#x03B8",
    m_r: "m<sub>r</sub>",
    m_spoke: "m<sub>spoke</sub>",
    I_r: "I<sub>r</sub>",
    I_s: "I<sub>s</sub>",
    I_o: "I<sub>o</sub>",
    F: "F",
    a_G: "a<sub>G</sub>",
    X: "X",
    T: "T",
    V_G: "V<sub>G</sub>",
};

var units = { //write the units
    M: "kg",
    R: "m",
    theta_deg: "deg",
    theta_rad: "rad",
    m_r: "kg",
    m_spoke: "kg",
    I_r: "kgm<sup>2</sup>",
    I_s: "kgm<sup>2</sup>",
    I_o: "kgm<sup>2</sup>",
    F: "N",
    a_G: "m/s<sup>2</sup>",
    X: "m",
    T: "s",
    V_G: "m/s",
};


// Get values from SS
var model = new pipit.CapiAdapter.CapiModel({
    M: 2, 
    R: 3,
    theta_deg: 20,
    theta_rad: " ",
    m_r: " ",
    m_spoke: " ",
    I_r: " ",
    I_s: " ",
    I_o: " ",
    F: " ",
    a_G: " ",
    X: 4,
    T: " ",
    V_G: " ",
});
// I think this exposes the values to Smart Sparrow. :D
pipit.CapiAdapter.expose('M', model);
pipit.CapiAdapter.expose('R', model);
pipit.CapiAdapter.expose('theta_deg', model);
pipit.CapiAdapter.expose('theta_rad', model);
pipit.CapiAdapter.expose('m_r', model);
pipit.CapiAdapter.expose('m_spoke', model);
pipit.CapiAdapter.expose('I_r', model);
pipit.CapiAdapter.expose('I_s', model);
pipit.CapiAdapter.expose('I_o', model);
pipit.CapiAdapter.expose('F', model);
pipit.CapiAdapter.expose('a_G', model);
pipit.CapiAdapter.expose('X', model);
pipit.CapiAdapter.expose('T', model);
pipit.CapiAdapter.expose('V_G', model);

//this gets the values from Smart Sparrow. So does that mean I need to put inputs into Smart Sparrow variable tab? Either way, I'm sure these are just the inputs
//I think I can place M R theta_deg in variables. Then make pages # in iniitial state. Then i'm done??!
pipit.Controller.notifyOnReady();

model.on("change:M", function() {
    draw();
});
model.on("change:R", function() {
    draw();
});
model.on("change:theta_deg", function() {
    draw();
});
model.on("change:X", function() {
    draw();
});
// model.on("change:page", function() {
//     draw();
// });

// This is JQuery right? 
$("#selectBox").change(function() {
    draw();
});

//this is the generic function which does all the magic. It gets the values from SS then calculates them then figures out which catagory its in (how does it know what question #? from getvaleusformSS function!!) then displays the values
function draw() {
    getValuesFromSS();
    calculateVariables();

    category = $("#selectBox option:selected").val();
    sendValuesToSS();
    displayValues();
}

//there is no need to send the input values back to smart sparrow. so only send the values that have been calculated.
function sendValuesToSS() {
    model.set("theta_rad", values.theta_rad);
    model.set("m_r", values.m_r);
    model.set("m_spoke", values.m_spoke);
    model.set("I_r", values.I_r);
    model.set("I_s", values.I_s);
    model.set("I_o", values.I_o);
    model.set("F", values.F);
    model.set("a_G", values.a_G);
    model.set("T", values.T);
    model.set("V_G", values.V_G);
}
// what is the purpose of the num == 4 ? Is this to make it fit to the table somehow?
function displayValues() {
    var show = getShowVariables();
    var s = "<table class=right><tr><td>";
    var num = 1;

    $.each(show, function(i, e) {
        var name = names[e]; // objects can reference members by object.property or by object['property'], allowing you to use variables
        var value = valuesRounded[e];
        var unit = units[e];

        s += name + " = " + value + " " + unit + "<br>";

        if (num == 4) {
            s += "</td><td>";
            num = 0
        }
        num++;

    });

    s += "</td></tr></table>";

    $("#right")[0].innerHTML = s;
}

// Here i'm getting all the inputs from Smart Sparrow. This is the start of the draw function. Only put in inputs because other variables won't be there

//really not sure if i've got this right... :(

function getValuesFromSS() {
//randbetween(x1,x2,inc). Math.floor(Math.random() * (x2-x1+1)/inc + x1/inc)*inc

    values.M = model.get('M'); //1<= M <= 4 (incriment 1)
    values.R = model.get('R'); //0.5 <= R <= 1.2 (incriment 0.1)
    page = model.get('page');
    values.theta_deg = model.get('theta_deg'); //20 <= theta_deg <= 45 (incriment 5)
    values.X = model.get('X');
}
                            // function getValuesFromSS() {
                            //     values.M = model.get('M');
                            //     values.R = model.get('R');
                            //     page = model.get('page');
                            //     values.theta_deg = model.get('theta_deg');
                            //     values.X = model.get('X');
                            // }
//ones the inputs are pulled from Smart Sparrow then they're calculated (all part of the draw function). Make sure I start from elementary formulas and work done.
function calculateVariables() {
    values.theta_rad = values.theta_deg * Math.PI / 180;
    values.m_r = values.M * 2 * Math.PI / (2 * Math.PI + 8);
    values.m_spoke = values.M * 1 / (2 * Math.PI + 8);
    values.I_r = values.m_r * values.R * values.R;
    values.I_s = (8/3) * values.m_spoke * values.R * values.R;
    values.I_o = values.I_r + values.I_s;
    values.F = (values.M * values.I_o * 9.81 * Math.sin(values.theta_rad)) / (values.M * values.R * values.R + values.I_o);
    values.a_G = 9.81 * Math.sin(values.theta_rad) - values.F / values.M;
    values.T = Math.sqrt(2 * values.X / values.a_G);
    values.V_G = values.a_G * values.T;


    // Round values into valuesRounded
    $.each(values, function(i, e) {
        valuesRounded[i] = round(values[i]);
    })
}
// case 1 = catagory 1. Is the order determiend by the order in the HTML code?
// page 3 = 30. Page 3 from start of SS tutorial? Start at page 0 or page 1? Why is crank shaft velocity page 1??!
// For case 1, pages 3,4,5,6,7,8 and 9 are all taken care of by the one return line. right?
// what is the max number of variables per category??
// what happens if I have less than 5 categories? How do I specify 3 categories for example?
function getShowVariables() {
    switch (category) {
        case "1": // Category 1
            switch (page) {
                case "10": 
                    return ["M", "R", "theta_deg"];
                    break;
                case "20": 
                case "30": 
                case "40": 
                case "50":
                case "60":
                    return ["M", "R", "theta_rad"];
                case "70":
                case "80":
                    return ["M", "R", "theta_rad", "X"];
                    break;
            }
            break;

        case "2": // Category 2
            switch (page) {
                case "10":
                case "20":
                    return [];
                    break;
                case "30":
                    return ["I_r"];
                    break;
                case "40":
                    return ["I_r", "I_s"];
                    break;
                case "50":
                case "60":
                case "70":
                case "80":
                    return ["I_r", "I_s", "I_o"];
                    break;
            }
            break;

        case "3":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                case "50":
                    return [];
                    break;
                case "60":
                case "70":
                case "80":
                    return ["F"];
                    break;
            }
            break;

        case "4":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                case "50":
                case "60":
                    return [];
                    break;
                case "70":
                    return ["a_G"];
                    break;
                case "80":
                    return ["a_G", "T"];
                    break;
            }
            break;
    }
    return []; // empty
}
/*
function getShowVariables() {
    switch (category) {
        case "1": // Category 1
            switch (page) {
                case "10": //Crank Shaft Angular Velocity page
                case "20": //Input Power page
                    return ["tMax", "tMin", "tAvg"];
                    break;

                case "30": //Theta_1 and theta_2 page
                case "40": // and so on
                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["tMax", "tMin", "tAvg", "P"];
                    break;
            }
            break;

        case "2": // Category 2
            switch (page) {
                case "10":
                    return [];
                    break;

                case "20":
                case "30":
                    return ["w_1_rad"];
                    break;

                case "40":
                    return ["w_1_rad", "theta_1", "theta_2"];
                    break;

                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["w_1_rad", "theta_1", "theta_2", "delta_E"];
                    break;
            }
            break;

        case "3":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["d_1", "d_2"];
                    break;
            }
            break;

        case "4":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                case "50":
                case "60":
                case "70":
                case "80":
                case "90":
                    return ["w_2_RPM"];
                    break;
            }
            break;

        case "5":
            switch (page) {
                case "10":
                case "20":
                case "30":
                case "40":
                    return [];
                    break;

                case "50":
                    return ["w_1_RPM", "wMin", "wMax"];
                    break;

                case "60":
                    return ["w_1_RPM", "wMin", "wMax", "C"];
                    break;

                case "70":
                    return ["w_1_RPM", "wMin", "wMax", "C", "percent", "i_reqd"];
                    break;

                case "80":
                    return ["w_1_RPM", "wMin", "wMax", "C", "percent", "rho", "i_reqd", "i_fw"];
                    break;

                case "90":
                    return ["w_1_RPM", "wMin", "wMax", "C", "percent", "rho", "i_reqd", "i_fw", "dI", "dO"];
                    break;
            }
            break;

    }
    return []; // empty
}
*/



// Debugging
// $.each(model.attributes, function(i, e) {
//     console.log(i + " : " + e);
// });


function round(input) {
    // if it is an integer number, return it
    if (parseInt(input) == parseFloat(input)) {
        return input;
    }

    // if the input is NaN or not available or 0, dont round
    if (isNaN(input) == true || input == " " || input == 0) {
        return input;
    }

    if (input > 0) {
        var position = 0;
        var i = input;
        while (i < 1000) { // show 3 sig figs
            i *= 10;
            position++;
        }
        input = Math.round(i) / Math.pow(10, position);
        return input;
    }
    
    return input;
}
