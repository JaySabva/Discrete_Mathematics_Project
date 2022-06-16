//begin
    const root=document.querySelector(':root');

//prime number
    let prime_radio=document.querySelectorAll('.prime-radio');
    let prime= 17;
    let prime_array = [13, 31, 61] ;
    prime_radio.forEach(function(radio){
        radio.addEventListener('click',() =>{
            prime = prime_array[Number(radio.value)];
            console.log(`selected prime: ${prime}`);
        });
    });

    //curve
    let curve_radio=document.querySelectorAll('.equation-radio');
    let a = 1;
    let b = 2;
    let curve_array = [[1,6], [2,4], [(-2),5]];
    curve_radio.forEach(function(radio){
        radio.addEventListener('click',() =>{
            a = curve_array[Number(radio.value)][0];
            b = curve_array[Number(radio.value)][1];
            console.log(` selected (a,b) pair: (${a}, ${b})`);
        });
    });

    const canvas = document.querySelector('#input-graph');
    //empty canvas
    function empty_canvas(){
        while (canvas.firstChild) {
            while(canvas.firstChild.firstChild){
                canvas.firstChild.removeChild(canvas.firstChild.firstChild);
            }
            canvas.removeChild(canvas.firstChild);
        }
    }

    function generate_curve(a,b,p){
        empty_canvas();
        for(let y=p-1;y>=0;y--)
        {
            const row = document.createElement('div');
            row.classList.add('row');
            row.setAttribute('id',`row${y}`);
            row.style.height= 80/p+"vh";
            row.style.display="flex";
            row.style.flexDirection="row";
            for(let x=0;x<p;x++)
            {
                const cell=document.createElement('div');
                cell.classList.add('cell');
                cell.style.width = row.style.height;
                cell.style.height = row.style.height;
                cell.style.backgroundColor = ( (y**2-x**3-a*x-b)%p === 0 )? '#0000FF': '#FFFFFF';
                cell.style.border="1px solid black";
                
                row.appendChild(cell);
            }

            canvas.appendChild(row);

        }
    }

    //generate curve
   const generator_button = document.querySelector('#graph-generator');
     generator_button.addEventListener('click',() =>{

        generate_curve(a,b,prime);
    });

     //define points
    class point{
        constructor(x,y){
            this.x=x%prime;
            this.y=y%prime;
        }
    }

    //operations in prime field
    function sum(n1,n2){
        return (prime+n1+n2)%prime;
    }

    function mul(n1,n2){
        return (n1*n2)%prime;
    }

    function inv(n){
        let t=1;
        for(let i=0;i<prime-2;i++){
            t=mul(t,n);
        }
        return t;
    }

    //add two points
    function add(p1,p2){
        let m=mul(p1.y-p2.y,inv(p1.x-p2.x));
        let x=mul(m,mul(p1.x+p2.x,inv(2)))-p1.x-p2.x;
        let y=mul(m,p1.x-x)-p1.y;
        return new point(x,y);
    }

    //double a point
    function double(p){
        let m=mul(3*p.x*p.x+a,inv(2*p.y));
        let x=mul(m,mul(p.x+p.x,inv(2)))-p.x-p.x;
        let y=mul(m,p.x-x)-p.y;
        return new point(x,y);
    }

    //multiply a point by a scalar by double and add algorithm
    function mul_point(p,n){
        let bit=n.toString(2);
        let result=new point(0,0);
        for(let i=bit.length-1;i>=0;i--){
            result=double(result);
            if(bit[i]=='1'){
                result=add(result,n);
            }
        }
    }
//end