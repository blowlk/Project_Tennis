const keypress = require('keypress');
//const readline = require('readline')

const fieldChar =' ';
const ballChar ='O';
const playerChar = '░'
const middleChar = '|'

class Tennis{
    constructor(fieldSize=1){
        this._size = fieldSize;
        this._fieldX = 12*fieldSize+1;
        this._fieldY = 50*fieldSize+1;
        this._field = [[]];
        this._endGameSet=false;
        this._playerCount=0;
        this._compCount=0;
        //
        this._middleX = Math.floor(this._fieldX/2);
        this._middleY = Math.floor(this._fieldY/2);
        
        this.createField()
    }

    set endGameSet(endGameSetValue){this._endGameSet = endGameSetValue}
    get endGameSet(){return this._endGameSet}

    createField(){
        const size = this._size;
        // initialize players
        this._player1Pos=[];
        this._player2Pos=[];
        this._ballPos=[,,,300];
        this._player2Cfg=[300];
        this.printTime=300;
        for(let i=this._middleX-2*size;i<=this._middleX+2*size;i++)
        {
          this._player1Pos.push([i,1])
          this._player2Pos.push([i,this._fieldY-1])
        }
        // create field
        for(let i=0;i<this._fieldX;i++)
        { this._field.push([])
            for(let j=0;j<this._fieldY;j++)
            {
                if(j==this._middleY){this._field[i].push(middleChar)}
                else{this._field[i].push(fieldChar)}
            }
        }
        //initialize players
        for(let i=0;i<this._player1Pos.length;i++)
        {
            this._field[this._player1Pos[i][0]][this._player1Pos[i][1]]=playerChar
        }
        for(let i=0;i<this._player2Pos.length;i++)
        {
            this._field[this._player2Pos[i][0]][this._player2Pos[i][1]]=playerChar
        }
        //initialize ball
        this._ballPos[0]=this._middleX
        this._ballPos[1]=2;
        this._ballPos[2]=[1,1];
        this._ballMovement=false;
        this._field[this._ballPos[0]][this._ballPos[1]]=ballChar;
    }
    async movePlayer1(direction){
        let canMove = true;
        let x=0,y=0;
        switch(direction){
            case 'down'  : x=1;break;
            case 'up'    : x=-1 ;break;
            case 'left'  : y=-1;break;
            case 'right' : y=1 ;break;
        }
        if(this._player1Pos[0][0]+x<=0 || this._player1Pos[this._player1Pos.length-1][0]+x>=this._fieldX
         ||this._player1Pos[0][1]+y<=0 || this._player1Pos[0][1]+y>= this._middleY
          ){canMove = false}
        if(canMove)
        {
            for(let i=0;i<this._player1Pos.length;i++)
            {
                this._field[this._player1Pos[i][0]][this._player1Pos[i][1]]=fieldChar
                this._player1Pos[i][0]=this._player1Pos[i][0]+x
                this._player1Pos[i][1]=this._player1Pos[i][1]+y
            }
            for(let i=0;i<this._player1Pos.length;i++)
            {
                this._field[this._player1Pos[i][0]][this._player1Pos[i][1]]=playerChar
            }
            //this.printField();
        }
        if(this._ballPos[0]+this._ballPos[2][0]>=this._player1Pos[0][0]
            &&this._ballPos[0]+this._ballPos[2][0]<=this._player1Pos[this._player1Pos.length-1][0]
            &&(this._ballPos[1]+this._ballPos[2][1]==this._player1Pos[0][1]
            ||this._ballPos[1]==this._player1Pos[0][1])
               ){
            this._ballPos[2][0]=(Math.floor(Math.random() * 3) -1);
            this._ballPos[2][1]*=-1;
        }
    }
    async movePlayer2(){
        const compStep = () =>{
            let canMoveX = true,canMoveY = true;
            let y=0;
            if(this._player2Pos[0][1]-2==this._ballPos[1]){y=-1}
            else{y=1}
            let x=this._ballPos[2][0];
            if(this._player2Pos[0][0]+x<0 || this._player2Pos[this._player2Pos.length-1][0]+x>this._fieldX-1){
                canMoveX = false;
            }
            if(this._player2Pos[0][1]+y<this._middleY+1 || this._player2Pos[0][1]+y>= this._fieldY-1){
                canMoveY = false;
            }
            if(canMoveX||canMoveY)
            {
                if(this._player2Pos[0][1]+y<this._middleY+1){
                    if(this._player2Pos[0][1]-2==this._ballPos[1]){
                        this._ballPos[2][0]=(Math.floor(Math.random() * 3) -1)
                    }
                }
                for(let i=0;i<this._player2Pos.length;i++)
                {
                    this._field[this._player2Pos[i][0]][this._player2Pos[i][1]]=fieldChar
                    if(canMoveX){this._player2Pos[i][0]=this._player2Pos[i][0]+x}
                    if(canMoveY){this._player2Pos[i][1]=this._player2Pos[i][1]+y}
                }
                for(let i=0;i<this._player2Pos.length;i++)
                {
                    this._field[this._player2Pos[i][0]][this._player2Pos[i][1]]=playerChar
                }
                //this.printField();
            }
            if(this._endGameSet){
                clearInterval(this._player2Cfg[1]);
                this._player2Cfg[2]=false;
            };
        }
        async function asyncMove(){const a = await compStep()};
        if(!this._player2Cfg[2]){
            this._player2Cfg[2]=true;
            this._player2Cfg[1] = setInterval(asyncMove,this._player2Cfg[0]);
        }
    }
    async moveBall(){

        const ballStep = () => {
            if(this._ballPos[1]!==this._middleY){this._field[this._ballPos[0]][this._ballPos[1]]=fieldChar}
            else{this._field[this._ballPos[0]][this._ballPos[1]]=middleChar}
            //
            let changeDir=false;
            if(this._ballPos[0]+this._ballPos[2][0]>=this._player1Pos[0][0]
             &&this._ballPos[0]+this._ballPos[2][0]<=this._player1Pos[this._player1Pos.length-1][0]
             &&this._ballPos[1]+this._ballPos[2][1]==this._player1Pos[0][1]
              ){changeDir=true;}
            /*for(let i=0;i<this._player1Pos.length;i++){
                if(this._ballPos[0]+this._ballPos[2][0]==this._player1Pos[i][0]
                 &&this._ballPos[1]+this._ballPos[2][1]==this._player1Pos[i][1]
                 ){changeDir=true;break;}
            }*/
            if(!changeDir){    
                if(this._ballPos[0]+this._ballPos[2][0]>=this._player2Pos[0][0]
                    &&this._ballPos[0]+this._ballPos[2][0]<=this._player2Pos[this._player2Pos.length-1][0]
                    &&this._ballPos[1]+this._ballPos[2][1]==this._player2Pos[0][1]
                       ){changeDir=true;}
                /*for(let i=0;i<this._player2Pos.length;i++){
                    if(this._ballPos[0]+this._ballPos[2][0]==this._player2Pos[i][0]
                    &&this._ballPos[1]+this._ballPos[2][1]==this._player2Pos[i][1]
                    ){changeDir=true;break;}
                }*/
            }
            //
            if(changeDir){
                this._ballPos[2][0]=(Math.floor(Math.random() * 3) -1)
                this._ballPos[2][1]*=-1;
            }
            if(this._ballPos[0]+this._ballPos[2][0]>=this._fieldX
             ||this._ballPos[0]+this._ballPos[2][0]<0){this._ballPos[2][0]*=-1}
            
            if(this._ballPos[1]+this._ballPos[2][1]>=this._fieldY){this._endGameSet=true;this._playerCount+=1;}
            if(this._ballPos[1]+this._ballPos[2][1]<0){this._endGameSet=true;this._compCount+=1;}
            //console.log(this._ballPos[2][0],this._ballPos[2][1]);
            this._ballPos[0]+=this._ballPos[2][0];
            this._ballPos[1]+=this._ballPos[2][1];
            this._field[this._ballPos[0]][this._ballPos[1]]=ballChar;
            //this._movePlayer2();
            //this.printField();
            if(this._endGameSet){
                clearInterval(this._ballPos[4]);
                clearInterval(this.timerId);
                this._ballPos[5]=false;
                console.log(`Player - ${this._playerCount} vs Computer - ${this._compCount}`)
            };
        }
        async function asyncMove(){const a = await ballStep()};
        if(!this._ballPos[5]){
        this._ballPos[5]=true;
        this._ballPos[4] = setInterval(asyncMove,this._ballPos[3]);
        }
        
        //setTimeout(()=>{clearInterval(timerId)},25000)

    }
    async printField(){
        const printConsole = () => {
            console.clear;
            for(let i=0;i<this._field.length;i++)
            { 
            console.log(this._field[i].join(''))
            
            }
        }
        async function asyncPrint(){const a = await printConsole()};
        this.timerId = setInterval(asyncPrint,this.printTime);
    }
    //
};



