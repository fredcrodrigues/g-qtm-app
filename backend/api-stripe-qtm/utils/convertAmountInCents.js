const convertAmountInCents = (value) => {
    // Multiplica o valor por 100 para obter o valor em centavos
    var valueCents = Math.round(value * 100);
    return valueCents;
}

module.exports = convertAmountInCents;