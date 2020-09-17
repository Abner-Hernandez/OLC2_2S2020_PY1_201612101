import { add_error_E } from './Reports';

class Print {
    constructor(val, _type, _type_exp, _row, _column) {
        this.value = val;
        this.type = _type;
        this.type_exp = _type_exp;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        //var count = new Count();
        var e = null;
        if (this.value == null) {
            //error
            try{ add_error_E( {error: "Hubo un error al Ejecutar Imprimir.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){}
            return
        }
        for(var i = 0; i < this.value.length; i++) {
            e = this.value[i].operate(tab);
            if (e != null) {
                console.log(e.value)
            } else {
                //error
                try{ add_error_E( {error: "Hubo un error al Ejecutar Imprimir.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){}
                //count.putError(Type.SEMANTICO, "Hubo un error al Ejecutar Imprimir.", this.row, this.column);
                console.log("errror en la clase Print")
                return
            }
        }
        return null;
    }
}
export default Print;