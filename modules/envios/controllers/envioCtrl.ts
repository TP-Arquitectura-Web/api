export function numeroEnvio() {
    return numeroUnico()
}

function numeroUnico() {
    var date = Date.now()

    if (date <= numeroUnico.previo) {
        date = ++numeroUnico.previo
    } else {
        numeroUnico.previo = date
    }

    return date
}

numeroUnico.previo = 0