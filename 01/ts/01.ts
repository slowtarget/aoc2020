import fs from 'fs';

const findSolution = (input:number[]) => {
    var part1 = input
        .map(a => input
            .filter(b=>b>a)
            .filter(b=>(a+b)==2020)
            .map(b=>a*b))
        .filter(a=>a.length>0)[0][0];

    var part2 = input
        .map(a => input
            .filter(b => b>a)
            .map(b => input
                .filter(c=>c>b)
                .filter(c=>(a+b+c)==2020)
                .map(c=>a*b*c))
            .filter(a=>a.length>0))
        .filter(a=>a.length>0)[0][0][0];

    return {part1,part2};
};
fs.readFile('input.txt', "utf8", (err: NodeJS.ErrnoException | null, data:string) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(findSolution(data.replace(/\r\n/g,'\n').split('\n').map(a=>parseInt(a,10))));
  })