// ============================================================================
//         CCCCCCCCCCCCCUUUUUUUU     UUUUUUUURRRRRRRRRRRRRRRRR   LLLLLLLLLLL             IIIIIIIIIINNNNNNNN        NNNNNNNN        GGGGGGGGGGGGG        SSSSSSSSSSSSSSS VVVVVVVV           VVVVVVVV      GGGGGGGGGGGGG
//      CCC::::::::::::CU::::::U     U::::::UR::::::::::::::::R  L:::::::::L             I::::::::IN:::::::N       N::::::N     GGG::::::::::::G      SS:::::::::::::::SV::::::V           V::::::V   GGG::::::::::::G
//    CC:::::::::::::::CU::::::U     U::::::UR::::::RRRRRR:::::R L:::::::::L             I::::::::IN::::::::N      N::::::N   GG:::::::::::::::G     S:::::SSSSSS::::::SV::::::V           V::::::V GG:::::::::::::::G
//   C:::::CCCCCCCC::::CUU:::::U     U:::::UURR:::::R     R:::::RLL:::::::LL             II::::::IIN:::::::::N     N::::::N  G:::::GGGGGGGG::::G     S:::::S     SSSSSSSV::::::V           V::::::VG:::::GGGGGGGG::::G
//  C:::::C       CCCCCC U:::::U     U:::::U   R::::R     R:::::R  L:::::L                 I::::I  N::::::::::N    N::::::N G:::::G       GGGGGG     S:::::S             V:::::V           V:::::VG:::::G       GGGGGG
// C:::::C               U:::::D     D:::::U   R::::R     R:::::R  L:::::L                 I::::I  N:::::::::::N   N::::::NG:::::G                   S:::::S              V:::::V         V:::::VG:::::G              
// C:::::C               U:::::D     D:::::U   R::::RRRRRR:::::R   L:::::L                 I::::I  N:::::::N::::N  N::::::NG:::::G                    S::::SSSS            V:::::V       V:::::V G:::::G              
// C:::::C               U:::::D     D:::::U   R:::::::::::::RR    L:::::L                 I::::I  N::::::N N::::N N::::::NG:::::G    GGGGGGGGGG       SS::::::SSSSS        V:::::V     V:::::V  G:::::G    GGGGGGGGGG
// C:::::C               U:::::D     D:::::U   R::::RRRRRR:::::R   L:::::L                 I::::I  N::::::N  N::::N:::::::NG:::::G    G::::::::G         SSS::::::::SS       V:::::V   V:::::V   G:::::G    G::::::::G
// C:::::C               U:::::D     D:::::U   R::::R     R:::::R  L:::::L                 I::::I  N::::::N   N:::::::::::NG:::::G    GGGGG::::G            SSSSSS::::S       V:::::V V:::::V    G:::::G    GGGGG::::G
// C:::::C               U:::::D     D:::::U   R::::R     R:::::R  L:::::L                 I::::I  N::::::N    N::::::::::NG:::::G        G::::G                 S:::::S       V:::::V:::::V     G:::::G        G::::G
//  C:::::C       CCCCCC U::::::U   U::::::U   R::::R     R:::::R  L:::::L         LLLLLL  I::::I  N::::::N     N:::::::::N G:::::G       G::::G                 S:::::S        V:::::::::V       G:::::G       G::::G
//   C:::::CCCCCCCC::::C U:::::::UUU:::::::U RR:::::R     R:::::RLL:::::::LLLLLLLLL:::::LII::::::IIN::::::N      N::::::::N  G:::::GGGGGGGG::::G     SSSSSSS     S:::::S         V:::::::V         G:::::GGGGGGGG::::G
//    CC:::::::::::::::C  UU:::::::::::::UU  R::::::R     R:::::RL::::::::::::::::::::::LI::::::::IN::::::N       N:::::::N   GG:::::::::::::::G     S::::::SSSSSS:::::S          V:::::V           GG:::::::::::::::G
//      CCC::::::::::::C    UU:::::::::UU    R::::::R     R:::::RL::::::::::::::::::::::LI::::::::IN::::::N        N::::::N     GGG::::::GGG:::G     S:::::::::::::::SS            V:::V              GGG::::::GGG:::G
//         CCCCCCCCCCCCC      UUUUUUUUU      RRRRRRRR     RRRRRRRLLLLLLLLLLLLLLLLLLLLLLLLIIIIIIIIIINNNNNNNN         NNNNNNN        GGGGGG   GGGG      SSSSSSSSSSSSSSS               VVV                  GGGGGG   GGGG
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
var rocksReset = _.cloneDeep(rocks)

var measures = []

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

layer3.append("text")
    .attr("id", "mode-label")
    .attr("class", "noh")
    .attr("x", pin.x)
    .attr("y", rockwidth)
    .attr("text-anchor", "middle")
    .attr("font-size", `${rockwidth}px`)
    .text("Tutorial Mode")

var bbox = $("#mode-label")[0].getBBox()
layer2.append("rect")
    .attr("id", "mode-background")
    .attr("x", pin.x - bbox.width*1.1 / 2)
    .attr("y", 0+bbox.height*0.1)
    .attr("width", bbox.width*1.1)
    .attr("height", bbox.height)
    .attr("fill", "lightgrey")

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


updateRocks(rocks);
$(function() {
    update_score();
});

// ----------------------------------------------------------------------------
// ##     ## ########  ########     ###    ######## ########    ######## ##     ## ##    ##  ######  ######## ####  #######  ##    ##  ######  
// ##     ## ##     ## ##     ##   ## ##      ##    ##          ##       ##     ## ###   ## ##    ##    ##     ##  ##     ## ###   ## ##    ## 
// ##     ## ##     ## ##     ##  ##   ##     ##    ##          ##       ##     ## ####  ## ##          ##     ##  ##     ## ####  ## ##       
// ##     ## ########  ##     ## ##     ##    ##    ######      ######   ##     ## ## ## ## ##          ##     ##  ##     ## ## ## ##  ######  
// ##     ## ##        ##     ## #########    ##    ##          ##       ##     ## ##  #### ##          ##     ##  ##     ## ##  ####       ## 
// ##     ## ##        ##     ## ##     ##    ##    ##          ##       ##     ## ##   ### ##    ##    ##     ##  ##     ## ##   ### ##    ## 
//  #######  ##        ########  ##     ##    ##    ########    ##        #######  ##    ##  ######     ##    ####  #######  ##    ##  ######  
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
            exit => {
                exit.remove()
                // .call(exit => exit
                //     .transition(t)
                //     .attr("cx", d => d.color == "red" ? rockwidth*-2 : width + rockwidth*2)
                //     .remove()
                // )
            }
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
    update_score()
    check_showCircles()
}

