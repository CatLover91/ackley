The files within this directory contain my solution for Project 2 for cs480.

This directory contains two programs. search.js is my solution for task 1.
in order to run it, you must have Node.js installed. You may find installation
details for this dependency at Nodejs.org. in order to run task 1, run this 
command from within this directory:

node search.js

likewise, you can run my task 2 program with the command:

node genAlg.js rankingmatrix.txt

Sadly, this program is still dealing with pointer issues. However, my task 1
program outputs the full run matrix as requested, and calculates the mean
and standard deviation for all three search algorithms for easy comparison.

Currently, Differential Evolution is much more effective and finds an average
low of -17 to -18, while hillclimb averages out at -13 and simulated annealing
is slightly better at -14 (but has a higher std deviation, it does rarely come
close to -22).



For my genetic algorithm, the main structure is as follows.

Gene:
	main class
	contains an array randomly distributed with unique teams
	
Gene -> Mutate:
	mutation function
	loops through each array object, rolls a random
		if under 0.1, changes array location to a random team then loops through rest of array, 
		swapping location of the mutated team
		
Gene -> Fitness:
	returns an integer with math rules given in class
	ex: returns ln(p(A>B))*ln(p(B>C))
	
Gene -> Cross(chosengene):
	rolls a swappoint <= 1/2 string size (as the teams are unique)
	swaps the first halves of both genes
	loops through rest of both genes, looking for multiples and filling with a unique random team
	
Population:
	main holder class of Genes
	
Population -> sort:
	sorts genes based upon fitness
	
Population -> runAround:
	runs a single round of the genetic algorithm
	main holder for timing crossovers, mutations, and roulette matches
	
Population -> run: 
	main loop holder
