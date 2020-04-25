
// ============================================================================
// CURLING SVG
// ============================================================================
var CLICK_DISTANCE = 4,
    CLICK_DISTANCE_2 = CLICK_DISTANCE * CLICK_DISTANCE;

var curling = d3.select('#curling');
var width = 4.75,
    height = width*2.4,
    sheet_length = 40.2336
    sixfeet = width * 0.38501052631,
    rockwidth = sixfeet / 6 * 10 / 12,
    rockradius = rockwidth/2,
    rockoutline = rockwidth/5,
    spacer = rockwidth/4,
    svg_rockradius = rockradius + rockoutline/2,
    linewidth = .02,
    backline_pos = sixfeet,
    hogline_width = sixfeet/18,
    score_flag = false,
    current_end = 1,
    red_score = 0,
    yel_score = 0,
    hammer = "red";

var radii = {
    "twelve": sixfeet,
    "eight": sixfeet*2/3,
    "four": sixfeet/3,
    "button": sixfeet/12,
};

var pin = {
    "x": width/2
    ,"y": radii.twelve + sixfeet
}

var hogline_pos = pin.y + sixfeet * 7 / 2,
    fourfootline_pos = pin.y + Math.sqrt(radii.twelve**2-radii.four**2);

var rocks = []
var row = 0, col = 1;
for (let i = 1; i <= 8; ++i) {
    col = i % 2 + 1;
    if (i%2) row++;
    let x = rockwidth * col + spacer * (i%2 + 1)
    let y = rockwidth * row + spacer * (row-1)
    rocks.push({x: x, y: y, name: `red${i}`, color: "red", id: i, sitting: true, score: true})

    x = width - rockwidth * col - spacer * (i%2 + 1)
    y = rockwidth * row + spacer * (row-1)
    rocks.push({x: x, y: y, name: `yel${i}`, color: "yellow", id: i+8, sitting: true, score: true})
}
var reset = _.cloneDeep(rocks)

var measures = []

// var house = []
// cx = width/2
// cy = radii.twelve + backline_pos
// for (r in radii) {
//     house.push({r: r, cx: cx, cy: cy, })
// }
 

var svg = curling.append("svg")
    .attr("width", 350)
    .attr("height", 2.4*350)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("class", "curling")

// bottom layer
var layer1 = svg.append('g')
var layer2 = svg.append('g')
var layer3 = svg.append('g')
var layerPi = svg.append('g')
var layer4 = svg.append('g')
//top layer

//sheet
layer1.append("rect")
    .attr("class", "sheet white")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0)

// backline
layer1.append("line")
    .attr("name", "backline")
    .attr("class", "house line")
    .attr("x1", 0)
    .attr("y1", backline_pos)
    .attr("x2", width)
    .attr("y2", backline_pos)
    .style("stroke-width", linewidth)

// hogline
layer1.append("line")
    .attr("name", "hogline")
    .attr("class", "house line")
    .attr("x1", 0)
    .attr("y1", hogline_pos)
    .attr("x2", width)
    .attr("y2", hogline_pos)
    .style("stroke-width", hogline_width)

// left 4 foot
layer1.append("line")
    .attr("name", "fourfootline")
    .attr("class", "house line")
    .attr("x1", pin.x - radii.four)
    .attr("y1", fourfootline_pos)
    .attr("x2", pin.x - radii.four)
    .attr("y2", height)
    .style("stroke-width", linewidth)

// right 4 foot
layer1.append("line")
    .attr("name", "fourfootline")
    .attr("class", "house line")
    .attr("x1", pin.x + radii.four)
    .attr("y1", fourfootline_pos)
    .attr("x2", pin.x + radii.four)
    .attr("y2", height)
    .style("stroke-width", linewidth)

// 12 foot
layer1.append("circle")
    .attr("name", "twelve")
    .attr("class", "house blue line")
    .attr("r", radii.twelve)
    .attr("cx", pin.x)
    .attr("cy", pin.y)