// ----------------------------------------------------------------------------
//  ######     ###    ##       ##       ########     ###     ######  ##    ##  ######  
// ##    ##   ## ##   ##       ##       ##     ##   ## ##   ##    ## ##   ##  ##    ## 
// ##        ##   ##  ##       ##       ##     ##  ##   ##  ##       ##  ##   ##       
// ##       ##     ## ##       ##       ########  ##     ## ##       #####     ######  
// ##       ######### ##       ##       ##     ## ######### ##       ##  ##         ## 
// ##    ## ##     ## ##       ##       ##     ## ##     ## ##    ## ##   ##  ##    ## 
//  ######  ##     ## ######## ######## ########  ##     ##  ######  ##    ##  ###### 
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

    manageMeasures(d)

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

// ============================================================================
// HHHHHHHHH     HHHHHHHHHEEEEEEEEEEEEEEEEEEEEEELLLLLLLLLLL             PPPPPPPPPPPPPPPPP   EEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRR      SSSSSSSSSSSSSSS 
// H:::::::H     H:::::::HE::::::::::::::::::::EL:::::::::L             P::::::::::::::::P  E::::::::::::::::::::ER::::::::::::::::R   SS:::::::::::::::S
// H:::::::H     H:::::::HE::::::::::::::::::::EL:::::::::L             P::::::PPPPPP:::::P E::::::::::::::::::::ER::::::RRRRRR:::::R S:::::SSSSSS::::::S
// HH::::::H     H::::::HHEE::::::EEEEEEEEE::::ELL:::::::LL             PP:::::P     P:::::PEE::::::EEEEEEEEE::::ERR:::::R     R:::::RS:::::S     SSSSSSS
//   H:::::H     H:::::H    E:::::E       EEEEEE  L:::::L                 P::::P     P:::::P  E:::::E       EEEEEE  R::::R     R:::::RS:::::S            
//   H:::::H     H:::::H    E:::::E               L:::::L                 P::::P     P:::::P  E:::::E               R::::R     R:::::RS:::::S            
//   H::::::HHHHH::::::H    E::::::EEEEEEEEEE     L:::::L                 P::::PPPPPP:::::P   E::::::EEEEEEEEEE     R::::RRRRRR:::::R  S::::SSSS         
//   H:::::::::::::::::H    E:::::::::::::::E     L:::::L                 P:::::::::::::PP    E:::::::::::::::E     R:::::::::::::RR    SS::::::SSSSS    
//   H:::::::::::::::::H    E:::::::::::::::E     L:::::L                 P::::PPPPPPPPP      E:::::::::::::::E     R::::RRRRRR:::::R     SSS::::::::SS  
//   H::::::HHHHH::::::H    E::::::EEEEEEEEEE     L:::::L                 P::::P              E::::::EEEEEEEEEE     R::::R     R:::::R       SSSSSS::::S 
//   H:::::H     H:::::H    E:::::E               L:::::L                 P::::P              E:::::E               R::::R     R:::::R            S:::::S
//   H:::::H     H:::::H    E:::::E       EEEEEE  L:::::L         LLLLLL  P::::P              E:::::E       EEEEEE  R::::R     R:::::R            S:::::S
// HH::::::H     H::::::HHEE::::::EEEEEEEE:::::ELL:::::::LLLLLLLLL:::::LPP::::::PP          EE::::::EEEEEEEE:::::ERR:::::R     R:::::RSSSSSSS     S:::::S
// H:::::::H     H:::::::HE::::::::::::::::::::EL::::::::::::::::::::::LP::::::::P          E::::::::::::::::::::ER::::::R     R:::::RS::::::SSSSSS:::::S
// H:::::::H     H:::::::HE::::::::::::::::::::EL::::::::::::::::::::::LP::::::::P          E::::::::::::::::::::ER::::::R     R:::::RS:::::::::::::::SS 
// HHHHHHHHH     HHHHHHHHHEEEEEEEEEEEEEEEEEEEEEELLLLLLLLLLLLLLLLLLLLLLLLPPPPPPPPPP          EEEEEEEEEEEEEEEEEEEEEERRRRRRRR     RRRRRRR SSSSSSSSSSSSSSS  
// ============================================================================

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
    $(".measure").each(function() {
        let test = $("#showMeasures")[0].checked && ((mode && $(this)[0].id < 0) || (!mode && !($(this)[0].id < 0)))
        if (test) {
            $(this).removeClass("hide-measure")
        } else {
            $(this).addClass("hide-measure")
        }
    })
}

function get_leftHanded() {
    return $("#leftHanded")[0].checked
}

function switchTeams(team) {
    return team == "red" ? "yellow" : "red"
}

function manageMeasures(rock) {
    if (rockInHouse(rock)) {
        r = rockDist(rock) - svg_rockradius
        // update radius or add measure circle around rock 
        if (measures.some(m => m.id == rock.id)){
            measure = measures.find(m => m.id == rock.id)
            measure.r = r
        } else {
            // add measure circles to data array
            measures.push({id: rock.id, r: r, color: rock.color, sitting:true, score: true})
        }
    } else {
        // remove measure circle
        measures = measures.filter(m => m.id != rock.id)
    }
}

function newSimRock(color) {
    let x = width/2 + (get_leftHanded() ? rockradius : -rockradius)
    let y = height - 2*svg_rockradius
    let id = simId_gen.next().value
    simRocks.push({x: x, y: y, color: color, id: id, sitting: true, score: true, new: true})
    let magnitude = get_weight()
    let arrow_x = magnitude*Math.sin(-get_angle())
    let arrow_y = magnitude*Math.cos(-get_angle())
    simArrow.push({
        x1: x, 
        y1: y, 
        x2: x - arrow_x,
        y2: y - arrow_y, 
        id: id,
    })
}

