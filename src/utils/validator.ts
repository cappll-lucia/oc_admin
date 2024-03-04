const email = (_email: string | null) => {
	const emailValid =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return _email ? emailValid.test(_email) : email;
};

const password = (_psw: string | null) => {
	const passwordValid =
		/^((?=.*\d)(?=.*[a-záéóúíñ])(?=.*[A-ZÁÉÓÚÍÑ])?(.*[@#$%!&?¡¿!])?.{6,30})$/;
	return _psw ? passwordValid.test(_psw) : _psw;
};

const numeric = (_value: number) => {
	if (typeof _value !== 'number' && !_value) return true;
	return /^[0-9]+$/.test(String(_value));
};

const decimal = (_value: number) => {
	const decimalDigit = '1,2';
	const re = new RegExp(`^-?\\d+(?:\\.\\d{${decimalDigit}})?$`);
	return re.test(String(_value));
};

export const validator = {
	email: (_email: string | null) => email(_email),
	password: (_psw: string | null) => password(_psw),
	numeric: (_value: number) => numeric(_value),
	decimal: (_value: number) => decimal(_value),
};
