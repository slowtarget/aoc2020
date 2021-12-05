
import fs from 'fs';

const seat = (input:string) => {
    const b = input.replace(/L|F/g,"0").replace(/R|B/g,"1");
    console.log(`${input} => ${parseInt(b,2)}`);
    return parseInt(b,2);
};

const part2 = (result:number[]) => {
    var taken:boolean[]=[];
    for (var i = 0; i < 127 * 8; i ++) {
        taken[i] = false;
    }

    result.forEach(i=>taken[i]=true);

    for (var i = 1; i < (127 * 8) - 1; i ++) {
        if (!taken[i] && taken[i+1] &&  taken[i-1]) {
            return i;
        }
    }
}
const findSolution = (input:string[]) => {
    var result = input.map(bsp=>seat(bsp));
    console.log(`result ${JSON.stringify(result)}`)
    var part1 = result.reduce((p,c)=>c>p?c:p,0);
    return {part1, part2:part2(result)};
};

fs.readFile('full.txt', "utf8", (err: NodeJS.ErrnoException | null, data:string) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(findSolution(
        data
            .replace(/\r\n/g,'\n')
            .split('\n')
        ))
});
