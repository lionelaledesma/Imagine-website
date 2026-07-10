// Operadores lógicos y de comparacion 
let x = 5
let y = 10
let z = 5

console.log( (x === y) && (x === z) ); // false && true -> false

console.log( (x === y) || (x === z) ); // false || true -> true

console.log( !(x === y) ); // !false -> true

5 === 5    //true (mismo valor, mismo tipo)
5 === "5"  //false (mismo valor, DIFERENTE tipo)
5 == "5"   //true (solo importa el valor)
5 !== "5"  //true (diferente tipo)

 let heladera = 'comida';
    let tv = 'programas';

    function cocina() {
        console.log(heladera, 'desde la cocina'); 
    }

    cocina();
    console.log(heladera, 'desde el scope global'); 
    
    function living() {
    let tv = 'programa de living';
    console.log(tv); 
    }

  
    console.log(tv); //no va a funcionar, tv no existe aca 


    function living() {
    let tv = 'programa de living'; 
    }

    function cocina() {
        console.log(tv); // tv pertenece a otra función
    }

    btn.addEventListener("click", function() {
        let tipo = entrada.value  
        
        var sal = document.createElement("h1");
        var txt = document.createTextNode("Holaa " + tipo + ", bienvenida!!");
        sal.appendChild(txt); 
        contenedor.appendChild(sal);

    });