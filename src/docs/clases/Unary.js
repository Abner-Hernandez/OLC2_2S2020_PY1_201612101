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
      if(a !== null && a.type === Type.ENTERO)
      {
         let number = a.value;
         if (this.type === Type.INCREMENTO) {
            a.value = a.value + 1;
         }else if (this.type === Type.DECREMENTO) {
            a.value = a.value - 1;
         }
            return new Value(number, a.ENTERO, a.VALOR, a.row, a.column);
      }
      else if(this.type === Type.RESTA)
      {
         let tmpExp = this.id.operate(tab);
         if(tmpExp === null || tmpExp.type != Type.ENTERO)
         {
            try{ add_error_E( {error: "EXPRESION INVALIDA para el operador unario se esperaba ENTERO o DECIMAL.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
         }
         return new Value(tmpExp.value * -1, Type.ENTERO, Type.VALOR, tmpExp.row, tmpExp.column);
      }else if(a === null){
         try{ add_error_E( {error: "EXPRESION INVALIDA para el operador unario se esperaba ENTERO o DECIMAL.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
      }
      return null;      
   }
}


export default Unary;