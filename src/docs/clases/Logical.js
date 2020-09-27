import Type from './Type';
import Value from './Value';
import { add_error_E } from './Reports';

class Logical {
    constructor(left, right, t, te, _row, _column) {
        this.type = t;
        this.node_left = left;
        this.node_right = right;
        this.type_exp = te;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        //let cont = new Cont();
        let tempL = null;
        let tempR = null;

        if (this.node_left !== null) {
            tempL = this.node_left.operate(tab);
            if(this.node_left.type !== Type.NOT && this.type === Type.AND && tempL.value === false)
                return new Value(false, Type.BOOL, Type.VALOR, this.row, this.column);
        }

        if (this.node_right !== null) {
            tempR = this.node_right.operate(tab);
        }

        if (tempR !== null && tempL !== null) {
            if (tempL.type_exp === Type.VALOR && tempR.type_exp === Type.VALOR) {
                if (tempL.type === Type.BOOL && tempR.type === Type.BOOL) {
                    if (null !== this.type) {
                        switch (this.type) {
                            case Type.AND:
                                return new Value(tempL.value && tempR.value, Type.BOOL, Type.VALOR, this.row, this.column);
                            case Type.OR:
                                return new Value(tempL.value || tempR.value, Type.BOOL, Type.VALOR, this.row, this.column);
                            case Type.XOR:
                                return new Value(!(tempL.value === tempR.value), Type.BOOL, Type.VALOR, this.row, this.column);
                            default:
                                break;
                        }
                    }
                    try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                }
            }
        } else if (tempR === null && tempL !== null) {
            if (tempL.type_exp === Type.VALOR) {
                if (this.type === Type.NOT) {
                    if(tempL.type !== Type.BOOL){
                        try{ add_error_E( {error: "La expresion necesita ser de tipo booleana", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                        return null
                    }
                    return new Value(!tempL.value, Type.BOOL, Type.VALOR, this.row, this.column); 
                }
            }
            try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            //cont.putError(Type.SEMANTICO, "No se puede ejecutar la operacion " + this.type + ", No reconocida o No Permitida.", this.row, this.column);
            return null
        }
        try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        //cont.putError(Type.SEMANTICO, "No se puede ejecutar la operacion " + this.type + ", No reconocida o No Permitida.", this.row, this.column);
        return null;
    }

}

export default Logical;