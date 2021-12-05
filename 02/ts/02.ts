import fs from 'fs';

type Input = {
    range: {
        from:number,
        to:number
    },
    letter:string,
    password:string
}

const findSolution = (input:Input[]) => {
    var part1 = input.filter(entry=>isValidSledRental(entry)).length;
    var part2 = input.filter(entry=>isValidToboggan(entry)).length;
    return {part1,part2};
};
const isValidSledRental = (input:Input) => {
    var matches = input.password.split("").filter(a=>a==input.letter).length;
    return matches >= input.range.from && matches <= input.range.to;
}
const isValidToboggan = (input:Input) => {
    var matches = (input.password[input.range.from-1] === input.letter)?1:0;
    matches = matches + ((input.password[input.range.to-1] === input.letter)?1:0);
    return matches === 1;
}
fs.readFile('input.txt', "utf8", (err: NodeJS.ErrnoException | null, data:string) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(findSolution(data.replace(/\r\n/g,'\n')
        .split('\n')
        .map(a=>a.split(" "))
        .map(arr => {
            var [from, to] = arr[0].split("-").map(a=>parseInt(a,10));
            var letter = arr[1][0]; 
            return {range:{from,to},letter,password:arr[2]};
            })
        ))
});