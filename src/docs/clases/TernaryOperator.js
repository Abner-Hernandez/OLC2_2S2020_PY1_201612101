import Type from './Type';
import { add_error_E } from './Reports';

class TernaryOperator {

    constructor(exp, _true, _false, _row, _column) {
        this.value = exp;
        this.node_left = _true;
        this.node_right = _false;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) 
    {
        let aux = this.value.operate(tab);
        if (aux.type === Type.BOOL) {
            if (aux.value) {
                let ret = this.node_left.operate(tab);
                if (ret === null) {
                    
                    try{ add_error_E( {error: "El Valor Retorno INVAVALIDO, se esperaba un VALOR.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    //olc2_p1.IDE.txtExec += "Error Semantico, El Valor de Retorno INVALIDO, se esperaba un VALOR. Linea: " + row + " Columna: " + column + "\n";
                    //olc2_p1.IDE.et.putError(new error.Error(error.Error.TypeError.SEMANTICO, "El Valor Retorno INVAVALIDO, se esperaba un VALOR.", row, column));
                }
                return ret;

            } else {
                let ret = this.node_right.operate(tab);
                if (ret === null) {
                    try{ add_error_E( {error: "El Valor de la columna INVAVALIDO, se esperaba un ENTERO.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                    //olc2_p1.IDE.txtExec += "Error Semantico, El Valor de la columna INVALIDO, se esperaba un ENTERO. Linea: " + row + " Columna: " + column + "\n";
                    //olc2_p1.IDE.et.putError(new error.Error(error.Error.TypeError.SEMANTICO, "El Valor de la columna INVAVALIDO, se esperaba un ENTERO.", row, column));
                }
                return ret;
            }
        } else {
            try{ add_error_E( {error: "No se puede ejecutar la operacion " + aux.type.toString() + ", se esperaba un tipo booleano.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            //olc2_p1.IDE.txtExec += "Error Semantico, No se puede ejecutar la operacion " + aux.type.toString() + ", se esperaba un tipo booleano. Linea: " + row + " Columna: " + column + "\n";
            //olc2_p1.IDE.et.putError(new error.Error(error.Error.TypeError.SEMANTICO, "No se puede ejecutar la operacion " + aux.type.toString() + ", se esperaba un tipo booleano.", row, column));
        }
        return null;
    }
}

export default TernaryOperator;
