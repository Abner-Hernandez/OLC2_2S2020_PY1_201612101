import { add_error_E, add_simbol_E } from './Reports';
class SymbolTable{
    
    constructor(_tsuper) {
        if (_tsuper !== null) {
            this.functions = _tsuper.functions;
        }
        this.symbols = [];
        this.tsuper = _tsuper;
        this.types = undefined;
    }

    add_types(types)
    {
        this.types = types;
    }

    find_type(value)
    {   
        let global = this.types;
        let types;
        while(global !== null)
        {
            types = global;
            global = this.tsuper;
        }
        for(let type of types)
        {
            if(type.name === value)
                return type;
        }
        return null;
    }

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
        for (let i=0; i<this.symbols.length; i++) {
            if (name === this.symbols[i].id) {
                return this.symbols[i];
            }
        }
        if (this.tsuper !== null) {
            return this.tsuper.getSymbol(name);
        }
        return null;
    }

    add_simbols_report()
    {
        //{name: $1, type: "undefined", ambit: undefined, row: @1.first_line, column: @1.first_column}
        for (let i=0; i<this.symbols.length; i++) {
            add_simbol_E({name: this.symbols[i].id, type: this.symbols[i].type, ambit: this.symbols[i].type_var, row: this.symbols[i].row, column: this.symbols[i].column});
        }
        if (this.tsuper !== null) {
            return this.tsuper.getSymbol();
        }
        return null;
    }

    exists(val) {
        for (let i=0; i<this.symbols.length; i++) {
            if (this.symbols[i].id === val) {
                return true;
            }
        }
        if (this.tsuper !== null) {
            return this.tsuper.exists(val);
        }
        return false;
    }

    existsDirect(val) {
        for (let i=0; i<this.symbols.length; i++) {
            if (this.symbols[i].id === val) {
                return true;
            }
        }
//        if(tsuper !== null)
//        {
//            return tsuper.exists(val);
//        }
        return false;
    }

    unionTables(t) {
        for (let s in t.symbols) {
            this.addSymbol(s);
        }
    }

    addFunction(fun) {
        if (!this.existsFunction(fun.id)) {
            this.functions.push(fun);
            return true;
        } else {
            try{ add_error_E( {error: "Funcion: "+fun.id+", Ya Declarada.", type: 'SINTACTICO', line: this.row, column: this.column} ); }catch(e){ console.log(e); }
        }
        return false;
    }

    getFunction(name) {
        for (let f =0; f<this.functions.length; f++) {
            if (name === this.functions[f].id) {
                return this.functions[f];
            }
        }
        return null;
    }

    existsFunction(val) {
        for (let f = 0; f< this.functions.length; f++) {
            if (this.functions[f].id === val) {
                return true;
            }
        }
        return false;
    }
}

export default SymbolTable;