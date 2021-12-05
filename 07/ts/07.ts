
import fs from 'fs';

type BagCriteria = {
    colour:string,
    requirement:number
};

type Bag = {
        contents:BagCriteria[],
        colour:string,
        canBeIn?:Bag[]
};

type Baggage = {
    [key:string]:Bag
}
const couldContain = (bag:Bag, target:string, baggage:Baggage):boolean => {
    // console.log(`couldContain looking in ${bag?.colour}`);
    if (bag.contents.some(b=>b.colour===target)) {
        return true;
    }
    return bag.contents.some(b=>couldContain(baggage[b.colour],target,baggage));
};
const allParents = (bag:Bag, baggage:Baggage): Baggage => {
    const result:Baggage[] = bag.canBeIn?.map(b=>{
            const parents: Baggage = allParents(b,baggage);
            const reduced:Baggage = {[b.colour]:b, ...parents};
            return reduced;
        }) || [];


    return arrayToMap(result);
}

const getContents = (bag:Bag,baggage:Baggage):number =>{
    return bag.contents.map(b => b.requirement * (1 + getContents(baggage[b.colour],baggage))).reduce((p,c)=>p+c,0);
}
const findSolution = (input:Baggage) => {

    // console.log(`input ${JSON.stringify(input)}`)

    const colours = Object.keys(input);

    const baggage = {...input};

    colours.forEach(colour=>baggage[colour].contents.forEach(c=>baggage[c.colour]?.canBeIn?.push(baggage[colour])));
    const bug = colours.map(colour=>baggage[colour].contents.map(c=>c.colour).filter(c=>baggage[c]===undefined)).filter(arr=>arr.length>0);
    console.log(`bug : ${bug}`);
    const part1 = colours.map(colour=>baggage[colour]).filter(bag=>couldContain(bag,'shiny gold', baggage)).length;

    var part12 = arrayToMap(baggage['shiny gold'].canBeIn
        ?.map(b=>{
           const r:Baggage ={[b.colour]:b,...allParents(b,baggage)};
           return r;
        })||[]);
        // .reduce((p:Baggage,c:Bag[])=>{
        //     const c3:Baggage = c.reduce((p2:Baggage,c2)=>({...p2, [c2.colour]:c2}),{});
        //     return <Baggage>{...p, ...c3}),{}));

    var part2 = getContents(baggage['shiny gold'],baggage);

    return {part1, part12:Object.keys(part12).length, part2};
};

// const file = "input.txt";

const file = "full.txt"
fs.readFile(file, "utf8", (err: NodeJS.ErrnoException | null, data:string) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(findSolution(
        data
            .replace(/\r\n/g,'\n')
            .split(/\n/g)
            .map(a=>a.split(/ bags contain |,/).map(v=>v.replace(/bag[s,\.]*/,"")).map(v=>v.trim()))
            .map(arr=>{
                const [key, ...rest] = arr;
                // console.log(`${key} : ${rest}`);
                return <Baggage>{[key]:{contents:rest.map(cri=>{
                        const matches = cri.match(/^(\d+)\s(.*)$/);
                        // console.log(`${key} : ${matches}`);
                        if (matches) {
                            const [,requirement,colour] = matches;
                            return <BagCriteria>{colour, requirement: parseInt(requirement,10)};
                        }
                        return undefined;
                    })
                    .filter(b=>!!b),
                    colour:key,
                    canBeIn: []
                }}
            })
            .reduce((p:Baggage,c)=>({...p,...c}),{})
        ))
});
function arrayToMap(result: Baggage[]): Baggage {
    return result.reduce((p, c) => {
        return { ...p, ...c };
    }, {});
}