// 8 foot
layer1.append("circle")
    .attr("name", "eight")
    .attr("class", "house white line")
    .attr("r", radii.eight)
    .attr("cx", pin.x)
    .attr("cy", pin.y)


// 4 foot
layer1.append("circle")
    .attr("name", "four")
    .attr("class", "house red line")
    .attr("r", radii.four)
    .attr("cx", pin.x)
    .attr("cy", pin.y)

// t line
layer1.append("line")
    .attr("name", "tline")
    .attr("class", "house line")
    .attr("x1", 0)
    .attr("y1", pin.y)
    .attr("x2", width)
    .attr("y2", pin.y)
    .style("stroke-width", linewidth)

// center line
layer1.append("line")
    .attr("name", "centerline")
    .attr("class", "house line")
    .attr("x1", pin.x)
    .attr("y1", 0)
    .attr("x2", pin.x)
    .attr("y2", height)
    .style("stroke-width", linewidth)

// button
layer1.append("circle")
    .attr("name", "button")
    .attr("class", "house white line")
    .attr("r", radii.button)
    .attr("cx", pin.x)
    .attr("cy", pin.y)

layer1.append("circle")
    .attr("name", "pin")
    .attr("class", "house line")
    .attr("r", 0.00125)
    .attr("cx", pin.x)
    .attr("cy", pin.y)


updateRocks(rocks)

// ----------------------------------------------------------------------------
// UPDATE FUNCTIONS
// ----------------------------------------------------------------------------

function updateRocks(rocks) {
    const t = d3.transition()
        .duration(50);

    layer4.selectAll(".rock")
        .data(rocks, d=>d.id)
        .join(
            enter => {
                enter.append("circle")
                    .attr("class", d => `rock ${d.color}`)
                    .attr("name", d => d.name)
                    .attr("id", d => d.id)
                    .attr("r", rockradius)
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .style("stroke-width", rockoutline)
                    .call(d3.drag()
                        .clickDistance(CLICK_DISTANCE)
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended)
                    );
            },
            update => {
                update.call(update => update.transition(t)
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    // if rock is not sitting, add no-sit class (darkens rock); if not scoring, add no-score class (greys out rock)
                    .attr("class", d => `rock ${d.color}${d.sitting ? "" : " no-sit"}${d.score ? "" : " no-score"}`)
                )
            },
            exit => exit.remove()
                // .call(exit => exit
                //     .transition(t)
                //     .attr("cx", d => d.color == "red" ? rockwidth*-2 : width + rockwidth*2)
                //     .remove()
                // )
        )   
}

function updateMeasures(measures) {
    const t = d3.transition()
        .duration(750);
    // add two measure circles, one slightly thicker black one, and a thinner one of the desired color
    layer2.selectAll(".measure")
        .data(measures, d => d.id)
        .join(
            enter => {
                enter.append("circle")
                    .attr("class", d => `measure line`)
                    .attr("id", d => d.id)
                    .attr("r", d => d.r)
                    .attr("cx", pin.x)
                    .attr("cy", pin.y)
                    .attr("fill", "none")
                    .style("stroke-width", linewidth*1.2);
            },
            update => {
                update
                    .attr("r", d => d.r)
                    // if rock is not sitting, add no-sit class (darkens circle); if not scoring, add no-score class (greys out circle)
                    .attr("class", d => `measure line${d.sitting ? "" : " no-sit"}${d.score ? "" : " no-score"}`)
            },
            exit => {
                exit.remove()
            }
        )
    layer3.selectAll(".measure")
        .data(measures, d => d.id)
        .join(
            enter => {
                enter.append("circle")
                    .attr("class", d => `measure ${d.color}`)
                    .attr("id", d => d.id)
                    .attr("r", d => d.r)
                    .attr("cx", pin.x)
                    .attr("cy", pin.y)
                    .attr("fill", "none")
                    .style("stroke-width", linewidth*0.7);
            },
            update => {
                update
                    .attr("r", d => d.r)
                    // if rock is not sitting, add no-sit class (darkens circle); if not scoring, add no-score class (greys out circle)
                    .attr("class", d => `measure ${d.color}${d.sitting ? "" : " no-sit"}${d.score ? "" : " no-score"}`)
            },
            exit => {
                exit.remove()
            }
        )

    check_showCircles()
}

