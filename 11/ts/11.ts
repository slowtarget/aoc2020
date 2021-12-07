
import fs from 'fs';
const EMPTY = "L";
const OCCUPIED = "#";
const FLOOR = ".";
const WALL1 = "-";
const WALL2 = "|";

const DIR = [
    [-1,-1],[-1,0],[-1,+1],
    [0,-1],        [0,+1],
    [+1,-1],[+1,0],[+1,+1]
];


type Processor = {
    (seat: string, i:number, j:number, hall:string[][]):[value:string, changed:boolean]
}

const display = (hall:string[][]) => {
    hall.forEach(row => console.log(row.join("")));
}

const getAdjacent = (i:number, j:number, hall:string[][]) => {
    return DIR.map(([dy,dx])=>hall[i+dy][j+dx]);
}

const getVisibleInDir = (dy:number, dx:number, i:number, j:number, hall:string[][]) => {
    var [found, y, x] = [FLOOR, i, j];
    while (found===FLOOR) {
        y = y + dy;
        x = x + dx;
        found = hall[y][x];
    }
    return found;
}
const getVisible = (i:number, j:number, hall:string[][]) => {
    return DIR.map(([dy,dx])=>getVisibleInDir(dy,dx,i,j,hall));
}

const processSeat = (seat: string, i:number, j:number, hall:string[][]):[value:string, changed:boolean] => {
    if (seat === EMPTY) {
        if (getAdjacent(i,j,hall).filter(x=>x===OCCUPIED).length===0) {
            return [OCCUPIED, true];
        }
        return [EMPTY, false];
    }

    if (seat === OCCUPIED) {
        if (getAdjacent(i,j,hall).filter(x=>x===OCCUPIED).length>=4) {
            return [EMPTY, true];
        }
        return [OCCUPIED, false];
    }

    return [seat, false];
}
const processSeat2 = (seat: string, i:number, j:number, hall:string[][]):[value:string, changed:boolean] => {
    if (seat === EMPTY) {
        if (getVisible(i,j,hall).filter(x=>x===OCCUPIED).length===0) {
            return [OCCUPIED, true];
        }
        return [EMPTY, false];
    }

    if (seat === OCCUPIED) {
        if (getVisible(i,j,hall).filter(x=>x===OCCUPIED).length>=5) {
            return [EMPTY, true];
        }
        return [OCCUPIED, false];
    }

    return [seat, false];
}
const tick = (hall:string[][],processor:Processor):[value:string[][], changed:boolean] => {
    var hallChange = false;
    var next = hall.map((row,i)=>row.map((seat,j)=>{
            var [value, changed] = processor(seat,i,j,hall);
            hallChange = changed || hallChange;
            return value;
        }));

    return [next, hallChange];

}
const evaluate = (input:string[][],processor:Processor):number => {

    var hall = input.map(row => [...row]);
    display(hall);
    var changed = true;
    var i = 0;
    while (changed) {
        [hall, changed] = tick(hall, processor);
        console.log(i++,changed);
        // display(hall);
    }

    return hall.reduce((prev,row)=>prev + (row.filter(seat=>seat===OCCUPIED).length),0);

}

const findSolution = (input:string[][]) => {
    const wall = new Array(input[0].length + 2).fill(WALL1);

    const hall = [
        wall,
        ...input.map(row => [WALL2,...row,WALL2]),
        wall];

    const part1 = evaluate(hall, processSeat);

    const part2 = evaluate(hall, processSeat2);

    return {part1, part2};
};

var file:string;

file = "small.txt";
file = "eightoccupied.txt"
file = "input.txt";
file = "full.txt"



fs.readFile(file, "utf8", (err: NodeJS.ErrnoException | null, data:string) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(findSolution(
        data
            .replace(/\r\n/g,'\n')
            .split(/\n/g)
            .map(v=>v.split(""))
        ))
});


