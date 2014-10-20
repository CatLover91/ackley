var math = require('mathjs');
function ackley(x, y) { // global minimum of -22.718 ish at (0,0)
    // -20exp(-0.2sqrt(0.5(x^2 + y^2))) - exp(0.5(cos(2PIx) + cos(2PIy)))
    var sum1 = 0.5 * math.pow(x, 2) + math.pow(y, 2);
    sum1 = -0.2 * math.sqrt(sum1);
    sum1 = -20 * math.pow(math.E, sum1);
    var sum2 = 0.5 * (math.cos(y * 2 * math.PI) + math.cos(x * 2 * math.PI));
    sum2 = math.pow(math.E, sum2);
    return sum1 - sum2;
    //return (-20 * math.pow(math.E, (-0.2 * math.sqrt(0.5 * (math.pow(x, 2) + math.pow(y, 2)))))) - (math.pow(math.E, (0.5 * math.cos(y * 2 * math.PI))));
}

function booth(x, y) { // global minimum of 0 at (1,3)
    //(x+2y-7)^2 + (2x+y-5)^2
    return (math.pow((x + (2*y) - 7), 2) + math.pow(((2*x)+y-5), 2));
}

//console.log(booth(1,3).toString()); //booth checker
//console.log(ackley(0, 0).toString()); //ackley checker
//console.log("intended: " + (-20 - math.E).toString()); //actualy ackley min for float check

function hillclimb() {
    var newx, newy;
    var runnum = 0;
    var result = [];
    while(runnum !== 100) {
        var x = (math.random() * 10) - 5; //initialize variables between -5 and 5 for ackleys
        var y = (math.random() * 10) - 5;
        var stepnum = 0;        
        var current = ackley(x, y);
        console.log("Starting hillclimb at position: (" + x + ", " + y +") := " + current);
        while(stepnum !== 100) {
            newx = (math.random() - 0.5) * 0.1 + x;
            newy = (math.random() - 0.5) * 0.1 + y;
            if(ackley(newx, newy) < current) {
                current = ackley(newx, newy);
                x = newx;
                y = newy;
                console.log("Run " + runnum +", step " + stepnum + ": (" + x + ", " + y +") := " + current);
                stepnum = 0;
            } else {
                stepnum = stepnum + 1;
                console.log("Run " + runnum +", step " + stepnum + ": (" + x + ", " + y +") := " + current);
            }
        }
        runnum = runnum + 1;
        result.push(current);
    }
    return result;
}

function anneal() {
    var newx, newy;
    var runnum = 0;
    var result = [];
    while(runnum !== 100) {
        var x = (math.random() * 10) - 5; //initialize variables between -5 and 5 for ackleys
        var y = (math.random() * 10) - 5;
        var stepnum = 0;
        var k = 10.0;
        var current = ackley(x, y);
        console.log("Starting simulated anneal at position: (" + x + ", " + y +"), temp: " + k + ", := " + current);
        while(stepnum !== 100) {
            newx = (math.random() - 0.5) * 0.4 + x;
            newy = (math.random() - 0.5) * 0.4 + y;
            if(ackley(newx, newy) < current) {
                current = ackley(newx, newy);
                x = newx;
                y = newy;
                console.log("Run " + runnum +", step " + stepnum + ": (" + x + ", " + y +"), temp: " + k + ", := " + current);
                stepnum = 0;
            } else if((math.pow(math.E, ((ackley(newx, newy) - current) / k))) < math.random()) {
                current = ackley(newx, newy);
                x = newx;
                y = newy;
                console.log("Run " + runnum +", step " + stepnum + ": (" + x + ", " + y +"), temp: " + k + ", := " + current);
                stepnum = 0;
            } else {
                stepnum = stepnum + 1;
                console.log("Run " + runnum +", step " + stepnum + ": (" + x + ", " + y +") := " + current);
            }
            if(k > 1.0) {
                k = k - 0.1;
            }
        }
        
        runnum = runnum + 1;
        result.push(current);
    }
    return result;
}
/*Initialize parameters np, nc, F, and CR
Initialize population 𝑿_(𝒋,𝒊)^((𝟏)), j = 1, …, d, i = 1, …, np
For k = 1 to nc
	𝑿^((𝟎))=𝑿^((𝟏))
	For i = 1 to np
		Generate integer random numbers r0, r1, r2{1, …, np} while r0 ≠ r1 		≠ r2 ≠ i
		Compute the mutant vector 𝑽=𝑿_𝒓𝟎^((𝟎))+𝑭(𝑿_𝒓𝟏^((𝟎) )−𝑿_𝒓𝟐^((𝟎) ))
		For j = 1 to d
			generate a uniform random number u from [0, 1)
			if u < CR then 𝑼_𝒋=𝑽_𝒋 else 𝑼_𝒋=𝑿_(𝒋,𝒊)^((𝟎))
		End for
	if 𝒇(𝑼)<𝒇(𝑿_𝒊^((𝟎) )) then 𝑿_𝒊^((𝟏) )=𝑼 else 𝑿_𝒊^((𝟏) )=𝑿_𝒊^((𝟎) )
	End for
End for*/

