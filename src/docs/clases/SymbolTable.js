import { add_error_E } from './Reports';
class SymbolTable{
    
    constructor(_tsuper) {
        if (_tsuper != null) {
            this.functions = _tsuper.functions;
        }
        this.symbols = [];
        this.tsuper = _tsuper;
        this.types = null;
    }

    add_types(types)
    {
        this.types = types;
    }

    find_type(value)
    {   
        var global = undefined;
        var types;
        while(global != null)
        {
            types = global;
            global = this.tsuper;
        }
        for(var type of types)
        {
            if(type.name == value)
                return type;
        }
        return null;
    }

    /*
    SymbolTable(_tsuper) {
        if (_tsuper != null) 
            this.functions = this.tsuper.functions;
        else
            this.functions = [];
        this.symbols = [];
        this.functions = [];
        this.tsuper = null;
    }
    */

    addSymbol(symb) {
        if (!this.exists(symb.id)) {
            this.symbols.push(symb);
            return true;
        }
        return false;
    }

    addSymbolDirect(symb) {
        this.symbols.push(symb);
        return true;
    }

    getSymbol(name) {
        for (var i=0; i<this.symbols.length; i++) {
            if (name === this.symbols[i].id) {
                return this.symbols[i];
            }
        }
        if (this.tsuper != null) {
            return this.tsuper.getSymbol(name);
        }
        return null;
    }

    exists(val) {
        for (var i=0; i<this.symbols.length; i++) {
            if (this.symbols[i].id === val) {
                return true;
            }
        }
        if (this.tsuper != null) {
            return this.tsuper.exists(val);
        }
        return false;
    }

    existsDirect(val) {
        for (var i=0; i<this.symbols.length; i++) {
            if (this.symbols[i].id === val) {
                return true;
            }
        }
//        if(tsuper != null)
//        {
//            return tsuper.exists(val);
//        }
        return false;
    }

    unionTables(t) {
        for (var s in t.symbols) {
            this.addSymbol(s);
        }
    }

    addFunction(fun) {
        if (!this.existsFunction(fun.id)) {
            this.functions.push(fun);
            return true;
        } else {
            try{ add_error_E( {error: "Funcion: "+fun.id+", Ya Declarada.", type: 'SINTACTICO', line: this.row, column: this.column} ); }catch(e){}
            //olc2_p1.IDE.txtExec += "Error Sintactico, Funcion: "+fun.id+", Ya Declarada. Linea: " + fun.row + " Columna: " + fun.column + "\n";
            //var er = new cont().putError(Type.SINTACTICO, "Funcion: "+fun.id+", Ya Declarada.", fun.row, fun.column);
        }
        return false;
    }

    getFunction(name) {
        for (var f =0; f<this.functions.length; f++) {
            if (name === this.functions[f].id) {
                return this.functions[f];
            }
        }
        return null;
    }

    existsFunction(val) {
        for (var f = 0; f< this.functions.length; f++) {
            if (this.functions[f].id === val) {
                return true;
            }
        }
        return false;
    }
}

export default SymbolTable;