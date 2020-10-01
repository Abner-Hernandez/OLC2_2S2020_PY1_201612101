import { add_error_E, add_console } from './Reports';
import Type from './Type';
import Value from './Value';

class Print {
    constructor(val, _type, _type_exp, _row, _column) {
        this.value = val;
        this.type = _type;
        this.type_exp = _type_exp;
        this.row = _row;
        this.column = _column;
    }

    operate(tab) {
        //let count = new Count();
        if (this.value === null) {
            //error
            try{ add_error_E( {error: "Hubo un error al Ejecutar Imprimir.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
            return
        }
        for(let i = 0; i < this.value.length; i++) {
            let e = this.value[i].operate(tab);
            if (e !== null) {
                if(e.type === Type.ENTERO || e.type === Type.BOOL || e.type === Type.CADENA)
                {
                    try{ add_console(e.value.toString()); }catch(e){ console.log(e); }
                }
                else
                {
                    try{ add_console(JSON.stringify(this.get_print(e)), tab); }catch(e){ console.log(e); }
                }

            } else {
                //error
                try{ add_error_E( {error: "Hubo un error al Ejecutar Imprimir.", type: 'SEMANTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
                console.log("errror en la clase Print")
                return
            }
        }
        return null;
    }
    get_print(variable, tab)
    {
        let returnvar = [];
        let objeto = {};
        if(variable.type !== Type.ARREGLO)
        {
            for(let dat in variable.value)
            {
                if(variable.value[dat][1].type === Type.ENTERO || variable.value[dat][1].type === Type.BOOL || variable.value[dat][1].type === Type.CADENA)
                {
                    objeto[variable.value[dat][0]] = variable.value[dat][1].value;
                }else if(variable.value[dat][1].type === undefined && variable.value[dat][1].value === undefined)
                {
                    objeto[variable.value[dat][0]] = "null";
                }else if(variable.value[dat][1].type === Type.ID)
                {
                    let tmpExp = variable.value[dat][1].operate(tab);
                    objeto[variable.value[dat][0]] = this.get_print(tmpExp);

                }else //if(variable.value[dat][1].type != Type.ARREGLO)
                {
                    objeto[variable.value[dat][0]] = this.get_print(variable.value[dat][1]);
                }
                /*
                else if(variable.value[dat][1].type === Type.ARREGLO)
                    objeto[variable.value[dat][0]] = this.get_print(variable.value);
                */

            }
            return objeto;
        }else if(variable.type === Type.ARREGLO)
        {
            for(let element in variable.value)
            {
                if(variable.value[element] instanceof Value)
                {
                    if(variable.value[element].type === Type.ENTERO || variable.value[element].type === Type.BOOL || variable.value[element].type === Type.CADENA)
                    {
                        returnvar[element] = variable.value[element].value;
                    }else if(variable.value[element].type === Type.ID)
                    {
                        let tmpExp = variable.value[element].operate(tab);
                        returnvar[element] = this.get_print(tmpExp);
    
                    }else //if(variable.value[element].type != Type.ARREGLO)
                    {
                        returnvar[element] = this.get_print(variable.value[element]);
                    }
                    /*else if(variable.value[element].type === Type.ARREGLO)
                        returnvar[element] = this.get_print(variable.value[element]);
                        */
                }
            }
            return returnvar;
        }
    }
}
export default Print;