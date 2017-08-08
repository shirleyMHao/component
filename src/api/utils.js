function isUniq(lists){
    var obj = {};
    for(let i=0,len=lists.length;i<len;i++){
        if(typeof obj[lists[i]] === 'undefined'){
            obj[lists[i]] = 1;
        } else {
            obj[lists[i]] ++;
        }
        if(obj[lists[i]] > 1){
            return false;
            break;
        } else {
            continue;
        }
    }
    return true;
}
function convertProp2Lists(objList,property){
    let lists = [];
    for(let item of objList){
        lists.push(item[property]);
    }
    return lists;
}

function getPropFromArray(array,prop,value){
    let index = -1;
    array.forEach((item,i)=>{
        if(item[prop] === value){
            index = i;
            return false;
        }
    });
    return index;
}

(function () {
    if (!Array.prototype.includes) {
        Object.defineProperty(Array.prototype, 'includes', {
            value: function(searchElement, fromIndex) {

                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If len is 0, return false.
                if (len === 0) {
                    return false;
                }

                // 4. Let n be ? ToInteger(fromIndex).
                //    (If fromIndex is undefined, this step produces the value 0.)
                var n = fromIndex | 0;

                // 5. If n ≥ 0, then
                //  a. Let k be n.
                // 6. Else n < 0,
                //  a. Let k be len + n.
                //  b. If k < 0, let k be 0.
                var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

                // 7. Repeat, while k < len
                while (k < len) {
                    // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                    // b. If SameValueZero(searchElement, elementK) is true, return true.
                    // c. Increase k by 1.
                    // NOTE: === provides the correct "SameValueZero" comparison needed here.
                    if (o[k] === searchElement) {
                        return true;
                    }
                    k++;
                }

                // 8. Return false
                return false;
            }
        });
    }
})()

export default {
    isUniq,
    convertProp2Lists,
    getPropFromArray
}