// ----------------------------------------------------------------------------
// CALLBACKS
// ----------------------------------------------------------------------------

function clicked(d, i) {
    if (d3.event.defaultPrevented) return; // dragged
}

function dragstarted(d) {
    d.startX = d3.event.sourceEvent.clientX;
    d.startY = d3.event.sourceEvent.clientY;

    // if rocks are greyed out from scoring, remove the no-score classes
    if (score_flag) {
        rocks.forEach((e) => e.score = true)
        measures.forEach((e) => e.score = true)
        updateRocks(rocks)
        updateMeasures(measures)
        score_flag = false;
    }
}

function dragged(d) {
    var e = d3.select(this),
        dStartX = d.startX - d3.event.sourceEvent.clientX,
        dStartY = d.startY - d3.event.sourceEvent.clientY;

    if (dStartX * dStartX + dStartY * dStartY > CLICK_DISTANCE_2 &&
        !e.classed("active")) {

        e.raise().classed("active", true);
    }
    e.attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);

    if (rockInHouse(d)) {
        r = rockDist(d) - svg_rockradius
        // update radius or add measure circle around rock 
        if (measures.some(m => m.id == d.id)){
            measure = measures.find(m => m.id == d.id)
            measure.r = r
        } else {
            // add measure circles to data array
            measures.push({id: d.id, r: r, color: d.color, sitting:true, score: true})
        }
    } else {
        // remove measure circle
        measures = measures.filter(m => m.id != d.id)
    }

    // determine which rocks are sitting
    let order = rocks.sort(scoreSort)
    let first = order[0]
    let first_nonscoring = find(order, r => r.color != first.color)
    order.forEach((e,i) => {
        if (rockInPlay(e)) {
            // darken rocks and measures that aren't sitting
            if (i >= first_nonscoring) {
                e.sitting = false
                if (rockInHouse(e)) {
                    m = find(measures, m => m.id == e.id)
                    measures[m].sitting = false
                }
            }
            else {
                // don't darken rocks and measures that are sitting
                e.sitting = rockInHouse(e)
                
                if (rockInHouse(e)) {
                    m = find(measures, m => m.id == e.id)
                    measures[m].sitting = true
                }
            }
        } else { // don't darken rocks that aren't in play
            e.sitting = true;
        }
    })

    
    updateRocks(order)
    updateMeasures(measures)
}

function dragended(d) {
    const filter = (e) => e.id == d.id
    let i = rocks.findIndex(filter)
    rocks[i].x = d.x
    rocks[i].y = d.y
    updateRocks(rocks)
    d3.select(this).classed("active", false);
}

// ----------------------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------------------

var rockDist = (rock) => Math.sqrt((pin.x - rock.x)**2 + (pin.y - rock.y)**2)

var rockInHouse = function(rock) {
    // rock is in house if any part of it is touching the house
    if (rockDist(rock) <= radii.twelve + svg_rockradius) {
        return true
    }
    return false
}

var rockInPlay = function(rock) {
    // rock is in play if it has completely crossed the hogline, and not completely crossed the backline
    if (rock.y + svg_rockradius > backline_pos && rock.y + svg_rockradius < hogline_pos - hogline_width/2){
        return true
    }
    return false
}

var scoreSort = function(r0, r1) {
    // find dist if rocks in house or set to high val for sorting
    let r0_dist = rockInHouse(r0) ? rockDist(r0) : Number.MAX_VALUE
    let r1_dist = rockInHouse(r1) ? rockDist(r1) : Number.MAX_VALUE
    if (r0_dist < r1_dist) {
        return -1
    }
    if (r0_dist > r1_dist) {
        return 1
    }
    return 0
}

