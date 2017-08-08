let sortNum = ((a, b) => {
    return a - b;
})
let sortDate = ((a, b) => {
    let firstDate = new Date(a);
    let secondDate = new Date(b);

    if (firstDate == secondDate) {
        return 0;
    } else if (firstDate < secondDate) {
        return -1;
    } else {
        return 1;
    }
})

let sortString = ((a, b) => {
    return a == b ? 0 : a < b ? -1 : 1;
})

let sortPer = ((a, b) => {
    return Number(a.replace("%", "")) - Number(b.replace("%", ""));
})

function sortTable(type) {
    let func;
    switch (type) {
        case 'num':
            func = sortNum;
            break;
        case 'date':
            func = sortDate;
            break;
        case 'string':
            func = sortString;
            break;
        case 'percent':
            func = sortPer;
            break;
        default:
            func = sortNum;
            break;
    }

    return func;
}

export default sortTable;
