import { useState, useRef, useEffect } from 'react';

const validateEmail = email => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
var errfn = false,
    errln = false,
    errem = false,
    errp = false,
    errcp = false

const validate = (values) => {
    const errors = [];
    if (values.firstName && values.firstName.length < 3) {
        errors.push({ firstName: "First name too short" });
        errfn = true
    } else {
        errfn = false
    }

    if (values.lastName && values.lastName.length < 3) {
        errors.push({ lastName: "Last name too short" });
        errln = true
    } else {
        errln = false
    }

    if (values.password && values.password.length < 8) {
        errors.push({ password: "Hasło jest za krótkie min 8 znaków" });
        errp = true
    } else {
        errp = false
    }

    if (values.confirmPassword && values.password && values.confirmPassword !== values.password) {
        errors.push({ confirmPassword: "Hasła nie są poprawne" });
        errcp = true
    } else {
        errcp = false
    }

    if (values.email && !(validateEmail(values.email))) {
        errors.push({ email: "Podany email jest nie poprawny" })
        errem = true
    } else {
        errem = false
    }

    return errors;
}

const useForm = initial => {
    const [values, setValues] = useState(initial);
    const [errors, setErrors] = useState([]);
    const [val, setVal] = useState({
        errfn: errfn,
        errln: errln,
        errem: errem,
        errp: errp,
        errcp: errcp,
    })
    const [isCheck, setCheckbox] = useState(false)

    const isFirstRun = useRef(true);

    useEffect(() => {

        if (isFirstRun.current) {
            isFirstRun.current = false;
            console.log("FIRST")
            return;
        } else {
            setErrors(validate(values))
            setVal({
                ...val,
                errfn: errfn,
                errln: errln,
                errem: errem,
                errp: errp,
                errcp: errcp,
            })
        }

    }, [values]);

    const updateValue = e => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const handleCheckbox = name => e => {
        console.log(e.target.checked, e.target.name)
        setCheckbox({ [name]: e.target.checked })
    }

    const submitHandler = e => {
        e.preventDefault();

        if (errors.length === 0) {
            console.log("SEND FRAJERA")
        }
    }
    return [updateValue, submitHandler, errors, val, handleCheckbox, isCheck];
}

export default useForm;