function getArrowCoords() {
    let x = width/2 + (get_leftHanded() ? rockradius : -rockradius)
    let y = height - 2*svg_rockradius
    let arrow_x = get_weight()*Math.sin(-get_angle())
    let arrow_y = get_weight()*Math.cos(-get_angle())
    return {x1:x, y1:y, x2:arrow_x, y2:arrow_y}
}

function* simId_generator() {
    id = -1
    while (true) {
        ids = simRocks.map(sr => sr.id)
        yield ids ? Math.min(... ids) - 1 : id
    }
}

const slider_to_curl = d3.scaleLinear().domain([0, 1]).range([-1, 1]);
function get_curl() {
    return slider_to_curl($("#curl").val());
}

const slider_to_weight = d3.scaleLinear().domain([0, 1000000]).range([2.3, 5]);
function get_weight() {
    return slider_to_weight($("#weight").val());
}

const slider_to_angle = d3.scaleLinear().domain([0, 1000000]).range([0.2, -0.2]);
function get_angle() {
    return slider_to_angle($("#angle").val());
}

function updateTimeSlider(final_time) {
    timeElement = $("#time");
    final_time = Math.floor(final_time*1000);
    if(timeElement.val() == timeElement.attr("max"))
    {
        timeElement.attr("max", final_time);
        timeElement.val(final_time);
    }
    else
    {
        timeElement.attr("max", final_time);
    }
}

function get_time() {
    return $("#time").val() / 1000.0;
}

const rad_to_deg = d3.scaleLinear().domain([0, 2 * Math.PI]).range([0, 360])

function update_score() {
    let order = mode ? simRocks.sort(scoreSort) : rocks.sort(scoreSort)
    console.log(order)
    if (!order.length) {
        return
    }
    let first = order[0]
    let first_nonscoring = find(order, r => r.color != first.color || !rockInHouse(r))

    let score = rockInPlay(first) ? first_nonscoring : 0

    if (score > 0) {
        // determine which team scored and increment scores
        var scoring_team = first.color
        let team_abbr = scoring_team.slice(0,3)


        let club_selector = `#club_scoreboard #club_${team_abbr}${scoring_team == "red" ? red_score+score : yel_score+score}`
        let tv_selector = `#tv_scoreboard #tv_${team_abbr}${current_end}`

        // update club scoreboard
        if ($(`#span${current_end}`).length) {
            $(`#club_scoreboard`).find(`#span${current_end}`).remove()
        }
        $(club_selector).append(`<span id="span${current_end}" class="club-score">${current_end}</span>`)
        // update tv scoreboard
        $(tv_selector).text(score)
        $(`#tv_scoreboard #tv_${team_abbr == "red" ? "yel" : "red"}${current_end}`).text(0)

        // let to_fade = `${club_selector}, ${tv_selector}`
        // $(to_fade).addClass("fade")
        // set



    } else { // blank end
        // update club scoreboard
        if ($(`#span${current_end}`).length) {
            $(`#club_scoreboard`).find(`#span${current_end}`).remove()
        }
        $(`#club_scoreboard #club_${hammer}16`).append(`<span id="span${current_end}" class="blank">${current_end}</span>`)
        // update tv scoreboard
        $(`#tv_scoreboard #tv_red${current_end}`).text(score)
        $(`#tv_scoreboard #tv_yel${current_end}`).text(score)
    }

    $(`#tv_scoreboard #tv_redtotal`).text(red_score+score)
    $(`#tv_scoreboard #tv_yeltotal`).text(yel_score+score)

    return {order:order, first:first, first_nonscoring:first_nonscoring, score:score}
}

// ============================================================================

//    SSSSSSSSSSSSSSS   iiii                                            lllllll                           tttt            iiii                                     
//  SS:::::::::::::::S i::::i                                           l:::::l                        ttt:::t           i::::i                                    
// S:::::SSSSSS::::::S  iiii                                            l:::::l                        t:::::t            iiii                                     
// S:::::S     SSSSSSS                                                  l:::::l                        t:::::t                                                     
// S:::::S            iiiiiii    mmmmmmm    mmmmmmm   uuuuuu    uuuuuu   l::::l   aaaaaaaaaaaaa  ttttttt:::::ttttttt    iiiiiii    ooooooooooo   nnnn  nnnnnnnn    
// S:::::S            i:::::i  mm:::::::m  m:::::::mm u::::u    u::::u   l::::l   a::::::::::::a t:::::::::::::::::t    i:::::i  oo:::::::::::oo n:::nn::::::::nn  
//  S::::SSSS          i::::i m::::::::::mm::::::::::mu::::u    u::::u   l::::l   aaaaaaaaa:::::at:::::::::::::::::t     i::::i o:::::::::::::::on::::::::::::::nn 
//   SS::::::SSSSS     i::::i m::::::::::::::::::::::mu::::u    u::::u   l::::l            a::::atttttt:::::::tttttt     i::::i o:::::ooooo:::::onn:::::::::::::::n
//     SSS::::::::SS   i::::i m:::::mmm::::::mmm:::::mu::::u    u::::u   l::::l     aaaaaaa:::::a      t:::::t           i::::i o::::o     o::::o  n:::::nnnn:::::n
//        SSSSSS::::S  i::::i m::::m   m::::m   m::::mu::::u    u::::u   l::::l   aa::::::::::::a      t:::::t           i::::i o::::o     o::::o  n::::n    n::::n
//             S:::::S i::::i m::::m   m::::m   m::::mu::::u    u::::u   l::::l  a::::aaaa::::::a      t:::::t           i::::i o::::o     o::::o  n::::n    n::::n
//             S:::::S i::::i m::::m   m::::m   m::::mu:::::uuuu:::::u   l::::l a::::a    a:::::a      t:::::t    tttttt i::::i o::::o     o::::o  n::::n    n::::n
// SSSSSSS     S:::::Si::::::im::::m   m::::m   m::::mu:::::::::::::::uul::::::la::::a    a:::::a      t::::::tttt:::::ti::::::io:::::ooooo:::::o  n::::n    n::::n
// S::::::SSSSSS:::::Si::::::im::::m   m::::m   m::::m u:::::::::::::::ul::::::la:::::aaaa::::::a      tt::::::::::::::ti::::::io:::::::::::::::o  n::::n    n::::n
// S:::::::::::::::SS i::::::im::::m   m::::m   m::::m  uu::::::::uu:::ul::::::l a::::::::::aa:::a       tt:::::::::::tti::::::i oo:::::::::::oo   n::::n    n::::n
//  SSSSSSSSSSSSSSS   iiiiiiiimmmmmm   mmmmmm   mmmmmm    uuuuuuuu  uuuullllllll  aaaaaaaaaa  aaaa         ttttttttttt  iiiiiiii   ooooooooooo     nnnnnn    nnnnnn