function difevo() {
    var agents = []; // Np
    var result = [];
    for(var i = 0; i < 40; i++) { //initialize this amount of agents. Must be divisible by 2 as agents take 2 array locations as an x and y. 20 Agents are chosen here
        agents.push((math.random() * 10) - 5);
    }
    var stepnum, newx, newy, current, pick1, pick2, pick3, F; //stepnum is our Nc
    var runnum = 0;
    var CR = 0.5; //CR
    while(runnum !== 100) {
        stepnum = 0;
        F = (math.random() * 0.5) + 0.5;
        for(var i = 0; i < agents.length; i++) {
            agents[i] = (math.random() * 10) - 5;
        }
        console.log("Starting differential evolution");
        while(stepnum !== 100) {
            for(var i = 0; i < (agents.length / 2); i++) {
                current = ackley(agents[(i * 2)], agents[(i * 2)+1]);
                newx = (math.random() * 10) - 5;
                newy = (math.random() * 10) - 5;
                var checker = false;
                //this loop picks three other distinct agents
                while(!checker){
                    var rando = (math.random() * 100) % (agents.length / 2);
                    if(rando !== i) {
                        pick1 = rando;
                        while(!checker) {
                            rando = (math.random() * 100) % (agents.length / 2);
                            if(rando !== i && rando !== pick1) {
                                pick2 = rando;
                                while(!checker) { 
                                    rando = (math.random() * 100) % (agents.length / 2);
                                    if(rando !== i && rando !== pick1 && rando !== pick2) {
                                        pick3 = rando;
                                        checker = true;
                                    }
                                }
                            }
                        }
                    }
                }
                //compute mutant vector
                if(math.random() < CR) {
                    newx = agents[(pick3 * 2)] + (F * (agents[(pick1 * 2)] - agents[(2 * pick2)]));
                } else {
                    newx = agents[(2 * i)];
                }
                if(math.random() < CR) {
                    newy = agents[(2*pick3) + 1] + (F * (agents[(2*pick1) + 1] - agents[(2*pick2) + 1]));
                } else {
                    newy = agents[(i * 2) + 1];
                }
                if(ackley(newx, newy) < current) {
                    agents[(i * 2)] = newx;
                    agents[(i * 2)+1] = newy;
                    stepnum = 0;
                } else {
                    stepnum++;
                }
                
            }
            
        }
        runnum++;
        current = ackley(agents[0], agents[1]);
        for(var i = 0; i < (agents.length / 2); i++) {
            if(ackley(agents[(i * 2)], agents[(i * 2) + 1]) < current) {
                current = ackley(agents[(i * 2)], agents[(i * 2) + 1]);
            }
        }
        result.push(current);
        console.log("Run # " + runnum + ": " + current);
    }
    return result;
}

var final = [hillclimb(), anneal(), difevo()];
var hillmean = 0, hillstd = 0, annealmean = 0, annealstd = 0, divmean = 0, divstd = 0;

for(var i = 0; i < final[0].length; i++) {
    hillmean += final[0][i];
    annealmean += final[1][i];
    divmean += final[2][i];
}
hillmean = hillmean / final[0].length;
annealmean = annealmean / final[1].length;
divmean = divmean / final[2].length;

for(var i = 0; i < final[0].length; i++) {
    hillstd += math.pow((hillmean - final[0][i]), 2);
    annealstd += math.pow((annealmean - final[1][i]), 2);
    divstd += math.pow((divmean - final[2][i]), 2);
}
hillstd = hillstd / (final[0].length - 1);
annealstd = annealstd / (final[1].length - 1);
divstd = divstd / (final[2].length - 1);
console.log("=================================================================");
console.log("==========================data===================================");
console.log("=hillclimb=============simanneal=================difevo==========");
for(var i = 0; i < 100; i++){
    console.log(final[0][i] + "  |  " + final[1][i] + "  |  " + final[2][i]);
}
console.log("=================================================================");
console.log("=================================================================");
console.log("=================================================================");
console.log("Results:                |     Mean    |    Std. Deviation");
console.log("Hillclimb:              | "+hillmean+" | "+hillstd);
console.log("Simulated Annealling:   | "+annealmean+" | "+annealstd);
console.log("Differential Evolution: | "+divmean+" | "+divstd);
//plot and compare

