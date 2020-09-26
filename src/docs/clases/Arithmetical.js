import Type from './Type';
import Value from './Value';
import { add_error_E } from './Reports';

class Arithmetical {

    constructor(left, right, t, te, _row, _column) {
        this.type = t;
        this.node_left = left;
        this.node_right = right;
        this.type_exp = te;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        var tempL = null;
        var tempR = null;
        if (this.node_right !== null) {
            if(!(this.node_right instanceof Array)){
                tempR = this.node_right.operate(tab);
            }else{
                tempR = this.node_right[0].operate(tab);
            }
            
        } else {
            try{ add_error_E( {error: "Un operando es null", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return
        }
        
        if (this.node_left !== null) {
            if(!(this.node_left instanceof Array)){
                tempL = this.node_left.operate(tab);
            }else{
                tempL = this.node_left[0].operate(tab);
            }
            
        } else {
            try{ add_error_E( {error: "Un operando es null", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return
        }

        if(tempR.value === undefined || tempL.value === undefined)
        {
            try{ add_error_E( {error: 'Una variable no a sido asignada', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return null;
        }
        
        if (tempR !== null && tempL !== null) {
            if (tempR.type_exp === Type.VALOR && tempL.type_exp === Type.VALOR) {
                if (tempL.type === Type.ENTERO && tempR.type === Type.ENTERO) {
                    if (null !== this.type) {
                        switch (this.type) {
                            case Type.SUMA:
                                return new Value(tempL.value + tempR.value, Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.RESTA:
                                return new Value(tempL.value - tempR.value, Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.MULTIPLICACION:
                                return new Value(tempL.value * tempR.value, Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.DIVISION:
                                return new Value(tempL.value / tempR.value, Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.POTENCIA:
                                return new Value(Math.pow(tempL.value, tempR.value), Type.ENTERO, Type.VALOR, this.row, this.column);
                            case Type.MODULO:
                                return new Value(tempL.value % tempR.value, Type.ENTERO, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                } else if (tempL.type === Type.ENTERO && tempR.type === Type.CADENA) {
                    if (null !== this.type) {
                        switch (this.type) {
                            case Type.SUMA:
                                return new Value(tempL.value + tempR.value, Type.CADENA, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                } else if (tempL.type === Type.CADENA && tempR.type === Type.ENTERO) {
                    if (null !== this.type) {
                        switch (this.type) {
                            case Type.SUMA:
                                return new Value(tempL.value + tempR.value, Type.CADENA, Type.VALOR, this.row, this.column);
                            default:
                                try{ add_error_E( {error: "No se puede ejecutar la operacion " + this.type.toString() + ", No reconocida o No Permitida.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                                break;
                        }
                    }
                } else if (tempL.type === Type.CADENA && tempR.type === Type.CADENA) {
                    if (this.type === Type.SUMA) {
                        return new Value(tempL.value + tempR.value, Type.CADENA, Type.VALOR, this.row, this.column);
                    }
                } else if (tempL.type === Type.CADENA && tempR.type === Type.BOOL) {
                    if (this.type === Type.SUMA) {
                        return new Value(tempL.value + tempR.value, Type.CADENA, Type.VALOR, this.row, this.column);
                    }
                } else if (tempL.type === Type.BOOL && tempR.type === Type.CADENA) {
                    if (this.type === Type.SUMA) {
                        return new Value(tempL.value + tempR.value, Type.CADENA, Type.VALOR, this.row, this.column);
                    }
                }
            }
        }
        try{ add_error_E( {error: 'No se Encontrado una Operacion Valida.', type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        return null;
    }

}

export default Arithmetical;