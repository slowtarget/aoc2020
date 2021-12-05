import fs from 'fs';

type Input = {
    map: string[][]
}

const findSolution = (input:string[][]) => {
    var len = input[0].length;

    var part1 = treesOnSlope(input,3);
    var part2 = [treesOnSlope(input,1) , treesOnSlope(input,3) , treesOnSlope(input,5) , treesOnSlope(input,7) ,  treesOnSlope(input,1,2)].reduce((p,c)=>p*c,1);
    return {part1, part2};
};
const treesOnSlope = (input:string[][], dx:number, dy:number = 1):number => {
    const trees = input.map((row, y) => y).filter(y => y % dy == 0).filter(y => treeAtXY(input, y * dx/dy, y)).length;
    console.log(`${trees} for ${dx},${dy}`)
    return trees;
}
const treeAtXY = (input:string[][], x:number, y:number):boolean => {
    const tree = input[y][x % (input[0].length)] === "#";
    //console.log(`${tree} @ ${x},${y}`)
    return tree;
}

fs.readFile('full.txt', "utf8", (err: NodeJS.ErrnoException | null, data:string) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(findSolution(data.replace(/\r\n/g,'\n')
        .split('\n')
        .map(a=>a.split(""))

        ))
});