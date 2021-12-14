
import fs from 'fs';
const debug = false;
type Rules={[index:string]:Rule}
class Range {
    constructor (
        public from:number, 
        public to:number) {}

    public valid(n:number){
        return n >= this.from && n <= this.to;
    }
}
class Rule {
    public label:string;
    public ranges:Range[] = [];
    private matcher:RegExp =/^(.*): (\d+)+\-(\d+) or (\d+)+\-(\d+)$/
    constructor(
        public rule:string
    ) {
        var m = this.matcher.exec(rule);
        if (!m){
            throw new Error("!invalid input: " + rule);
        }
        var r:string[];
        [,this.label, ...r] = m;
        var rn = r.map(x=>parseInt(x));
        var [r1,r2,r3,r4] = rn;

        this.ranges.push(new Range(r1,r2))
        this.ranges.push(new Range(r3,r4))
    }

    public valid(n:number){
        return this.ranges.some(r=>r.valid(n));
    }
}
class Ticket {
    public values:number[] = [];
    constructor(
        public ticket:string
    ) {
        this.values = ticket.split(",").map(t=>parseInt(t,10));
    }
}

const evaluate = (rules:Rule[], myTicket:Ticket, nearby:Ticket[]):number => {

    var scanningErrorRate = 0;
    for(var ticket of nearby) {
        var candidates = [...ticket.values];
        
        for (var rule of rules) {
            candidates = candidates.filter(n=>!rule.valid(n));
        }
        scanningErrorRate = candidates.reduce((p,c)=>p+c,scanningErrorRate);
    }
    return scanningErrorRate;
}

const evaluate2 = (rules:Rule[], myTicket:Ticket, nearby:Ticket[]):number => {

    var validNearby = nearby.filter(ticket=>{
        var candidates = [...ticket.values];
        
        for (var rule of rules) {
            candidates = candidates.filter(n=>!rule.valid(n));
        }

        return candidates.length === 0;
    });
    var passingRules: Rules[] = [];

    passingRules = myTicket.values.map((value,index)=>{
        var values = validNearby.map(ticket=>ticket.values[index]);
        return rules.filter(rule=>values.every(n=>rule.valid(n))).reduce((p,c)=>({...p, [c.label]:c}),{});
    });
    var singleRules: Rule[] = [];
    var slimming:boolean = true;
    while(slimming){
        slimming = false;
        passingRules.forEach((rs,index)=>{
            if (Object.keys(rs).length===1) {
                // this rule only passes for this index.
                var key = Object.keys(rs)[0];
                singleRules[index] = rs[key];
                passingRules.forEach(rq=>{
                        slimming = true;
                        delete rq[key];
                })
            }
        });
    }
    console.log(singleRules);

    return singleRules.map((rule,index) =>( {rule,index}))
        .filter(({rule, index})=>rule.label.startsWith('departure'))
        .map(({rule, index})=>myTicket.values[index])
        .reduce((p,c)=>p*c,1)
}

const findSolution = (rules:Rule[], myTicket:Ticket, nearby:Ticket[]) => {
    const part1 = evaluate(rules, myTicket, nearby);
    const part2 = evaluate2(rules, myTicket, nearby);
    return {part1, part2};
};

var [file, expected] = ["",0];

[file, expected] = ["input.txt",71];
[file, expected] = ["part2.txt",0];
[file, expected] = ["full.txt",0];

fs.readFile(file, "utf8", (err: NodeJS.ErrnoException | null, data:string) => {
    if (err) {
      console.error(err);
      return;
    }
    const input = data
        .replace(/\r\n/g, '\n')
        .split(/\n\n/g);

    var [rules, myTicket, nearby] = input;

    myTicket = myTicket.split(/\n/)[1];        
    var nearbys = nearby.split(/\n/).slice(1).map(s=>new Ticket(s));
    const result = findSolution(rules.split(/\n/).map(s=>new Rule(s)), new Ticket(myTicket), nearbys);
    console.log(result, expected>0?result.part1===expected:"")
});


