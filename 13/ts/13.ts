
import fs from 'fs';
import { waitForDebugger } from 'inspector';

const ADJACENT = [
    [-1,-1],[-1,0],[-1,+1],
    [0,-1],        [0,+1],
    [+1,-1],[+1,0],[+1,+1]
];

const evaluate = (input:string[]):number => {

    var data = input.map(ins => ins);
    var [earliestInput, busesInput] = data;
    var earliest = parseInt(earliestInput,10);
    var buses = busesInput.split(",").filter(bus=>bus!='x').map(v=>parseInt(v,10));
    
    var waits = buses.map(id=>({wait: id -( earliest % id), id  }));

    var bus = waits.sort((a,b)=> a.wait - b.wait).slice(0,1)[0];

    console.log(bus,buses,waits,earliest)

    return bus.id * bus.wait;
}

const evaluate2 = (input:string[]):number => {

    var data = input.map(ins => ins);
    var [, busesInput] = data;
    var buses = busesInput.split(",").map((id,offset)=>({id,offset})).filter(bus=>bus.id!='x').map(v=>({...v, id:parseInt(v.id,10)}));
    
    var logInt = 2 ;
    var found = false;
    var maxId = Math.max(...buses.map(bus=>bus.id));
    var maxBus = buses.filter(bus=>bus.id===maxId)[0];
    var start = maxBus.id - maxBus.offset;
    var next = start;
    var step = maxBus.id;
    var checks=0;
    console.log(buses);
    while (!found) {
        start = next;
        found = buses.every(bus=>(start+bus.offset)%bus.id == 0 );
        checks++;
        if (checks%logInt===0) {
            console.log(checks, start);
            logInt = logInt * 2;
        }
        next = start + step;
    }
    return start;
}
const evaluate3 = (input:string[]):number => {

    var data = input.map(ins => ins);
    var [, busesInput] = data;
    var buses = busesInput.split(",").map((id,offset)=>({id,offset})).filter(bus=>bus.id!='x').map(v=>({...v, id:parseInt(v.id,10)}));
    
    var logInt = 2 ;
    var found = [];
    var start = 0;
    var next = 0;
    var i = 0;
    var step = buses[i].id;
    var checks=0;
    console.log(buses);
    i++;
    var bus = buses[i];
    while (found.length < 1 || (i < (buses.length -1))) {
        start = next;
        if (((start+bus.offset) % bus.id) === 0 ) {
            found.push(start);
            console.log(`${found.length} found for ${i} at ${start}`)
            if (found.length > 1) {
                step = found[1] - found[0];
                i++;
                bus = buses[i];
                found = [];
                if (bus !== undefined) {

                    console.log(`found for ${i} at ${start}, now stepping at ${step} and looking for ${bus.id}`)
                }
            }
        }
        checks++;
        if (checks%logInt===0) {
            console.log(checks, start);
            logInt = logInt * 2;
        }
        next = start + step;
    }
    console.log(`finished with i: ${i} and found.length ${found.length} and buses.length ${buses.length}`);
    return start;
}
const findSolution = (input:string[]) => {


    const part1 = evaluate(input);

    const part2 = evaluate3(input);

    return {part1, part2};
};

var [file, expected] = ["",0];

[file, expected] = ["input.txt",295];
[file, expected] = [ "full.txt",246];


fs.readFile(file, "utf8", (err: NodeJS.ErrnoException | null, data:string) => {
    if (err) {
      console.error(err);
      return;
    }
    const input = data
        .replace(/\r\n/g, '\n')
        .split(/\n/g);

    const result = findSolution(input);
    console.log(result, expected>0?result.part1===expected:"")
});


