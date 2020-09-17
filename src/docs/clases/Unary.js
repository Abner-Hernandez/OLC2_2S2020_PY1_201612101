import Type from'./Type';
import Value from'./Value';

class Unary{
    constructor(_id, _type, _row, _col){
        this.id = _id;
        this.type = _type;
        this.row = _row;
        this.column = _col;
    }

    operate(tab){
      var a = tab.getSymbol(this.id);
      if(a.type == Type.ENTERO)
      {
         if (this.type == Type.INCREMENTO) {
            a.value = a.value + 1;
         }else if (this.type == Type.DECREMENTO) {
            a.value = a.value + 1;
         }
         return new Value(a.value, a.ENTERO, a.VALOR, a.row, a.column);
      }else if (a.type == Type.VECTOR)
      {
         //IMPLEMENTAR
      }
      else
      {
         //error
      }

      
      return ;
   }
}


export default Unary;