// ============================================================================



var teams = {"red":"red", "yel":"yellow"};
var simRocks = [];
var simId_gen = simId_generator()

var simArrow = [];

function getSimRock(id) {
    return simRocks.find(d => d.id == id);
}

function updateSimRocks(simRocks, rock_set="originalPositions") {
    const t = d3.transition()
        .duration(50);
    
    layer4.selectAll('.'+rock_set)
        .data(simRocks, d => d.id)
        .join(
            enter => {
                enter.append("circle")
                    .attr("class", d => `${rock_set} simRock ${d.color}${d.new ? "" : " new"}`)
                    .attr("name", d => d.name)
                    .attr("id", d => d.id)
                    .attr("r", rockradius)
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .style("stroke-width", rockoutline)
            },
            update => {
                update.call(update => update.transition(t)
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    // if rock is not sitting, add no-sit class (darkens rock); if not scoring, add no-score class (greys out rock)
                    .attr("class", d => `${rock_set} simRock ${d.color}${d.sitting ? "" : " no-sit"}${d.score ? "" : " no-score"}`)
                )
            },
            exit => {
                exit.remove()
                // .call(exit => exit
                //     .transition(t)
                //     .attr("cx", d => d.color == "red" ? rockwidth*-2 : width + rockwidth*2)
                //     .remove()
                // )
            }
        )
}

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

const trajectoryColor = d3.scaleOrdinal(d3.schemeCategory10);
const trajectoryLine = d3.line().x(d => d.p[0]).y(d => sheet_length - d.p[1]);

var currentTrajectData = null;

function updateTrajectories(traject_data) {
    flat_data = Object.entries(traject_data);
    
    positionWaypoints = d => {
        return d.attr("transform", 
            d => `translate(${d.p[0]} ${sheet_length - d.p[1]})
            scale(${0.03 + 0.07*d.v})
            rotate(${180-rad_to_deg(d.psi)})
            `);
    }
    
    layerPi.selectAll(".trajectory")
        .data(flat_data, d => d[0])
        .join("g")
            .attr("class", "trajectory")
            .attr("fill", d => trajectoryColor(d[0]))
        .selectAll(".waypoint")
        .data(d => d[1])
        .join(
            enter => enter.append("polygon")
                .attr("points", "0,0 -1,-1 -2,-1 0,1 2,-1 1,-1")
                .attr("class", "waypoint")
                .call(positionWaypoints),
            update => update
                .transition().duration(50)
                .call(positionWaypoints),
            exit => exit.remove()
        );
    
    layerPi.selectAll("path")
        .data(flat_data, d => d[0])
        .join("path")
            .attr("class", "trajectory")
            .attr("stroke", d => trajectoryColor(d[0]))
        .transition().duration(50)
            .attr("d", d => trajectoryLine(d[1]));
}

function findRockData(traject, t) {
    // binary search
    let a = 0, b = traject.length-1;
    
    while(a != b-1)
    {
        const m = Math.floor((a+b)/2);
        if(t > traject[m].t)
        {
            a = m;
        }
        else
        {
            b = m;
        }
    }
    
    const scaled_t = d3.scaleLinear().domain([traject[a].t, traject[b].t]).clamp(true)(t);
    const xInterpolate = d3.scaleLinear().range([traject[a].p[0], traject[b].p[0]]);
    const yInterpolate = d3.scaleLinear().range([traject[a].p[1], traject[b].p[1]]);
    
    return {x: xInterpolate(scaled_t), y: sheet_length - yInterpolate(scaled_t)};
}

function updateProjectedSimRocks(traject_data, t) {
    projectedRocks = Object.entries(traject_data).map(d => { return {
        id: d[0],
        ...getSimRock(d[0]), // Copy remaining properties from original rock
        ...findRockData(d[1], t)  // Interpolate Position info
    }});
    
    updateSimRocks(projectedRocks, "simulatedRocks");
}

var onSimParameterChange_lock = 0;
function onSimParameterChange()
{
    if(onSimParameterChange_lock++)
        return;
    
    still_rocks = Object.fromEntries(
        simRocks.filter(d => !d.new)
                .map(d => [d.id, [d.x, sheet_length - d.y]]));
    
    toss_rock = simRocks.find(d => d.new);
    toss = {
        id: toss_rock.id,
        p0: [toss_rock.x, 0],
        v0: get_weight(),
        psi0: get_angle(),
        curl: get_curl()
    };
    
    simulate(still_rocks, toss, function(trajects) {
        currentTrajectData = trajects;
        updateTrajectories(trajects);
        
        updateTimeSlider(d3.max(Object.values(trajects).map(d => d[d.length-1].t)));
        
        updateProjectedSimRocks(currentTrajectData, get_time());
        
        if(--onSimParameterChange_lock)
        {
            onSimParameterChange_lock = 0;
            onSimParameterChange();
        }
    });
}

function onTimeChange() {
    updateProjectedSimRocks(currentTrajectData, get_time());
}

function updateSimArrow(simArrow) {
    const t = d3.transition()
        .duration(100);

    layer3.selectAll(".arrow")
        .data(simArrow, d => d.id)
        .join(
            enter => {
                enter.append("line")
                    .attr("class", "line")
                    .attr("x1", d => d.x1)
                    .attr("y1", d => d.y1)
                    .attr("x2", d => d.x2)
                    .attr("y2", d => d.y2)
                    .attr("id", d => d.id)
                    .style("stroke-width", linewidth)
            }
        )
}