// https://stackoverflow.com/a/18520276/13254229
function find(arr, test, ctx) {
    var result = null;
    arr.some(function(el, i) {
        return test.call(ctx, el, i, arr) ? ((result = i), true) : false;
    });
    return result;
}

function check_showCircles() {
    let test = $("#showMeasures")[0].checked
    if (test) {
        $(".measure").removeClass("hide-measure")
    } else {
        $(".measure").addClass("hide-measure")
    }
}

function switchTeams(team) {
    return team == "red" ? "yellow" : "red"
}

// ============================================================================
// SIMULATION
// ============================================================================

var teams = {"red":"red", "yel":"yellow"};
var sim_rocks = [];
var next_color = teams[hammer]
var simRock_id = 100

function newSimRock() {
    let x = width/2
    let y = hogline_pos - hogline_width/2 + svg_rockradius
    sim_rocks.push({x: x, y: y, color: next_color, id: simRock_id, sitting: true, score: true})
    simRock_id++;
    next_color = switchTeams(next_color)
}

function updateSimRocks(sim_rocks) {
    const t = d3.transition()
        .duration(1000);

    layer4.selectAll(".simRock")
        .data(sim_rocks, d => d.id)
        .join(
            enter => {
                enter.append("circle")
                    .attr("class", d => `simRock ${d.color}`)
                    .attr("name", d => d.name)
                    .attr("id", d => d.id)
                    .attr("r", rockradius)
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .style("stroke-width", rockoutline)
                    .call(d3.drag()
                        .clickDistance(CLICK_DISTANCE)
                        .on("start", sim_dragstarted)
                        .on("drag", sim_dragged)
                        .on("end", sim_dragended)
                    );
            },
            update => {
                update.call(update => update.transition(t)
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    // if rock is not sitting, add no-sit class (darkens rock); if not scoring, add no-score class (greys out rock)
                    .attr("class", d => `simRock ${d.color}${d.sitting ? "" : " no-sit"}${d.score ? "" : " no-score"}`)
                )
            },
            exit => exit.remove()
                // .call(exit => exit
                //     .transition(t)
                //     .attr("cx", d => d.color == "red" ? rockwidth*-2 : width + rockwidth*2)
                //     .remove()
                // )
        )
}

// ----------------------------------------------------------------------------
// sim callbacks
// ----------------------------------------------------------------------------

function sim_clicked(d, i) {
    if (d3.event.defaultPrevented) return; // dragged
}

function sim_dragstarted(d) {
    d.startX = d3.event.sourceEvent.clientX;
    d.startY = d3.event.sourceEvent.clientY;

    // if rocks are greyed out from scoring, remove the no-score classes
    if (score_flag) {
        sim_rocks.forEach((e) => e.score = true)
        measures.forEach((e) => e.score = true)
        updateSimRocks(sim_rocks)
        updateMeasures(measures)
        score_flag = false;
    }
}

function sim_dragged(d) {
    var e = d3.select(this),
        dStartX = d.startX - d3.event.sourceEvent.clientX,
        dStartY = d.startY - d3.event.sourceEvent.clientY;

    if (dStartX * dStartX + dStartY * dStartY > CLICK_DISTANCE_2 &&
        !e.classed("active")) {

        e.raise().classed("active", true);
    }
    e.attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);

    if (rockInHouse(d)) {
        r = rockDist(d) - svg_rockradius
        // update radius or add measure circle around rock 
        if (measures.some(m => m.id == d.id)){
            measure = measures.find(m => m.id == d.id)
            measure.r = r
        } else {
            // add measure circles to data array
            measures.push({id: d.id, r: r, color: d.color, sitting:true, score: true})
        }
    } else {
        // remove measure circle
        measures = measures.filter(m => m.id != d.id)
    }

    // determine which rocks are sitting
    let order = sim_rocks.sort(scoreSort)
    let first = order[0]
    let first_nonscoring = find(order, r => r.color != first.color)
    order.forEach((e,i) => {
        if (rockInPlay(e)) {
            // darken rocks and measures that aren't sitting
            if (i >= first_nonscoring) {
                e.sitting = false
                if (rockInHouse(e)) {
                    m = find(measures, m => m.id == e.id)
                    measures[m].sitting = false
                }
            }
            else {
                // don't darken rocks and measures that are sitting
                e.sitting = rockInHouse(e)
                
                if (rockInHouse(e)) {
                    m = find(measures, m => m.id == e.id)
                    measures[m].sitting = true
                }
            }
        } else { // don't darken rocks that aren't in play
            e.sitting = true;
        }
    })

    
    updateSimRocks(order)
    updateMeasures(measures)
}

