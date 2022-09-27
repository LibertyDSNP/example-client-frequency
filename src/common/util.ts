export const upperFirstLowerRest = (str: string) => {
    const head = (str[0] || "").toUpperCase();
    const rest = str.slice(1).toLowerCase();
    return head + rest;
}

export const camelCaseToTitleCase = (str: string) => {
    let capitalCharRe = /[A-Z]/g;
    const head = (str[0] || "").toUpperCase();
    const rest = str.slice(1).replace(capitalCharRe, " $&");
    return head + rest;
}