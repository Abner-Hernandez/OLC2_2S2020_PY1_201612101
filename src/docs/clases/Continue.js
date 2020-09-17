import Type from'./Type';
import Value from'./Value';
import { add_error_E } from './Reports';

class Continue{

    constructor(_type_exp, _row, _column) {
        this.type_exp = _type_exp;
        this.row = _row;
        this.column = _column;
        this.used = false;
    }

    operate(tab) {
        if (this.used) {
            var ret = new Value("", null, Type.CONTINUE, this.row, this.column);
            ret.used = false;
            return ret;
        } else {
            try{ add_error_E( {error: "La Instruccion " + this.type_exp + " No puede estar fuerda de un ciclo FOR, WHILE, DO WHILE.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){}
            //olc2_p1.IDE.txtExec += "Error Semantico, La Instruccion " + type_exp + " No puede estar fuerda de un ciclo FOR, WHILE, DO WHILE. Linea: " + row + " Columna: " + column + "\n";
            //olc2_p1.IDE.et.putError(new error.Error(error.Error.TypeError.SEMANTICO, "La Instruccion " + type_exp + " No puede estar fuerda de un ciclo FOR, WHILE, DO WHILE.", row, column));
            return null;
        }
    }
}

export default Continue;