// ============================================================================

//         CCCCCCCCCCCCC     OOOOOOOOO     NNNNNNNN        NNNNNNNNTTTTTTTTTTTTTTTTTTTTTTTRRRRRRRRRRRRRRRRR        OOOOOOOOO     LLLLLLLLLLL                SSSSSSSSSSSSSSS 
//      CCC::::::::::::C   OO:::::::::OO   N:::::::N       N::::::NT:::::::::::::::::::::TR::::::::::::::::R     OO:::::::::OO   L:::::::::L              SS:::::::::::::::S
//    CC:::::::::::::::C OO:::::::::::::OO N::::::::N      N::::::NT:::::::::::::::::::::TR::::::RRRRRR:::::R  OO:::::::::::::OO L:::::::::L             S:::::SSSSSS::::::S
//   C:::::CCCCCCCC::::CO:::::::OOO:::::::ON:::::::::N     N::::::NT:::::TT:::::::TT:::::TRR:::::R     R:::::RO:::::::OOO:::::::OLL:::::::LL             S:::::S     SSSSSSS
//  C:::::C       CCCCCCO::::::O   O::::::ON::::::::::N    N::::::NTTTTTT  T:::::T  TTTTTT  R::::R     R:::::RO::::::O   O::::::O  L:::::L               S:::::S            
// C:::::C              O:::::O     O:::::ON:::::::::::N   N::::::N        T:::::T          R::::R     R:::::RO:::::O     O:::::O  L:::::L               S:::::S            
// C:::::C              O:::::O     O:::::ON:::::::N::::N  N::::::N        T:::::T          R::::RRRRRR:::::R O:::::O     O:::::O  L:::::L                S::::SSSS         
// C:::::C              O:::::O     O:::::ON::::::N N::::N N::::::N        T:::::T          R:::::::::::::RR  O:::::O     O:::::O  L:::::L                 SS::::::SSSSS    
// C:::::C              O:::::O     O:::::ON::::::N  N::::N:::::::N        T:::::T          R::::RRRRRR:::::R O:::::O     O:::::O  L:::::L                   SSS::::::::SS  
// C:::::C              O:::::O     O:::::ON::::::N   N:::::::::::N        T:::::T          R::::R     R:::::RO:::::O     O:::::O  L:::::L                      SSSSSS::::S 
// C:::::C              O:::::O     O:::::ON::::::N    N::::::::::N        T:::::T          R::::R     R:::::RO:::::O     O:::::O  L:::::L                           S:::::S
//  C:::::C       CCCCCCO::::::O   O::::::ON::::::N     N:::::::::N        T:::::T          R::::R     R:::::RO::::::O   O::::::O  L:::::L         LLLLLL            S:::::S
//   C:::::CCCCCCCC::::CO:::::::OOO:::::::ON::::::N      N::::::::N      TT:::::::TT      RR:::::R     R:::::RO:::::::OOO:::::::OLL:::::::LLLLLLLLL:::::LSSSSSSS     S:::::S
//    CC:::::::::::::::C OO:::::::::::::OO N::::::N       N:::::::N      T:::::::::T      R::::::R     R:::::R OO:::::::::::::OO L::::::::::::::::::::::LS::::::SSSSSS:::::S
//      CCC::::::::::::C   OO:::::::::OO   N::::::N        N::::::N      T:::::::::T      R::::::R     R:::::R   OO:::::::::OO   L::::::::::::::::::::::LS:::::::::::::::SS 
//         CCCCCCCCCCCCC     OOOOOOOOO     NNNNNNNN         NNNNNNN      TTTTTTTTTTT      RRRRRRRR     RRRRRRR     OOOOOOOOO     LLLLLLLLLLLLLLLLLLLLLLLL SSSSSSSSSSSSSSS   

// ============================================================================

function resetRocks_click() {
    rocks = _.cloneDeep(rocksReset)
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
    const {order, first, first_nonscoring, score} = update_score()
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

    if (score > 0) {
        if (first.color == "red") {
            red_score += score
        } else {
            yel_score += score
        }
    }
    
    
    if (score == 0) {
        // hammer doesn't change
    } else {
        // set hammer to the team that didn't score
        hammer = first.color == "red" ? "yel" : "red";
    }
    current_end++;

    score_flag = true;
    updateRocks(order)
    updateMeasures(measures)
}

function showMeasures_change() {
    check_showCircles()
}

var mode = 0
function switchModes_click() {
    //enter simulation mode
    if (mode == 0) {
        $("#simControl-div").show()
        $("#resetButton").prop("disabled", true)
        // update mode text
        $("#mode-label").text("Simulation Mode")
        let bbox = $("#mode-label")[0].getBBox()
        $("#mode-background")
            .attr("x", pin.x - bbox.width*1.1 / 2)
            .attr("y", 0+bbox.height*0.1)
            .attr("width", bbox.width*1.1)
            .attr("height", bbox.height)
        // clear tutorial rocks
        updateRocks([])
        // copy or update rocks to simRocks
        let rocks_copy = _.cloneDeep(rocks)
        rocks_copy.forEach(r => {
            if (rockInPlay(r)) {
                r.id = -r.id
                i = simRocks.findIndex(sr => sr.id == r.id)
                if (i >= 0) {
                    simRocks[i] = r
                } else {
                    simRocks.push(r)
                } 
            } 
        })
        
        updateSimRocks(simRocks)
        simRocks.forEach(sr => manageMeasures(sr))
        // updateMeasures()
        next_color = teams[hammer]
        mode = 1
    }
    // enter tutorial mode
    else {
        $("#simControl-div").hide()
        $("#resetButton").prop("disabled", false)
        // update mode text
        $("#mode-label").text("Tutorial Mode")
        let bbox = $("#mode-label")[0].getBBox()
        $("#mode-background")
            .attr("x", pin.x - bbox.width*1.1 / 2)
            .attr("y", 0+bbox.height*0.1)
            .attr("width", bbox.width*1.1)
            .attr("height", bbox.height)
        //clear simulation rocks
        updateSimRocks([])
        // copy or update simRocks to rocks
        let simRocks_copy = _.cloneDeep(simRocks)
        simRocks_copy.forEach(r => {
            r.id = -r.id
            i = rocks.findIndex(sr => sr.id == r.id)
            if (i >= 0) {
                rocks[i] = r
            } else {
                rocks.push(r)
            }
        })

        updateRocks(rocks)
        rocks.forEach(r => manageMeasures(r))

        mode = 0
    }
    updateMeasures(measures)
}

