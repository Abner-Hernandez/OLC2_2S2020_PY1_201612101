import Type from'./Type';
import Value from'./Value';
import { add_error_E, add_simbol_E } from './Reports';

class Unary{
   constructor(_id, _type, _row, _col){
      this.id = _id;
      this.type = _type;
      this.row = _row;
      this.column = _col;
   }

   operate(tab){
      let a;
      if(this.id instanceof Array)
      {
         a = tab.getSymbol(this.id[0].value);
      }else
         a = tab.getSymbol(this.id);
      if(a.type === Type.ENTERO)
      {
         let number = a.value;
         if (this.type === Type.INCREMENTO) {
            a.value = a.value + 1;
         }else if (this.type === Type.DECREMENTO) {
            a.value = a.value - 1;
         }
            return new Value(number, a.ENTERO, a.VALOR, a.row, a.column);
      }
      return null;      
   }
}


export default Unary;