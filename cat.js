const cat = {
    get: function () {
        let base = 16;
        let bits = 128;

        var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
        for (var i = 2; digits === Infinity; i *= 2) {
            digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
        }

        var rem = digits - (digits | 0);

        var res = '';

        for (var i = 0; i < (digits | 0); i++) {
            var x = ((Math.random() * base) | 0).toString(base);
            res = x + res;
        }

        if (rem) {
            var b = Math.pow(base, rem);
            var x = ((Math.random() * b) | 0).toString(base);
            res = x + res;
        }

        var parsed = parseInt(res, base);
        if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
            return this.get(bits, base)
        }
        else return res;
    },
    food: function () {
        let bits, base, expandBy
        var fn = function (data) {
            var iters = 0;
            do {
                if (iters++ > 10) {
                    if (expandBy) bits += expandBy;
                    else throw new Error('too many ID collisions, use more bits')
                }

                var id = cat.get(bits, base);
            } while (Object.hasOwnProperty.call(cats, id));

            cats[id] = data;
            return id;
        };
        var cats = fn.cats = {};

        fn.get = function (id) {
            return fn.cats[id];
        };

        fn.set = function (id, value) {
            fn.cats[id] = value;
            return fn;
        };

        fn.bits = bits || 128;
        fn.base = base || 16;
        return fn();
    }
}

if ( typeof window !== "undefined" && typeof window.document !== "undefined") {
    window.cat = cat
}

if (typeof process !== "undefined" && process.versions != null && process.versions.node != null) {
    module.exports = cat
}