function sim_dragended(d) {
    const filter = (e) => e.id == d.id
    let i = sim_rocks.findIndex(filter)
    sim_rocks[i].x = d.x
    sim_rocks[i].y = d.y
    updateSimRocks(sim_rocks)
    d3.select(this).classed("active", false);
}

// ============================================================================
// CONTROLS
// ============================================================================

function resetRocks_click() {
    rocks = _.cloneDeep(reset)
    measures = []
    updateRocks(rocks)
    updateMeasures(measures)
}

function resetScore_click() {
    red_score = 0
    yellow_score = 0
    current_end = 1
    $(".tg1-end").find("span").remove()
    $(".tg2-score").text("")
}

function score_click() {
    let order = rocks.sort(scoreSort)
    let first = order[0]
    let first_nonscoring = find(order, r => r.color != first.color || !rockInHouse(r))

    // grey out rocks that are not scoring
    order.forEach((e,i) => {
        if (rockInPlay(e)) {
            if (i >= first_nonscoring) {
                m = find(measures, m => m.id == e.id)
                e.score = false
                if (rockInHouse(e)) {
                    measures[m].score = false
                }
            }
        }
    })
    
    let score = rockInPlay(first) ? first_nonscoring : 0

    if (score > 0) {
        // determine which team scored and increment scores
        var scoring_team = first.color
        let team_abbr = scoring_team.slice(0,3)
        if (scoring_team == "red") {
            red_score += score
        } else {
            yel_score += score
        }

        let club_selector = `#club_scoreboard #club_${team_abbr}${scoring_team == "red" ? red_score : yel_score}`
        let tv_selector = `#tv_scoreboard #tv_${team_abbr}${current_end}`

        // update club scoreboard
        $(club_selector).append(`<span class="club-score">${current_end}</span>`)
        // update tv scoreboard
        $(tv_selector).text(score)
        $(`#tv_scoreboard #tv_${team_abbr == "red" ? "yel" : "red"}${current_end}`).text(0)

        // let to_fade = `${club_selector}, ${tv_selector}`
        // $(to_fade).addClass("fade")
        // set



    } else { // blank end
        // update club scoreboard
        $(`#club_scoreboard #club_${hammer}16`).append(`<span class="blank">${current_end}</span>`)
        // update tv scoreboard
        $(`#tv_scoreboard #tv_red${current_end}`).text(score)
        $(`#tv_scoreboard #tv_yel${current_end}`).text(score)
    }

    $(`#tv_scoreboard #tv_redtotal`).text(red_score)
    $(`#tv_scoreboard #tv_yeltotal`).text(yel_score)

    let selector = ``
    
    score_flag = true;
    if (score == 0) {
        // hammer doesn't change
    } else {
        // set hammer to the team that didn't score
        hammer = scoring_team == "red" ? "yel" : "red";
    }
    current_end++;

    updateRocks(order)
    updateMeasures(measures)
}

function showMeasures_change() {
    check_showCircles()
}

