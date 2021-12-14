
import fs from 'fs';
const debug = false;
type Plays={[index:number]:Played}
class Played {
    public turnMinusOne:number = 0;
    constructor(
        public firstPlayed:number
    ) {
        this.turnMinusOne = firstPlayed;
    }
    public play(turn:number):number {
        var next = turn - this.turnMinusOne;
        this.turnMinusOne = turn;
        return next;
    }
}
class Game {
    public plays:Plays = {};
    public turn:number = 0;
    public last:number = 0;
    constructor(
        public starts: number[],
        public target: number,
        public expect: number
    ){
        starts.forEach(x=>{this.last = this.play(x);});
    }
    public play(x:number):number{
        this.turn++;
        if (this.plays[x]===undefined){
            this.plays[x] = new Played(this.turn);
            return 0;
        }
        this.last = this.plays[x].play(this.turn);
        // console.log(`turn:${this.turn} spoken:${x} next:${this.last}`)
        return this.last;
    }
}

const evaluate = (input:Game[]):number => {

    for(var game of input) {
        var last:number = game.last;
        var previous:number = game.last;
        while (game.turn<game.target) {
            previous = last;
            last = game.play(last);
        }
        
        console.log(`starts: ${game.starts} target: ${game.target} : ${previous}`);

        if (previous === game.expect) {
            console.log("-------------------");
            console.log("-------------------");
            console.log("-----  WIN!  ------");
            console.log("-------------------");
            console.log("-------------------");
        } else {
            console.log(previous, last, game.target, game.expect);
            throw new Error("poor show!");
        }
    }
    return 0;
}


const findSolution = (input:Game[]) => {


    const part1 = evaluate(input);

    const part2 = 0;

    return {part1, part2};
};

var [file, expected] = ["",0];

[file, expected] = ["input.txt",165];

fs.readFile(file, "utf8", (err: NodeJS.ErrnoException | null, data:string) => {
    if (err) {
      console.error(err);
      return;
    }
    const matcher:RegExp = /^Given the starting numbers ((?:\d+,)*) the (\d+)th number spoken is (\d+).$/;
    const input = data
        .replace(/\r\n/g, '\n')
        .split(/\n/g)
        .filter(m=>m && m!=null)
        .map(s=>matcher.exec(s))
        .filter(m=>m && m!=null)
        .map(m=>m||["","0,0,","5","0"])
        .map(([,starts,target,expect]) => 
            new Game(starts.trim().split(",").filter(p=>!!p).map(p=>parseInt(p,10)),
                parseInt(target,10),
                parseInt(expect,10))
        );
        

    const result = findSolution(input);
    console.log(result, expected>0?result.part1===expected:"")
});


