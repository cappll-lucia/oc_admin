const email = (_email: string | null) => {
	const emailValid =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return _email ? emailValid.test(_email) : email;
};

const password = (_psw: string | null) => {
	const passwordValid = /^((?=.*\d)(?=.*[a-záéóúíñ])(?=.*[A-ZÁÉÓÚÍÑ])?(.*[@#$%!&?¡¿!])?.{6,30})$/;
	return _psw ? passwordValid.test(_psw) : _psw;
};

export const validator = {
	email: (_email: string | null) => email(_email),
	password: (_psw: string | null) => password(_psw),
};
