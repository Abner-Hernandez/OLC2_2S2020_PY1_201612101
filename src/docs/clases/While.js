import Type from './Type';
import SymbolTable from './SymbolTable';
import Value from './Value';
import { add_error_E } from './Reports';

class While {
    used = false;
    constructor(e, c, _row, _column) {
        this.row = _row;
        this.column = _column;
        this.exp = e;
        this.body = c;
        this.type_exp = Type.SENTENCIA;
    }

    operate(tab) {
        let aux = this.exp.operate(tab);
        if (aux !== null) {
            if (aux.type === Type.BOOL) {
                let condicion = aux.value
                while (condicion) {
                    let s = new SymbolTable(tab);
                    for (let i = 0; i<this.body.length; i++) {
                        if (this.body[i].type_exp === Type.RETURN) {
                            let reE = this.body[i].operate(s);
                            if (reE !== null) {
                                return new Value(reE.value, reE.type, reE.type_exp, reE.row, reE.column);
                            } else {
                                let ret = [];
                                ret.push(new Value("null", Type.CADENA, Type.VALOR, this.row, this.column));
                                return new Value(ret, Type.CADENA, Type.VECTOR, this.row, this.column);
                            }

                        }
                        this.body[i].used = true;
                        let eT = this.body[i].operate(s);
                        if (eT !== null && eT.type_exp === Type.BREAK) {
                            return null;
                        } else if (eT !== null && eT.type_exp === Type.CONTINUE) {
                            break;
                        }else if (eT !== null /*&& eT.type_exp === Type.VALOR*/) {
                            return eT;
                        }
                    }
                    aux = this.exp.operate(tab);
                    
                    if (aux.type_exp === Type.VALOR) {
                        condicion = aux.value
                    }
                    
//                    System.out.println("ss: "+ss);
//                    ss++;
                }
            } else {
                try{ add_error_E( {error: "No se puede ejecutar la operacion " + aux.type.toString() + ", se necesita una condicion logica o relacional.", type: 'SINTACTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                //olc2_p1.IDE.et.putError(new error.Error(error.Error.TypeError.SINTACTICO, "No se puede ejecutar la operacion " + aux.type.toString() + ", se necesita una condicion logica o relacional.", row, column));
                return null
            }
        } else {
            //error
        }
        return null;
    }
}
export default While;