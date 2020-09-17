import Type from './Type';
import SymbolTable from './SymbolTable';
import Value from './Value';
import { add_error_E } from './Reports';

class IfList {
	used = false;
	constructor() {
		this.lif = [];
		this.elsebody = [];
	}

	operate(tab) {
		//var count = new Count();

		for (var j = 0; j < this.lif.length; j++) {
			var rr = this.lif[j].exp.operate(tab);
			if (rr == null) {
				//error
				try{ add_error_E( {error: "No se puede ejecutar la instruccion If, se necesita una condicion logica o relacional.", type: 'SINTACTICO', line: this.lif[j].row, column: this.lif[j].column} ); }catch(e){}
				//count.putError(Type.SINTACTICO, "No se puede ejecutar la instruccion If, se necesita una condicion logica o relacional.", this.lif[j].row, this.lif[j].column);
				return null;
			}
			if (rr.type != Type.BOOL) {
				try{ add_error_E( {error: "No se puede ejecutar la operacion " + r.type + ", se necesita una condicion logica o relacional.", type: 'SINTACTICO', line: this.lif[j].row, column: this.lif[j].column} ); }catch(e){}
				//count.putError(Type.SINTACTICO, "No se puede ejecutar la operacion " + r.type + ", se necesita una condicion logica o relacional.", this.lif[j].row, this.lif[j].column);
				return null
			}
			if (rr.value == true) {
				var s = new SymbolTable(tab);
				for (var i = 0; i < this.lif[j].body.length; i++) {
					if (this.lif[j].body[i].type_exp == Type.RETURN) {
						var reE = this.lif[j].body[i].operate(s);
						if (reE != null) {
							var r = new Value(reE.value, reE.type, reE.type_exp, reE.row, reE.column);
							r.used = false;
							return r;
						} else {
							var ret = [];
							ret.push(new Value("null", Type.CADENA, Type.VALOR, this.row, this.column));
							var r = new Value(ret, Type.CADENA, Type.VECTOR, this.row, this.column);
							r.used = false;
							return r;
						}

					} else {
						this.lif[j].body[i].used = this.used;
						var eT = this.lif[j].body[i].operate(s);
						if (eT != null /*&& eT.type_exp == VALOR*/) {
							//                                    if (!eT.used) {
							//                                        eT.used = true;
							return eT;
							//                                    }

						} else if (eT != null && (eT.type_exp == Type.BREAK || eT.type_exp == Type.CONTINUE)) {
							return eT;
						}
					}
				}
				return null
			}

		}
		if (this.elsebody != null) {
			//elsebody.used = used;
			//elsebody.execute(tab);
			var body = this.elsebody.body;
			var s = new SymbolTable(tab);
			for (var i = 0; i < body.length; i++) {

				body[i].operate(s);
				if (body[i].type_exp == Type.RETURN) {
                    var reE = body[i].operate(s);
                    if (reE != null) {
                        var r = new Value(reE.value, reE.type, reE.type_exp, reE.row, reE.column);
                        r.used = false;
                        return r;
                    } else {
                        var ret = [];
                        ret.push(new Value("null", Type.CADENA, Type.VALOR, this.row, this.column));
                        var r = new Value(ret, Type.CADENA, Type.VECTOR, this.row, this.column);
                        r.used = false;
                        return r;
                    }

                } else {
                    body[i].used = this.used;
                    var eT = body[i].operate(s);
                    if (eT != null && eT.type_exp == Type.VALOR) {
//                        if (!eT.used) {
//                            eT.used = true;
                            return eT;
//                        }

                    } else if (eT != null && (eT.type_exp == Type.BREAK || eT.type_exp == Type.CONTINUE)) {
                        return eT;
                    }
                }

			}
		}
		//error
		return null;
	}

}

export default IfList;