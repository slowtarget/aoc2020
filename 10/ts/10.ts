
import fs from 'fs';


const isValid = (input:number, preamble:number[]) => {
    const result = preamble.some(a => preamble.filter(b => b > a).some(b => b + a === input));
    return result;
}

const evaluate = (someInput:number[]):number => {
    
    const input = [...someInput];
    console.log(`input ${JSON.stringify(input)}`)
    input.push(input[input.length-1] +3 );
    var ranges = new Array(4).fill(0);
    console.log(input.reduce((p,c)=>{ranges[c-p]++;console.log(c-p); return c;},0));
    console.log(ranges);
    return ranges[3]*ranges[1];
}
const evaluate2 = (someInput:number[]):number => {
    
    const input = [...someInput];
    console.log(`input ${JSON.stringify(input)}`)
    input.push(input[input.length-1] +3 );
    var runs = new Array(5).fill(0);
    var run = 0;
    console.log(input.reduce((p,c)=>{
        if (c-p === 1) {
            run = run + 1;
        } else if (c-p === 3) {
            runs[run]++;
            run = 0;
        }
        return c;},0));

    console.log(runs);
    return 7**runs[4]*4**runs[3]*2**runs[2];
}

const findSolution = (input:number[]) => {
    input.sort((a,b)=>a-b);
    const part1 = evaluate(input);

    const part2 = evaluate2(input);

    return {part1, part2};
};

var file:string;

file = "small.txt";
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
            .map(v=>v.trim())
            .map(v=>parseInt(v,10))
        ))
});


