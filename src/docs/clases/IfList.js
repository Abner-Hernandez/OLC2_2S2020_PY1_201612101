import Type from './Type';
import SymbolTable from './SymbolTable';
import Value from './Value';
import { add_error_E } from './Reports';

class IfList {
	used = false;
	constructor() {
		this.lif = [];
		this.elsebody = [];
		this.type_exp = Type.SENTENCIA;
	}

	operate(tab) {
		//let count = new Count();

		for (let j = 0; j < this.lif.length; j++) {
			let rr = this.lif[j].exp.operate(tab);
			if (rr === null) {
				//error
				try{ add_error_E( {error: "No se puede ejecutar la instruccion If, se necesita una condicion logica o relacional.", type: 'SINTACTICO', line: this.lif[j].row, column: this.lif[j].column} ); }catch(e){ console.log(e); }
				//count.putError(Type.SINTACTICO, "No se puede ejecutar la instruccion If, se necesita una condicion logica o relacional.", this.lif[j].row, this.lif[j].column);
				return null;
			}
			if (rr.type !== Type.BOOL) {
				try{ add_error_E( {error: "No se puede ejecutar la operacion " + rr.type + ", se necesita una condicion logica o relacional.", type: 'SINTACTICO', line: this.lif[j].row, column: this.lif[j].column} ); }catch(e){ console.log(e); }
				//count.putError(Type.SINTACTICO, "No se puede ejecutar la operacion " + r.type + ", se necesita una condicion logica o relacional.", this.lif[j].row, this.lif[j].column);
				return null
			}
			if (rr.value === true) {
				let s = new SymbolTable(tab);
				for (let i = 0; i < this.lif[j].body.length; i++) {
					if (this.lif[j].body[i].type_exp === Type.RETURN) {
						let reE = this.lif[j].body[i].operate(s);
						if (reE !== null) {
							let r = new Value(reE.value, reE.type, reE.type_exp, reE.row, reE.column);
							r.used = false;
							return r;
						} else {
							let ret = [];
							ret.push(new Value("null", Type.CADENA, Type.VALOR, this.row, this.column));
							let r = new Value(ret, Type.CADENA, Type.VECTOR, this.row, this.column);
							r.used = false;
							return r;
						}

					} else {
						this.lif[j].body[i].used = this.used;
						let eT = this.lif[j].body[i].operate(s);
						if (eT !== null /*&& eT.type_exp === VALOR*/) {
							//                                    if (!eT.used) {
							//                                        eT.used = true;
							return eT;
							//                                    }

						} else if (eT !== null && (eT.type_exp === Type.BREAK || eT.type_exp === Type.CONTINUE)) {
							return eT;
						}
					}
				}
				return null
			}

		}
		if (this.elsebody !== null) {
			//elsebody.used = used;
			//elsebody.execute(tab);
			let body = this.elsebody.body;
			let s = new SymbolTable(tab);
			for (let i = 0; i < body.length; i++) {

				body[i].operate(s);
				if (body[i].type_exp === Type.RETURN) {
                    let reE = body[i].operate(s);
                    if (reE !== null) {
                        let r = new Value(reE.value, reE.type, reE.type_exp, reE.row, reE.column);
                        r.used = false;
                        return r;
                    } else {
                        let ret = [];
                        ret.push(new Value("null", Type.CADENA, Type.VALOR, this.row, this.column));
                        let r = new Value(ret, Type.CADENA, Type.VECTOR, this.row, this.column);
                        r.used = false;
                        return r;
                    }

                } else {
                    body[i].used = this.used;
                    let eT = body[i].operate(s);
                    if (eT !== null && eT.type_exp === Type.VALOR) {
//                        if (!eT.used) {
//                            eT.used = true;
                            return eT;
//                        }

                    } else if (eT !== null && (eT.type_exp === Type.BREAK || eT.type_exp === Type.CONTINUE)) {
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