function newRock_click(color) {
    $("#newRed").prop("disabled", true)
    $("#newYel").prop("disabled", true)
    newSimRock(color)
    updateSimRocks(simRocks)
    updateSimArrow(simArrow)
}

function throwRock_click() {
    $("#newRed").prop("disabled", false)
    $("#newYel").prop("disabled", false)
    $(".new").removeClass("new")
}

function leftHanded_change() {
    let i = simRocks.findIndex(sr => sr.new)
    simRocks[i].x = width/2 + (get_leftHanded() ? rockradius : -rockradius)
    updateSimRocks(simRocks)

}

$(".simparam").on("input", onSimParameterChange);
$("#time").on("input", onTimeChange);

// ============================================================================
// TTTTTTTTTTTTTTTTTTTTTTTUUUUUUUU     UUUUUUUUTTTTTTTTTTTTTTTTTTTTTTT     OOOOOOOOO     RRRRRRRRRRRRRRRRR   IIIIIIIIII               AAA               LLLLLLLLLLL             
// T:::::::::::::::::::::TU::::::U     U::::::UT:::::::::::::::::::::T   OO:::::::::OO   R::::::::::::::::R  I::::::::I              A:::A              L:::::::::L             
// T:::::::::::::::::::::TU::::::U     U::::::UT:::::::::::::::::::::T OO:::::::::::::OO R::::::RRRRRR:::::R I::::::::I             A:::::A             L:::::::::L             
// T:::::TT:::::::TT:::::TUU:::::U     U:::::UUT:::::TT:::::::TT:::::TO:::::::OOO:::::::ORR:::::R     R:::::RII::::::II            A:::::::A            LL:::::::LL             
// TTTTTT  T:::::T  TTTTTT U:::::U     U:::::U TTTTTT  T:::::T  TTTTTTO::::::O   O::::::O  R::::R     R:::::R  I::::I             A:::::::::A             L:::::L               
//         T:::::T         U:::::D     D:::::U         T:::::T        O:::::O     O:::::O  R::::R     R:::::R  I::::I            A:::::A:::::A            L:::::L               
//         T:::::T         U:::::D     D:::::U         T:::::T        O:::::O     O:::::O  R::::RRRRRR:::::R   I::::I           A:::::A A:::::A           L:::::L               
//         T:::::T         U:::::D     D:::::U         T:::::T        O:::::O     O:::::O  R:::::::::::::RR    I::::I          A:::::A   A:::::A          L:::::L               
//         T:::::T         U:::::D     D:::::U         T:::::T        O:::::O     O:::::O  R::::RRRRRR:::::R   I::::I         A:::::A     A:::::A         L:::::L               
//         T:::::T         U:::::D     D:::::U         T:::::T        O:::::O     O:::::O  R::::R     R:::::R  I::::I        A:::::AAAAAAAAA:::::A        L:::::L               
//         T:::::T         U:::::D     D:::::U         T:::::T        O:::::O     O:::::O  R::::R     R:::::R  I::::I       A:::::::::::::::::::::A       L:::::L               
//         T:::::T         U::::::U   U::::::U         T:::::T        O::::::O   O::::::O  R::::R     R:::::R  I::::I      A:::::AAAAAAAAAAAAA:::::A      L:::::L         LLLLLL
//       TT:::::::TT       U:::::::UUU:::::::U       TT:::::::TT      O:::::::OOO:::::::ORR:::::R     R:::::RII::::::II   A:::::A             A:::::A   LL:::::::LLLLLLLLL:::::L
//       T:::::::::T        UU:::::::::::::UU        T:::::::::T       OO:::::::::::::OO R::::::R     R:::::RI::::::::I  A:::::A               A:::::A  L::::::::::::::::::::::L
//       T:::::::::T          UU:::::::::UU          T:::::::::T         OO:::::::::OO   R::::::R     R:::::RI::::::::I A:::::A                 A:::::A L::::::::::::::::::::::L
//       TTTTTTTTTTT            UUUUUUUUU            TTTTTTTTTTT           OOOOOOOOO     RRRRRRRR     RRRRRRRIIIIIIIIIIAAAAAAA                   AAAAAAALLLLLLLLLLLLLLLLLLLLLLLL
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

// EEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRR   IIIIIIIIII      CCCCCCCCCCCCC     WWWWWWWW                           WWWWWWWW   AAA               NNNNNNNN        NNNNNNNNTTTTTTTTTTTTTTTTTTTTTTTEEEEEEEEEEEEEEEEEEEEEEDDDDDDDDDDDDD                            AAA                    PPPPPPPPPPPPPPPPP   LLLLLLLLLLL                            AAA                  CCCCCCCCCCCCCEEEEEEEEEEEEEEEEEEEEEE     TTTTTTTTTTTTTTTTTTTTTTT     OOOOOOOOO          WWWWWWWW                           WWWWWWWWRRRRRRRRRRRRRRRRR   IIIIIIIIIITTTTTTTTTTTTTTTTTTTTTTTEEEEEEEEEEEEEEEEEEEEEE     HHHHHHHHH     HHHHHHHHHIIIIIIIIII   SSSSSSSSSSSSSSS              CCCCCCCCCCCCC     OOOOOOOOO     DDDDDDDDDDDDD      EEEEEEEEEEEEEEEEEEEEEE
// E::::::::::::::::::::ER::::::::::::::::R  I::::::::I   CCC::::::::::::C     W::::::W                           W::::::W  A:::A              N:::::::N       N::::::NT:::::::::::::::::::::TE::::::::::::::::::::ED::::::::::::DDD                        A:::A                   P::::::::::::::::P  L:::::::::L                           A:::A              CCC::::::::::::CE::::::::::::::::::::E     T:::::::::::::::::::::T   OO:::::::::OO        W::::::W                           W::::::WR::::::::::::::::R  I::::::::IT:::::::::::::::::::::TE::::::::::::::::::::E     H:::::::H     H:::::::HI::::::::I SS:::::::::::::::S          CCC::::::::::::C   OO:::::::::OO   D::::::::::::DDD   E::::::::::::::::::::E
// E::::::::::::::::::::ER::::::RRRRRR:::::R I::::::::I CC:::::::::::::::C     W::::::W                           W::::::W A:::::A             N::::::::N      N::::::NT:::::::::::::::::::::TE::::::::::::::::::::ED:::::::::::::::DD                     A:::::A                  P::::::PPPPPP:::::P L:::::::::L                          A:::::A           CC:::::::::::::::CE::::::::::::::::::::E     T:::::::::::::::::::::T OO:::::::::::::OO      W::::::W                           W::::::WR::::::RRRRRR:::::R I::::::::IT:::::::::::::::::::::TE::::::::::::::::::::E     H:::::::H     H:::::::HI::::::::IS:::::SSSSSS::::::S        CC:::::::::::::::C OO:::::::::::::OO D:::::::::::::::DD E::::::::::::::::::::E
// EE::::::EEEEEEEEE::::ERR:::::R     R:::::RII::::::IIC:::::CCCCCCCC::::C     W::::::W                           W::::::WA:::::::A            N:::::::::N     N::::::NT:::::TT:::::::TT:::::TEE::::::EEEEEEEEE::::EDDD:::::DDDDD:::::D                   A:::::::A                 PP:::::P     P:::::PLL:::::::LL                         A:::::::A         C:::::CCCCCCCC::::CEE::::::EEEEEEEEE::::E     T:::::TT:::::::TT:::::TO:::::::OOO:::::::O     W::::::W                           W::::::WRR:::::R     R:::::RII::::::IIT:::::TT:::::::TT:::::TEE::::::EEEEEEEEE::::E     HH::::::H     H::::::HHII::::::IIS:::::S     SSSSSSS       C:::::CCCCCCCC::::CO:::::::OOO:::::::ODDD:::::DDDDD:::::DEE::::::EEEEEEEEE::::E
//   E:::::E       EEEEEE  R::::R     R:::::R  I::::I C:::::C       CCCCCC      W:::::W           WWWWW           W:::::WA:::::::::A           N::::::::::N    N::::::NTTTTTT  T:::::T  TTTTTT  E:::::E       EEEEEE  D:::::D    D:::::D                 A:::::::::A                  P::::P     P:::::P  L:::::L                          A:::::::::A       C:::::C       CCCCCC  E:::::E       EEEEEE     TTTTTT  T:::::T  TTTTTTO::::::O   O::::::O      W:::::W           WWWWW           W:::::W   R::::R     R:::::R  I::::I  TTTTTT  T:::::T  TTTTTT  E:::::E       EEEEEE       H:::::H     H:::::H    I::::I  S:::::S                  C:::::C       CCCCCCO::::::O   O::::::O  D:::::D    D:::::D E:::::E       EEEEEE
//   E:::::E               R::::R     R:::::R  I::::IC:::::C                     W:::::W         W:::::W         W:::::WA:::::A:::::A          N:::::::::::N   N::::::N        T:::::T          E:::::E               D:::::D     D:::::D               A:::::A:::::A                 P::::P     P:::::P  L:::::L                         A:::::A:::::A     C:::::C                E:::::E                          T:::::T        O:::::O     O:::::O       W:::::W         W:::::W         W:::::W    R::::R     R:::::R  I::::I          T:::::T          E:::::E                    H:::::H     H:::::H    I::::I  S:::::S                 C:::::C              O:::::O     O:::::O  D:::::D     D:::::DE:::::E             
//   E::::::EEEEEEEEEE     R::::RRRRRR:::::R   I::::IC:::::C                      W:::::W       W:::::::W       W:::::WA:::::A A:::::A         N:::::::N::::N  N::::::N        T:::::T          E::::::EEEEEEEEEE     D:::::D     D:::::D              A:::::A A:::::A                P::::PPPPPP:::::P   L:::::L                        A:::::A A:::::A    C:::::C                E::::::EEEEEEEEEE                T:::::T        O:::::O     O:::::O        W:::::W       W:::::::W       W:::::W     R::::RRRRRR:::::R   I::::I          T:::::T          E::::::EEEEEEEEEE          H::::::HHHHH::::::H    I::::I   S::::SSSS              C:::::C              O:::::O     O:::::O  D:::::D     D:::::DE::::::EEEEEEEEEE   
//   E:::::::::::::::E     R:::::::::::::RR    I::::IC:::::C                       W:::::W     W:::::::::W     W:::::WA:::::A   A:::::A        N::::::N N::::N N::::::N        T:::::T          E:::::::::::::::E     D:::::D     D:::::D             A:::::A   A:::::A               P:::::::::::::PP    L:::::L                       A:::::A   A:::::A   C:::::C                E:::::::::::::::E                T:::::T        O:::::O     O:::::O         W:::::W     W:::::::::W     W:::::W      R:::::::::::::RR    I::::I          T:::::T          E:::::::::::::::E          H:::::::::::::::::H    I::::I    SS::::::SSSSS         C:::::C              O:::::O     O:::::O  D:::::D     D:::::DE:::::::::::::::E   
//   E:::::::::::::::E     R::::RRRRRR:::::R   I::::IC:::::C                        W:::::W   W:::::W:::::W   W:::::WA:::::A     A:::::A       N::::::N  N::::N:::::::N        T:::::T          E:::::::::::::::E     D:::::D     D:::::D            A:::::A     A:::::A              P::::PPPPPPPPP      L:::::L                      A:::::A     A:::::A  C:::::C                E:::::::::::::::E                T:::::T        O:::::O     O:::::O          W:::::W   W:::::W:::::W   W:::::W       R::::RRRRRR:::::R   I::::I          T:::::T          E:::::::::::::::E          H:::::::::::::::::H    I::::I      SSS::::::::SS       C:::::C              O:::::O     O:::::O  D:::::D     D:::::DE:::::::::::::::E   
//   E::::::EEEEEEEEEE     R::::R     R:::::R  I::::IC:::::C                         W:::::W W:::::W W:::::W W:::::WA:::::AAAAAAAAA:::::A      N::::::N   N:::::::::::N        T:::::T          E::::::EEEEEEEEEE     D:::::D     D:::::D           A:::::AAAAAAAAA:::::A             P::::P              L:::::L                     A:::::AAAAAAAAA:::::A C:::::C                E::::::EEEEEEEEEE                T:::::T        O:::::O     O:::::O           W:::::W W:::::W W:::::W W:::::W        R::::R     R:::::R  I::::I          T:::::T          E::::::EEEEEEEEEE          H::::::HHHHH::::::H    I::::I         SSSSSS::::S      C:::::C              O:::::O     O:::::O  D:::::D     D:::::DE::::::EEEEEEEEEE   
//   E:::::E               R::::R     R:::::R  I::::IC:::::C                          W:::::W:::::W   W:::::W:::::WA:::::::::::::::::::::A     N::::::N    N::::::::::N        T:::::T          E:::::E               D:::::D     D:::::D          A:::::::::::::::::::::A            P::::P              L:::::L                    A:::::::::::::::::::::AC:::::C                E:::::E                          T:::::T        O:::::O     O:::::O            W:::::W:::::W   W:::::W:::::W         R::::R     R:::::R  I::::I          T:::::T          E:::::E                    H:::::H     H:::::H    I::::I              S:::::S     C:::::C              O:::::O     O:::::O  D:::::D     D:::::DE:::::E             
//   E:::::E       EEEEEE  R::::R     R:::::R  I::::I C:::::C       CCCCCC             W:::::::::W     W:::::::::WA:::::AAAAAAAAAAAAA:::::A    N::::::N     N:::::::::N        T:::::T          E:::::E       EEEEEE  D:::::D    D:::::D          A:::::AAAAAAAAAAAAA:::::A           P::::P              L:::::L         LLLLLL    A:::::AAAAAAAAAAAAA:::::AC:::::C       CCCCCC  E:::::E       EEEEEE             T:::::T        O::::::O   O::::::O             W:::::::::W     W:::::::::W          R::::R     R:::::R  I::::I          T:::::T          E:::::E       EEEEEE       H:::::H     H:::::H    I::::I              S:::::S      C:::::C       CCCCCCO::::::O   O::::::O  D:::::D    D:::::D E:::::E       EEEEEE
// EE::::::EEEEEEEE:::::ERR:::::R     R:::::RII::::::IIC:::::CCCCCCCC::::C              W:::::::W       W:::::::WA:::::A             A:::::A   N::::::N      N::::::::N      TT:::::::TT      EE::::::EEEEEEEE:::::EDDD:::::DDDDD:::::D          A:::::A             A:::::A        PP::::::PP          LL:::::::LLLLLLLLL:::::L   A:::::A             A:::::AC:::::CCCCCCCC::::CEE::::::EEEEEEEE:::::E           TT:::::::TT      O:::::::OOO:::::::O              W:::::::W       W:::::::W         RR:::::R     R:::::RII::::::II      TT:::::::TT      EE::::::EEEEEEEE:::::E     HH::::::H     H::::::HHII::::::IISSSSSSS     S:::::S       C:::::CCCCCCCC::::CO:::::::OOO:::::::ODDD:::::DDDDD:::::DEE::::::EEEEEEEE:::::E
// E::::::::::::::::::::ER::::::R     R:::::RI::::::::I CC:::::::::::::::C               W:::::W         W:::::WA:::::A               A:::::A  N::::::N       N:::::::N      T:::::::::T      E::::::::::::::::::::ED:::::::::::::::DD          A:::::A               A:::::A       P::::::::P          L::::::::::::::::::::::L  A:::::A               A:::::ACC:::::::::::::::CE::::::::::::::::::::E           T:::::::::T       OO:::::::::::::OO                W:::::W         W:::::W          R::::::R     R:::::RI::::::::I      T:::::::::T      E::::::::::::::::::::E     H:::::::H     H:::::::HI::::::::IS::::::SSSSSS:::::S        CC:::::::::::::::C OO:::::::::::::OO D:::::::::::::::DD E::::::::::::::::::::E
// E::::::::::::::::::::ER::::::R     R:::::RI::::::::I   CCC::::::::::::C                W:::W           W:::WA:::::A                 A:::::A N::::::N        N::::::N      T:::::::::T      E::::::::::::::::::::ED::::::::::::DDD           A:::::A                 A:::::A      P::::::::P          L::::::::::::::::::::::L A:::::A                 A:::::A CCC::::::::::::CE::::::::::::::::::::E           T:::::::::T         OO:::::::::OO                   W:::W           W:::W           R::::::R     R:::::RI::::::::I      T:::::::::T      E::::::::::::::::::::E     H:::::::H     H:::::::HI::::::::IS:::::::::::::::SS           CCC::::::::::::C   OO:::::::::OO   D::::::::::::DDD   E::::::::::::::::::::E
// EEEEEEEEEEEEEEEEEEEEEERRRRRRRR     RRRRRRRIIIIIIIIII      CCCCCCCCCCCCC                 WWW             WWWAAAAAAA                   AAAAAAANNNNNNNN         NNNNNNN      TTTTTTTTTTT      EEEEEEEEEEEEEEEEEEEEEEDDDDDDDDDDDDD             AAAAAAA                   AAAAAAA     PPPPPPPPPP          LLLLLLLLLLLLLLLLLLLLLLLLAAAAAAA                   AAAAAAA   CCCCCCCCCCCCCEEEEEEEEEEEEEEEEEEEEEE           TTTTTTTTTTT           OOOOOOOOO                      WWW             WWW            RRRRRRRR     RRRRRRRIIIIIIIIII      TTTTTTTTTTT      EEEEEEEEEEEEEEEEEEEEEE     HHHHHHHHH     HHHHHHHHHIIIIIIIIII SSSSSSSSSSSSSSS                CCCCCCCCCCCCC     OOOOOOOOO     DDDDDDDDDDDDD      EEEEEEEEEEEEEEEEEEEEEE

// ============================================================================
// ERIC WANTED A PLACE TO WRITE HIS CODE
// ============================================================================

// :)
