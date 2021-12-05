import fs from 'fs';

type Passport = {
    byr?: string,
    iyr?: string,
    eyr?: string,
    hgt?: string,
    hcl?: string,
    ecl?: string,
    pid?: string,
    cid?: string
};

const findSolution = (input:Passport[]) => {
    var len = input.length;

    var part1 = input.filter(p=>hasAllFields(p)).length;
    var part2 = input.filter(p=>hasAllFields(p)).filter(p=>isValid(p)).length;;
    return {part1, part2};
};

const hasAllFields = (passport:Passport):boolean => {
    const result = (passport.byr && passport.iyr && passport.eyr && passport.hgt && passport.hcl && passport.ecl && passport.pid && true) || false;
    // console.log(`all fields ${result} : ${JSON.stringify(passport)}`);
    return result;
}

const isValid = (passport:Passport):boolean => {
    const result = (isValidByr(passport.byr!)
         && isValidIyr(passport.iyr!)
         && isValidEyr(passport.eyr!)
         && isValidHgt(passport.hgt!)
         && isValidHcl(passport.hcl!)
         && isValidEcl(passport.ecl!)
         && isValidPid(passport.pid!) && true) || false;
    console.log(`valid ${result} : ${JSON.stringify(passport)}`);
    return result;
}

fs.readFile('full.txt', "utf8", (err: NodeJS.ErrnoException | null, data:string) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(findSolution(
        data
            .replace(/\r\n/g,'\n')
            .split('\n\n')
            .map(p=>p.replace(/\n/g,' ').trim().split(" ").map(v=>{
                var [key,value] = v.split(":");
                return {[key]: value};       
            })
            .reduce((p,c)=>({...p, ...c}),{}))
            .map(p=><Passport>p)

        ))
});

function isValidYear(input: string, from:number, to:number):boolean {
    var yyyy = parseInt(input,10);
    return !!(yyyy && yyyy >= from && yyyy <= to);
}

function isValidByr(input: string):boolean  {
    return isValidYear(input, 1920, 2002);
}


function isValidIyr(input: string):boolean  {
    return isValidYear(input, 2010, 2020);
}


function isValidEyr(input: string):boolean  {
    return isValidYear(input, 2020, 2030);
}


function isValidHgt(input: string):boolean  {
    const result = input.match(/^(\d+)(in|cm)$/);
    if (result) {
        const [, hgt, units] = result;
    
        if (hgt && units) {
            var h = parseInt(hgt,10);
            if (units == "cm") {
                return h >= 150 && h <= 193;
            }
            return h >= 59 && h <= 76;
        }
    }
    // console.log(`fail : height ${JSON.stringify(result)}`);
    return false;
}


function isValidHcl(input: string):boolean  {
    var result = input.match(/^#[0-9,a-f]{6}$/);
    // console.log(`hair colour ${result}`);
    return result !== null;
}


function isValidEcl(input: string):boolean  {
    return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].some(ecl=>ecl===input);
}


function isValidPid(input: string):boolean  {
    var result = input.match(/^[0-9]{9}$/);
    // console.log(`pid ${result}`);
    return result !== null;
}