const myTennis = new Tennis(1);

 function start_game(tennisClass){
    let endGame = false;
        //tennisClass.printField();
        const a =  tennisClass.moveBall();
        const b =  tennisClass.movePlayer2();
        const t =  tennisClass.printField()
        //
        process.stdin.on('keypress', async (ch, key) =>
            {
                if (key && key.ctrl && key.name == 'c') {
                    tennisClass._endGameSet = true;
                    endGame = false;
                    clearInterval(tennisClass._ballPos[4]);
                    clearInterval(tennisClass._player2Cfg[2]);
                    clearInterval(tennisClass.timerId);
                process.stdin.pause();
                }
                else
                {
                    if(tennisClass._endGameSet){
                        if(key.name=='Y'||key.name=='y'){endGame=true; process.stdin.pause(); return;}
                        //else{return;}
                    }
                    const c = await tennisClass.movePlayer1(key.name);
                }
            }
        )
        //
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        //process.stdin.setRawMode(true);
        process.stdin.resume();
}

keypress(process.stdin);
start_game(myTennis);
/*  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


/*rl.question('enter the first number : ', async (X) => {
    rl.question('enter the second number : ', async (Y) => {
        const a = await myTennis.moveBall();
        const temp =await Promise.myTennis.movePlayer1(X)
        //return temp
        // rl.close();
    });
});

process.stdin.setRawMode(true);
process.stdin.resume();*/
//myTennis.playGame();