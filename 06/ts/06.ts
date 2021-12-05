
import fs from 'fs';
type Alphabet = {
    [key:string]:boolean
}

const findSolution = (input:string[][]) => {
    var p1result = input.map(group=>group.map(entry => entry.split("").reduce((p,c)=>({...p, [c]:true}),{})    )
        .reduce((p,c)=>({...p, ...c}),{})
    );
    var p2result = input.map(group=>group.map(entry => entry.split("").reduce((p,c)=>({...p, [c]:true}),{})    )
        .reduce((p:Alphabet,c:Alphabet)=>{
            if (p.undef) {
                return c;
            }
            var r:Alphabet = {};
            // console.log(JSON.stringify(Object.entries(c)));
            Object.entries(c).map(entry=>entry[0]).forEach(key=>{
                if (p[key]) {
                    r[key]=true;
                }
            });
            return r;},{undef:true})
    );
    // console.log(`p1result ${JSON.stringify(p1result)}`)
    var part1 = p1result.reduce((p:number,c:Alphabet)=>p + Object.entries(c).length,0);
    var part2 = p2result.reduce((p:number,c:Alphabet)=>p + Object.entries(c).length,0);
    return {part1, part2};
};
// const file = "input.txt";

const file = "full.txt"
fs.readFile(file, "utf8", (err: NodeJS.ErrnoException | null, data:string) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(findSolution(
        data
            .replace(/\r\n/g,'\n')
            .split(/\n\n/g)
            .map(a=>a.split(/\n/))
        ))
});
