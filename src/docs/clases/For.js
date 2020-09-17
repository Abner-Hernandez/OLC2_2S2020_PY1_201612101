import Type from'./Type';
import SymbolTable from'./SymbolTable';
import Assignment from'./Assignment';
import Value from'./Value';
import { add_error_E } from './Reports';

class For{
    constructor(_decla, _exp,_assig, _body, _row, _col) {
        this.declaration = _decla;
        this.exp = _exp;
        this.assignment = _assig
        this.body = _body;
        this.row = _row;
        this.column = _col;
    }

    operate(tab) {
        var e = this.exp.operate(tab);
        if (e != null) {
            var s = new SymbolTable(tab);
            s.tsuper = null;
            if (e.type_exp == Type.VALOR) {
                var a = new Assignment(this.id, this.exp, this.row, this.column);
                a.execute(s);
                s.tsuper = tab;
                if (a != null) {
                    for (var i = 0; i < this.body.size(); i++) {
                        if (this.body.get(i).type_exp == Type.RETURN) {
                            var reE = this.body.get(i).operate(s);
                            if (reE != null) {
                                return new Value(reE.value, reE.type, reE.type_exp, reE.row, reE.column);
                            } else {
                                var ret = [];
                                ret.add(new Value("null", Type.CADENA, Type.VALOR, this.row, this.column));
                                return new Value(ret, Type.CADENA, Type.VECTOR, this.row, this.column);
                            }

                        }
                        this.body.get(i).used = true;
                        var eT = this.body.get(i).operate(s);
                        if (eT != null && eT.type_exp == Type.VALOR) {
                            return eT;
                        } else if (eT != null && eT.type_exp == Type.BREAK) {
                            return null;
                        } else if (eT != null && eT.type_exp == Type.CONTINUE) {
                            break;
                        }
                    }
                } else {
                    try{ add_error_E( {error: "ASIGNACION Invalida para " + this.id + ".", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){}
                    //olc2_p1.IDE.txtExec += "Error Semantico, ASIGNACION Invalida para: " + id + ". Linea: " + row + " Columna: " + column + "\n";
                    //olc2_p1.IDE.et.putError(new error.Error(error.Error.TypeError.SEMANTICO, "ASIGNACION Invalida para " + id + ".", row, column));
                    return null;
                }

            } 
            /*
            else  {
                var t = null;
                if (e.type_exp == Type.MATRIZ) {
                    if (e.value == null) {
                        olc2_p1.IDE.txtExec += "Error Semantico, El Tipo para la Matriz es Invalido. Linea: " + row + " Columna: " + column + "\n";
                        olc2_p1.IDE.et.putError(new error.Error(error.Error.TypeError.SEMANTICO, "El Tipo para La Matriz es Invalido.", row, column));
                        return null;
                    }
                    t = ((Matrix) e.value).this.body;
                } else {
                    t = ((LinkedList<Expression>) e.value);
                }
                Assignment a = null;
                boolean continueB = false;
                for (Expression tp : t) {
                    a = new Assignment(id, tp, row, column);
                    a.executeFor(s);
                    s.tsuper = tab;
                    if (a != null) {
                        for (int i = 0; i < this.body.size(); i++) {
                            if (this.body.get(i).type_exp == Type.RETURN) {
                                Expression reE = ((Return) this.body.get(i)).execute(s);
                                if (reE != null) {
                                    return new Value(reE.value, reE.type, reE.type_exp, reE.row, reE.column);
                                } else {
                                    LinkedList<Object> ret = new LinkedList<>();
                                    ret.add(new Value("null", Type.CADENA, Type.VALOR, row, column));
                                    return new Value(ret, Type.CADENA, Type.VECTOR, row, column);
                                }

                            }
                            this.body.get(i).used = true;
                            Expression eT = this.body.get(i).execute(s);
                            if (eT != null && eT.type_exp == Type.VALOR) {
                                return eT;
                            } else if (eT != null && eT.type_exp == Type.BREAK) {
                                return null;
                            } else if (eT != null && eT.type_exp == Type.CONTINUE) {
                                break;
                            }
                        }
                    } else {
                        olc2_p1.IDE.txtExec += "Error Semantico, Hubo un error al realizar la asignacion de la variable \"" + id + "\". Linea: " + row + " Columna: " + column + "\n";
                        olc2_p1.IDE.et.putError(new error.Error(error.Error.TypeError.SEMANTICO, "Hubo un error al realizar la asignacion de la variable " + id + ".", row, column));
                    }
                }
            }
        */
        }
        else {
            //olc2_p1.IDE.txtExec += "Error Semantico, Expresion No Valida para utilizar, se esperaba ID, VECTOR, MATRIZ, LISTA o VECTOR. Linea: " + row + " Columna: " + column + "\n";
            //olc2_p1.IDE.et.putError(new error.Error(error.Error.TypeError.SEMANTICO, "Expresion No Valida para utilizar, se esperaba ID, VECTOR, MATRIZ, LISTA o VECTOR.", row, column));
        }
        return null;
    }
}

export default For;