var mode = 0
function switchModes_click() {
    // enter simulation mode
    if (mode == 0) {
        $("#newRock-div").show()
        // clear tutorial rocks
        updateRocks([])
        // add simulation rocks
        updateSimRocks(sim_rocks)
        updateMeasures()
        next_color = teams[hammer]
        mode = 1
    }
    // enter tutorial mode
    else {
        $("#newRock-div").hide()
        updateRocks(rocks)
        updateSimRocks([])
        // sim_rocks = []
        // simRock_id = 100
        mode = 0
    }
    updateMeasures(measures)
}

function newRock_click() {
    newSimRock()
    updateSimRocks(sim_rocks)
}

// ============================================================================
// TUTORIAL
// ============================================================================
var highlight_arr = [
    {class:".tut-help", selector:".help"},
    {class:".tut-rock", selector:".rock"},
    {class:".tut-hogline", selector:"line[name=hogline]"},
    {class:".tut-backline", selector:"line[name=backline]"},
    {class:".tut-tline", selector:"line[name=tline]"},
    {class:".tut-centerline", selector:"line[name=centerline]"},
    {class:".tut-house", selector:"circle.house"},
    {class:".tut-12", selector:"circle[name=twelve]"},
    {class:".tut-8", selector:"circle[name=eight]"},
    {class:".tut-4", selector:"circle[name=four]"},
    {class:".tut-8", selector:"circle[name=eight]"},
    {class:".tut-button", selector:"circle[name=button]"},
    {class:".tut-sit", selector:""},
    {class:".tut-reset", selector:".reset"},
    {class:".tut-score", selector:".score"},
    {class:".tut-scoreboard", selector:".scoreboard"},
    {class:".tut-measures", selector:".checkbox, .measure"},
]

highlight_arr.forEach(e => {
    $(e.class).on("mouseenter", function(){
        $(e.selector).addClass("highlight")
        $(e.class).addClass("highlight")
    });
    $(e.class).on("mouseleave", function(){
        $(e.selector).removeClass("highlight")
        $(e.class).removeClass("highlight")
    });
});

// pin 
$(".tut-pin").on("mouseenter", function(){
    $("circle[name=pin]").attr("r", .02)
    $(".tut-pin").addClass("highlight")
});
$(".tut-pin").on("mouseleave", function(){
    $("circle[name=pin]").attr("r", 0.00125)
    $(".tut-pin").removeClass("highlight")
});

// ============================================================================
// ERIC WANTED A PLACE TO WRITE HIS CODE
// ============================================================================

const rad_to_deg = d3.scaleLinear().domain([0, 2 * Math.PI]).range([0, 360])

var web_socket = null;

function setupWebSocket() {
    reset = function() {
        setTimeout(setupWebSocket, 1000);
    };
    web_socket = new WebSocket(`ws://${location.hostname}:5000`);
    web_socket.onerror = reset;
    web_socket.onclose = reset;
    web_socket.onopen = function() {
        console.log("Opened connection to server");
    }
}

setupWebSocket();

function simulate(still_rocks, toss, callback) {
    const request = new JSON_RPC.Request('run_simulation', [still_rocks, toss]);
    
    web_socket.onmessage = function(event) {
        const response = new JSON_RPC.parse(event.data);
        if(response.error) {
            console.log(response.error);
        } else {
            callback(response.result);
        }
        
        return true;
    };
    
    web_socket.send(request.toString());
}

const waypointColor = d3.scaleOrdinal(d3.schemeCategory10)

function updateTrajectories(trajects) {
    layerPi.selectAll(".trajectory")
        .data(Object.entries(trajects), d => d[0])
        .join("g")
            .attr("class", "trajectory")
            .attr("fill", d => waypointColor(d[0]))
        .selectAll(".waypoint")
        .data(d => d[1])
        .join(
            enter => enter.append("polygon")
                .attr("points", "0,0 -1,-1 -2,-1 0,1 2,-1 1,-1")
                .attr("class", "waypoint"),
            update => update,
            exit => exit.remove()
        )
            .attr("transform", 
                  d => `translate(${d.p[0]} ${sheet_length - d.p[1]})
                        scale(0.1)
                        rotate(${180-rad_to_deg(d.psi)})
                        `)
}

